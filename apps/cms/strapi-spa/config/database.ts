export default ({ env }) => ({
  connection: {
    client: 'mysql',
    connection: {
      host: env('DATABASE_HOST', 'avid-strapi-db.mysql.database.azure.com'),
      port: env.int('DATABASE_PORT', 3306),
      database: env('DATABASE_NAME', 'strapi'),
      user: env('DATABASE_USERNAME', 'asingh1@avid-strapi-db'),
      password: env('DATABASE_PASSWORD', 'hi#867Ke'),
      ssl: env.bool('DATABASE_SSL', false),
    },
  },
});
