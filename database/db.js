const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'app.db');

// Initialize SQLite database
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error opening database', err);
    } else {
        console.log('Database connected successfully');
        // db.run(`CREATE TABLE IF NOT EXISTS users (
        //     id INTEGER PRIMARY KEY AUTOINCREMENT,
        //     name TEXT NOT NULL,
        //     email TEXT UNIQUE NOT NULL,
        //     contact_no TEXT NOT NULL,
        //     password TEXT NOT NULL
        // )`, (err) => {
        //     if (err) {
        //         console.error('Error creating users table:', err);
        //     } else {
        //         console.log('Users table is ready');
        //     }
        // });
    }
});

module.exports = db; // Export the database connection
