/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
 
}


module.exports = {
  env: {
    MONGO_URI: process.env.MONGO_URI,
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
    BASE_URL: process.env.BASE_URL,
    SECRET_KEY: process.env.SECRET_KEY,
    NODEMAILER_EMAIL: process.env.NODEMAILER_EMAIL,
    NODEMAILER_PASS: process.env.NODEMAILER_PASS,
    URL: process.env.URL,
    SERIAL_NO: process.env.SERIAL_NO,
    DOMAIN: process.env.DOMAIN,
    PROTOCOL: process.env.PROTOCOL,
    USER_NAME: process.env.USER_NAME,
    PASSWORD: process.env.PASSWORD,
    APP_ID: process.env.APP_ID,
    COMPANY: process.env.COMPANY,
    MODULE: process.env.MODULE,
    REFID: process.env.REFID,
    VERSION: process.env.VERSION,
    NODE_ENV: process.env.NODE_ENV,
  },
};


module.exports = nextConfig
