// Define web domains that can access your backend data that CORS will not prevent
const whitelist = [
    'https://dazzling-snickerdoodle-777101.netlify.app',
    'https://www.yoursite.com', 
    'http://127.0.0.1:5500', 
    'http://localhost:3500'
];

const corsOptions = {
    origin: (origin, callback) => {
        if (whitelist.indexOf(origin) !== -1 || !origin) {
            callback(null, true)
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    }, 
    optionsSuccessStatus: 200
}

module.exports = corsOptions;