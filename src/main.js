const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcrypt'); 

const dbDir = path.join(__dirname, '..', 'database'); // Move up one level from src
const dbPath = path.join(dbDir, 'app.db');

const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error opening database', err);
    } else {
        console.log('Database connected');
        createUsersTable(); 
    }
});

function createUsersTable() {
    db.run(
        `CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            contact_no TEXT NOT NULL,
            password TEXT NOT NULL
        );`,
        (err) => {
            if (err) {
                console.error('Error creating users table:', err);
            } else {
                console.log('Users table is ready');
            }
        }
    );
}

function checkDatabaseContent() {
    db.all('SELECT * FROM users', [], (err, rows) => {
        if (err) {
            console.error('Error checking database content:', err);
        } else {
            console.log('Current database content:', rows);
        }
    });
}

db.on('open', () => {
    console.log('Database opened, checking content...');
    checkDatabaseContent();
});

function createWindow() {
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),  // ✅ Correct path
            contextIsolation: true,
            enableRemoteModule: false,
            nodeIntegration: false  // ✅ Must remain false for security
        }
    });

    win.loadFile(path.join(__dirname, '..', 'signup.html')).catch(err => {
        console.error('Failed to load signup.html:', err);
    });
}

app.whenReady().then(() => {
    console.log('App is ready');
    createWindow();
}).catch(err => {
    console.error('Failed to create window:', err);
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});

ipcMain.handle('create-user', async (event, userData) => {
    try {
        const { name, email, contact, password } = userData;

        console.log('Extracted fields:', {
            name,
            email,
            contact, // This should not be undefined
            password: password ? '[PRESENT]' : '[MISSING]'
        });
        
        // // Check if user already exists
        const existingUser = await db.get(
            'SELECT email FROM users WHERE email = ?',
            [email]
        );
        
        console.log('Existing user:', existingUser);
        // if (existingUser) {
        //     return { 
        //         success: false, 
        //         error: 'Email already registered' 
        //     };
        // }


        // Hash password before storing (using bcrypt)
        const hashedPassword = await bcrypt.hash(password, 10);
        
        // Insert new user
        const result = await db.run(
            'INSERT INTO users (name, email, contact_no, password) VALUES (?, ?, ?, ?)',
            [name, email, contact, hashedPassword]
        );
        return {
            success: true,
            userId: this.lastID
        };
    } catch (error) {
        return {
            success: false,
            error: error.message || 'Failed to create user'
        };
    }
});

ipcMain.handle('login-user', async (event, loginData) => {
    const { email, password } = loginData; // Extract email and password
    return new Promise((resolve, reject) => {
        const query = 'SELECT id, password FROM users WHERE email = ?';
        db.get(query, [email], async (err, user) => {
            if (err) {
                reject({ success: false, error: 'Database error' });
            } else if (!user) {
                resolve({ success: false, error: 'User not found' });
            } else {
                const match = await bcrypt.compare(password, user.password);
                if (match) {
                    resolve({ success: true, userId: user.id });
                } else {
                    resolve({ success: false, error: 'Incorrect password' });
                }
            }
        });
    });
});