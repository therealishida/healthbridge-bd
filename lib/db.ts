import postgres from 'postgres';

const connectionString = process.env.POSTGRES_URL || process.env.POSTGRES_URL_NON_POOLING;

const sqlClient = connectionString ? postgres(connectionString, { ssl: 'require' }) : null;

export const sql = async (strings: TemplateStringsArray, ...values: any[]): Promise<{ rows: any[] }> => {
  if (!sqlClient) {
    throw new Error('Database connection string is not defined (POSTGRES_URL or POSTGRES_URL_NON_POOLING).');
  }
  // @ts-ignore
  const result = await sqlClient(strings, ...values);
  return { rows: result };
};
