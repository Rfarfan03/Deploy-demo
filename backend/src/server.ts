import "dotenv/config";
import express from "express";
import cors from "cors";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "./generated/prisma/client.js";

// `pg` trata sslmode=require como verificación completa del certificado, lo que falla con RDS
// sin el CA bundle de Amazon. Para el demo lo quitamos de la URL y usamos SSL sin validar la CA.
const dbUrl = new URL(process.env.DATABASE_URL!);
dbUrl.searchParams.delete("sslmode");
const adapter = new PrismaPg({
  connectionString: dbUrl.toString(),
  ssl: { rejectUnauthorized: false },
});
const prisma = new PrismaClient({ adapter });

const app = express();
// [AWS Paso 1 / Paso 8] En ECS se define FRONTEND_URL con la URL de Amplify
// (ej. https://main.xxxxx.amplifyapp.com) para que solo ese origen pueda llamar a la API.
// En local, sin la variable, se permite cualquier origen ('*').
app.use(cors({ origin: process.env.FRONTEND_URL || "*" }));
app.use(express.json());

// [AWS Paso 1 / Paso 4] Health check que usa el balanceador de ECS Express Mode.
// No toca la base de datos a propósito: si RDS tiene un problema, el contenedor no se reinicia en bucle.
app.get("/health", (_req, res) => {
  res.send("ok");
});

app.get("/api/contacts", async (_req, res) => {
  const contacts = await prisma.contact.findMany({ orderBy: { createdAt: "desc" } });
  res.json(contacts);
});

app.post("/api/contacts", async (req, res) => {
  const { email, firstName, lastName, phone } = req.body;
  if (!email || !firstName || !lastName || !phone) {
    return res.status(400).json({ error: "Todos los campos son obligatorios" });
  }
  try {
    const contact = await prisma.contact.create({ data: { email, firstName, lastName, phone } });
    res.status(201).json(contact);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "No se pudo guardar en la base de datos" });
  }
});

// [AWS Paso 1] ECS puede asignar el puerto vía la variable PORT; en local se usa 3000.
const port = Number(process.env.PORT) || 3000;
app.listen(port, () => console.log(`API escuchando en el puerto ${port}`));
