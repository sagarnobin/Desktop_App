# My Electron App

This is a simple Electron application that demonstrates the basic structure and functionality of an Electron app.

## Project Structure

```
my-electron-app
├── src
│   ├── main.js        # Main process of the Electron application
│   ├── renderer.js    # Renderer process for UI interactions
│   ├── db.js          # Database interactions
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
   ```
   git clone <repository-url>
   cd my-electron-app
   ```

2. **Install dependencies:**
   ```
   npm install
   ```

3. **Run the application:**
   ```
   npm start
   ```

## Usage

Once the application is running, you will see the main window displaying the user interface defined in `signup.html`. You can navigate to the login and profile pages as needed. The UI interactions are managed by `renderer.js`, while the main application logic is handled in `main.js`.

## License

This project is licensed under the MIT License.