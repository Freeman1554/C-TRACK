import dotenv from "dotenv";
dotenv.config();

export default {
    ENVIRONMENT: process.env.ENVIRONMENT || "development",
    PORT: Number(process.env.PORT || 4000),
    DATABASE_NAME: process.env.DATABASE_NAME || "c-track",
    DATABASE_USERNAME: process.env.DATABASE_USERNAME || " ",
    DATABASE_PASSWORD: process.env.DATABASE_PASSWORD || " ",
    DATABASE_HOST: process.env.DATABASE_HOST || "localhost",
    DATABASE_PORT: Number(process.env.DATABASE_PORT || 3306),
    DATABASE_DIALECT: process.env.DATABASE_DIALECT || "mysql",
    REDIS_TTL: Number(process.env.REDIS_TTL || 300),
    REDIS_URL: process.env.REDIS_URL || "redis://localhost:6379",
    SMTP_HOST: process.env.SMTP_HOST || "sandbox.smtp.mailtrap.io",
    SMTP_PORT: Number(process.env.SMTP_PORT || 2525),
    SMTP_USER: process.env.SMTP_USER || "development",
    SMTP_PASSWORD: process.env.SMTP_PASSWORD || "devpass",
    SMTP_SECURE: process.env.SMTP_SECURE || "false",
    TYPICODE_API_URL: process.env.TYPICODE_API_URL || "https://jsonplaceholder.typicode.com",
    TYPICODE_BASE_API_KEY: process.env.TYPICODE_BASE_API_KEY || "",
    JWT_SECRET: process.env.JWT_SECRET || "your-secret",
    JWT_EXPIRES_IN: Number(process.env.JWT_EXPIRES_IN || 7200),
    JWT_REFRESH_EXPIRES_IN: Number(process.env.JWT_REFRESH_EXPIRES_IN || 25200),
    JWT_OTP_SECRET: process.env.JWT_OTP_SECRET || "getitnow",
    OTP_EXPIRY_TIME_MINS: Number(process.env.OTP_EXPIRY_TIME_MINS || 1200),
}