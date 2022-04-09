const electron = require('electron');
const url = require('url');
const path = require('path');
const shell = require('electron').shell;
const mysql = require('mysql');
const fs = require('fs');
const isDev = require('electron-is-dev');

// Objects coming from electron
const {
    app,
    BrowserWindow,
    Menu,
    ipcMain,
    dialog
} = electron;

// !!! SET process environment. Comment this out if packaging for development!!!
//process.env.NODE_ENV = 'production';

// Global variables for the scope of our app. This represents the main window and any additional windows plus our top menu.
let mainWindow;
let mainMenuTemplate;

// Listen for app to ready
app.on('ready', function () {
    createIPCChannels();
    displayMainWindow();
});

/**
 * Create the main window for the main process. Most of the application interaction 
 * will be from this window. Docs can be found here: https://www.electronjs.org/docs/latest/api/browser-window
 */
function displayMainWindow() {
    // Create new window
    mainWindow = new BrowserWindow({
        // This is to allow node code to run in html
        webPreferences: {
            nodeIntegration: false,
            enableRemoteModule: true,
            contextIsolation: true,
            preload: path.join(__dirname, 'preload.js')
        },
        width: 1281,
        height: 800,
        minWidth: 1281,
        minHeight: 800,
        icon: './../src/assets/icons/png/logo-desktop.png'
    });

    /**
     * Load main.html into window
     * This syntax is just //__dirname/mainWindow.html
     *  __dirname gets the relative path of THIS file (electron.js)
     * 
     * This syntax loads the file and opens it as a window.
    */
    mainWindow.loadURL(isDev ? 'http://localhost:3000' : `file://${path.join(__dirname, '../build/index.html')}`);

    // Quit entire application when main process is closed
    mainWindow.on('closed', function () {
        app.quit();
    });

    // Build menu from template
    buildMainMenuTemplate();
    const mainMenu = Menu.buildFromTemplate(mainMenuTemplate);

    // Insert menu
    Menu.setApplicationMenu(mainMenu);
}


/**
 * Builds the top menu that will be used by our electron app.
 */
function buildMainMenuTemplate() {
    // The template that is used for our menu at the top of our application.
    mainMenuTemplate = [{
        label: 'File',
        submenu: [
            {
                label: 'Quit',
                accelerator: process.platform == 'darwin' ? 'Command+Q' : 'Ctrl+Q', // Adds hotkey of Q
                click() {
                    app.quit();
                }
            }
        ]
    },
    {
        label: 'Help',
        submenu: [
            {
                label: 'Customize Here'
            },
            {
                label: 'Electron App Repo',
                click() {
                    shell.openExternal('https://github.com/anshulBharath/electron-app-template');
                }
            },
            {
                label: 'Electron Docs for Menu',
                click() {
                    shell.openExternal('https://www.electronjs.org/docs/latest/api/menu)');
                }
            }
        ]
    },
];

    // If mac, add empty object to menu template
    if (process.platform == 'dawrwin') {
        mainMenuTemplate.unshift({});
    }

    // Add developer tools item if not in production
    if (process.env.NODE_ENV !== 'production') {
        mainMenuTemplate.push({
            label: 'Developer Tools',
            submenu: [{
                    label: 'Toggle Dev Tools',
                    accelerator: process.platform == 'darwin' ? 'Command+I' : 'Ctrl+I', // Adds hotkey of I
                    click(item, focusedWindow) {
                        focusedWindow.toggleDevTools();
                    }
                },
                {
                    role: 'reload'
                }
            ]
        });
    }

}

// This is the object that handles all database/API requests
const DatabaseService = require('../src/utils/services/databaseService');
let DB = new DatabaseService();

/**
 * Inter Process Communication is used to communicate to the UI which
 * is the React App. The channels for the IPC channels are set up in public/preload.js.
 * 
 * This function will provide a sample to set up these IPC channels. Most of the time this function 
 * should be run at the start of the application.
 */
function createIPCChannels() {
    // IPC Signal Button
    ipcMain.on("toMain:Signal", (event, args) => {
        console.log('IPC LOG--> ' + args);

        mainWindow.webContents.send('fromMain:Signal', "Hello from main!");
    });

    ipcMain.on("toMain:Token", (event, args) => {
        console.log('IPC LOG--> ' + args);
        
        //Making call to Database service, where you can house any outside API calls.
        let token = DB.getToken();

        mainWindow.webContents.send('fromMain:Token', token);
    });
}
