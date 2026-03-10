import dotenv from "dotenv";

dotenv.config();

interface EnvConfig {
  // Serveur
  PORT: number;
  NODE_ENV: string;

  // Supabase
  SUPABASE_URL: string;
  SUPABASE_ANON_KEY: string;
  SUPABASE_SERVICE_ROLE_KEY: string;

  // JWT
  JWT_SECRET: string;
  JWT_EXPIRES_IN: string;

  // Admin Seed
  ADMIN_NAME: string;
  ADMIN_EMAIL: string;
  ADMIN_PASSWORD: string;

  // Storage
  STORAGE_BUCKET_BOOKS: string;
  STORAGE_BUCKET_COVERS: string;
  MAX_FILE_SIZE_MB: number;
  MAX_COVER_SIZE_MB: number;
}

function getEnvVar(key: string): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(`❌ Variable d'environnement manquante : ${key}`);
  }
  return value;
}

function getEnvVarOptional(key: string, defaultValue: string): string {
  return process.env[key] || defaultValue;
}

export const env: EnvConfig = {
  PORT: parseInt(getEnvVarOptional("PORT", "3000"), 10),
  NODE_ENV: getEnvVarOptional("NODE_ENV", "development"),

  SUPABASE_URL: getEnvVar("SUPABASE_URL"),
  SUPABASE_ANON_KEY: getEnvVar("SUPABASE_ANON_KEY"),
  SUPABASE_SERVICE_ROLE_KEY: getEnvVar("SUPABASE_SERVICE_ROLE_KEY"),

  JWT_SECRET: getEnvVar("JWT_SECRET"),
  JWT_EXPIRES_IN: getEnvVarOptional("JWT_EXPIRES_IN", "24h"),

  ADMIN_NAME: getEnvVarOptional("ADMIN_NAME", "Admin"),
  ADMIN_EMAIL: getEnvVarOptional("ADMIN_EMAIL", "admin@digitallibrary.bf"),
  ADMIN_PASSWORD: getEnvVarOptional("ADMIN_PASSWORD", ""),

  STORAGE_BUCKET_BOOKS: getEnvVarOptional("STORAGE_BUCKET_BOOKS", "books"),
  STORAGE_BUCKET_COVERS: getEnvVarOptional("STORAGE_BUCKET_COVERS", "covers"),
  MAX_FILE_SIZE_MB: parseInt(getEnvVarOptional("MAX_FILE_SIZE_MB", "50"), 10),
  MAX_COVER_SIZE_MB: parseInt(getEnvVarOptional("MAX_COVER_SIZE_MB", "5"), 10),
};
