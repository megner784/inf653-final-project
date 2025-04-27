require('dotenv').config();

const connectDB  = require('./config/dbConn');
const express      = require('express');
const app          = express();
const path         = require('path');
const cors         = require('cors');
const corsOptions  = require('./config/corsOptions');
const { logger }   = require('./middleware/logEvents');
const errorHandler = require('./middleware/errorHandler');

const PORT         = process.env.PORT || 3500;

// Middleware used to get JSON data 
app.use(express.json());

// Connect to MongoDB Atlas
connectDB();

// custom middleware logger 
app.use(logger);

// Cross Origin resource Sharing
app.use(cors(corsOptions));  

// built-in middleware to handle urlencoded form data
app.use(express.urlencoded({ extended: false }));           // this will apply to all routes below

// Middleware used to serve up static files (e.g., CSS, JPG, TXT, etc.)
//app.use('/', express.static(path.join(__dirname, '/public')));
app.use(express.static(path.join(__dirname, 'public'))); // Serves files from /public
app.use(express.static(path.join(__dirname, 'views')));  // Serves files from /views

// Route Handlers
app.post('/test', (req, res) => {
    console.log("Test endpoint hit. Body received:", req.body);
    res.json(req.body);
});


app.use('/', require('./routes/root'));

console.log("Loading funfactRoutes...");
app.use('/states', require('./routes/api/funfactRoutes'));
console.log("funfactRoutes successfully loaded!");

app.use('/states', require('./routes/api/stateRoutes'))

// express will act as a waterfall by going through each app.get() in order from top to bottom in a procedural fashion.
// Your default route or "catchall" route should be placed at the very end

// app.use('/')  // Doesn't allow use of Regex and is more apt to be used by middleware

app.use(errorHandler);

// app.all() will apply to all http methods and also processes Regex expressions
app.all('*', (req, res) => { 
    res.status(404);
    if (req.accepts('html')) {
        res.sendFile(path.join(__dirname, 'views', '404.html'));
    } else if (req.accepts('json')) {
        res.json( { error: "404 Not Found"} );
    } else {
        res.type('txt').send("404 Not Found");
    }
});

app._router.stack.forEach(layer => {
    if (layer.route) {
        console.log(`Registered route: ${layer.route.path}`);
    }
});

// Handle Uncaught Exceptions
process.on('uncaughtException', err => {
    console.error("Unhandled Exception:", err);
    process.exit(1); // Exit the process to avoid inconsistent state
});

// Handle Unhandled Promise Rejections
process.on('unhandledRejection', err => {
    console.error("Unhandled Promise Rejection:", err);
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));