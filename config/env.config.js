const envConfig = {
    // Environment
    NODE_ENV: process.env.NODE_ENV || 'development',
    isDevelopment: process.env.NODE_ENV !== 'production',
    isProduction: process.env.NODE_ENV === 'production',
    isTest: process.env.NODE_ENV === 'test',

    // Server
    PORT: process.env.PORT || 5000,

    // Database
    MONGODB_URI: process.env.MONGODB_URI || 'mongodb://localhost:27017/student_management',

    // JWT
    JWT_SECRET: process.env.JWT_SECRET || 'dev-secret-key-change-in-production',
    JWT_EXPIRE: process.env.JWT_EXPIRE || '7d',

    // CORS
    CLIENT_URL: process.env.CLIENT_URL || 'http://localhost:5173',

    // Cloudinary
    CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
    CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
    CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET,

    // Logging
    LOG_LEVEL: process.env.LOG_LEVEL || (process.env.NODE_ENV === 'production' ? 'info' : 'debug')
};

// Validate required environment variables in production
if (envConfig.isProduction) {
    const required = ['MONGODB_URI', 'JWT_SECRET', 'CLOUDINARY_CLOUD_NAME', 'CLOUDINARY_API_KEY', 'CLOUDINARY_API_SECRET'];
    const missing = required.filter(key => !envConfig[key]);

    if (missing.length > 0) {
        console.error(`[ERROR] Missing required environment variables: ${missing.join(', ')}`);
        process.exit(1);
    }
}

module.exports = envConfig;
