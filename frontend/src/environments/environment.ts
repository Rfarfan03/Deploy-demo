// [AWS Paso 5] Environment de producción (lo usa `ng build`, que es lo que corre Amplify).
// Reemplazar por la URL HTTPS que entrega ECS Express Mode, SIN "/" al final.
export const environment = {
  production: true,
  apiUrl: 'https://ba-58656a40385945849f93dad9301ebccc.ecs.us-east-2.on.aws ',
};
