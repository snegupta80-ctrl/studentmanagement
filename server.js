require('dotenv').config();
const app = require('./app');
const config = require('./config/app.config');
const connectDB = require('./config/db');

// Connect to MongoDB
connectDB();

app.listen(config.PORT, () => {
    console.log(`Server running on port ${config.PORT}`);
});
