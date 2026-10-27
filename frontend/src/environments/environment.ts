// [AWS Paso 5] Environment de producción (lo usa `ng build`, que es lo que corre Amplify).
// Reemplazar por la URL HTTPS que entrega ECS Express Mode, SIN "/" al final.
export const environment = {
  production: true,
  apiUrl: 'https://LA-URL-QUE-ENTREGO-AWS',
};
