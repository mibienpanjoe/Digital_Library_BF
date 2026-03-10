import { User } from "./user.types";

declare global {
  namespace Express {
    interface Request {
      user?: User;
    }
  }
}

declare namespace NodeJS {
  interface ProcessEnv {
    PORT?: string;
    NODE_ENV?: string;
    SUPABASE_URL?: string;
    SUPABASE_ANON_KEY?: string;
    SUPABASE_SERVICE_ROLE_KEY?: string;
    JWT_SECRET?: string;
    JWT_EXPIRES_IN?: string;
    ADMIN_NAME?: string;
    ADMIN_EMAIL?: string;
    ADMIN_PASSWORD?: string;
    STORAGE_BUCKET_BOOKS?: string;
    STORAGE_BUCKET_COVERS?: string;
    MAX_FILE_SIZE_MB?: string;
    MAX_COVER_SIZE_MB?: string;
  }
}
