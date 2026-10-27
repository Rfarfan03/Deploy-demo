# Prisma + AWS RDS demo

## 1. Connection string
Edita `backend/.env` → `DATABASE_URL` con el endpoint de tu instancia RDS.

## 2. Backend (puerto 3000)
```bash
cd backend
npm run migrate   # crea la tabla Contact en RDS
npm run dev
```

## 3. Frontend (puerto 4200)
```bash
cd frontend
npm start
```
Abre http://localhost:4200

## 4. Despliegue en AWS (ver la guía PDF)

### Backend → ECR + ECS Express Mode
```bash
cd backend
docker build -t mi-backend .        # usa los "View push commands" de ECR para login/tag/push
```
En el servicio ECS Express Mode:
- Puerto del contenedor: `3000` · Health check path: `/health`
- Variables de entorno:
  - `DATABASE_URL` → la misma connection string de RDS (no va dentro de la imagen)
  - `FRONTEND_URL` → la URL de Amplify, p. ej. `https://main.xxxxx.amplifyapp.com` (sin `/` final)
- El security group de RDS debe aceptar el puerto 5432 desde el security group de las tareas de ECS.

### Frontend → Amplify
1. Pon la URL HTTPS de ECS en `frontend/src/environments/environment.ts` (`apiUrl`).
2. Push a GitHub y conecta el repo en Amplify (monorepo, root `frontend`). El build usa `amplify.yml`.
3. Agrega la regla de rewrite del Paso 7 de la guía (target `/index.html`, tipo 200).
