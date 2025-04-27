/*
const mongoose = require('mongoose');

const connectDB = async () => {
   
    await mongoose.connect(process.env.DATABASE_URI)
    .then( () => console.log('Connected to MongoDB Atlas'))
    .catch(err => console.error('Error connecting to MongoDB Atlas', err));
}

module.exports = connectDB
*/

const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.DATABASE_URI); // No need for deprecated options
        console.log('Connected to MongoDB Atlas');
    } catch (err) {
        console.error('Error connecting to MongoDB Atlas:', err);
        process.exit(1);
    }
};

module.exports = connectDB;

