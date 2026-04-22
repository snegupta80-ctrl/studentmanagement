const getTimestamp = () => {
    return new Date().toISOString();
};

const logger = {
    info: (message) => {
        console.log(`[${getTimestamp()}] [INFO]: ${message}`);
    },
    error: (message, error) => {
        console.error(`[${getTimestamp()}] [ERROR]: ${message}`, error || '');
    },
    warn: (message) => {
        console.warn(`[${getTimestamp()}] [WARN]: ${message}`);
    },
    debug: (message) => {
        if (process.env.NODE_ENV === 'development') {
            console.log(`[${getTimestamp()}] [DEBUG]: ${message}`);
        }
    }
};

module.exports = logger;
