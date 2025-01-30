# My Electron App


This is a desktop application built with Electron.js and SQLite as an in-memory database. The application offers a simple yet effective platform for managing user profiles with basic functionalities such as signup, login, profile editing, updating, and deletion. User passwords are securely stored as hashed values in the local database, ensuring data privacy and security.

## Project Structure

```
my-electron-app
├── src
│   ├── main.js        # Main process of the Electron application
│   ├── renderer.js    # Renderer process for UI interactions        
│   ├── preload.js     # Preload script
├── signup.html        # Signup page
├── login.html         # Login page
├── profile.html       # Profile page
├── styles.css         # CSS styles
├── package.json       # Configuration file for npm
└── README.md          # Documentation for the project
```

## Setup Instructions

1. **Clone the repository:**
   ```sh
   git clone <repository-url>
   cd my-electron-app
   ```

2. **Install dependencies:**
   ```sh
   npm install
   ```

3. **Run the application:**
   ```sh
   npm start
   ```

## Usage

Once the application is running, you will see the main window displaying the user interface defined in `signup.html`. You can navigate to the login and profile pages as needed. The UI interactions are managed by `renderer.js`, while the main application logic is handled in `main.js`.

### Signup

1. Open the application.
2. Fill in the signup form with your name, email, contact number, and password.
3. Click the "Signup" button.
4. If the signup is successful, you will be redirected to the login page.

### Login

1. Open the application.
2. Click the "Login" button in the top-right corner or navigate to the login page.
3. Fill in your email and password.
4. Click the "Login" button.
5. If the login is successful, you will be redirected to the profile page.

### Profile Update

1. Open the application and log in.
2. Navigate to the profile page.
3. Update your name, email, or contact number.
4. Click the "Update" button.
5. If the update is successful, you will see a success message.

## License

This project is licensed under the MIT License.
