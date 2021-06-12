import 'dotenv/config';

export const config = {
  dev: process.env.NODE_ENV !== 'production',
  port: process.env.PORT || 8080,
  cors: process.env.CORS || '*',
  dbUser: process.env.DB_USER || '',
  dbPassword: process.env.DB_PASSWORD || '',
  dbHost: process.env.DB_HOST || '',
  dbName: process.env.DB_NAME || '',
  defaultAdminPassword: process.env.DEFAULT_ADMIN_PASSWORD || '',
  defaultUserPassword: process.env.DEFAULT_USER_PASSWORD || '',
  authJwtSecret: process.env.AUTH_JWT_SECRET || '',
  publicApiKeysToken: process.env.PUBLIC_API_KEYS_TOKEN || '',
  adminApiKeysToken: process.env.ADMIN_API_KEYS_TOKEN || '',
  managerApiKeysToken: process.env.MANAGER_API_KEYS_TOKEN || '',
  teacherApiKeysToken: process.env.TEACHER_API_KEYS_TOKEN || '',
  studentApiKeysToken: process.env.STUDENT_API_KEYS_TOKEN || '',
}
