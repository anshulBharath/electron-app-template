const electron = require('electron');
const url = require('url');
const path = require('path');
const shell = require('electron').shell;
const mysql = require('mysql');
const fs = require('fs');
const isDev = require('electron-is-dev');
const {
    ipcRenderer
} = require('electron');

// Objects coming from electron
const {
    app,
    BrowserWindow,
    Menu,
    ipcMain
} = electron;

// !!! SET process environment. Comment this out if packaging for development!!!
//process.env.NODE_ENV = 'production';

// Global variables for the scope of our app. This represents the main window and any additional windows plus our top menu.
let mainWindow;
let addWindow;
let mainMenuTemplate;

// Listen for app to ready
app.on('ready', function () {
    createMainWindow();
    createIPCChannels();
});

/**
 * Create the main window for our main process. Most of the application interaction 
 * will be from this window.
 */
function createMainWindow() {
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

    // Load main.html into window
    // This syntax is just //__dirname/mainWindow.html
    // __dirname gets the relative path of THIS file (main.js)
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
 * We are not using this currently. We may be able to add functionality 
 * later on or just remove this.
 */
function createAddWindow() {
    addWindow = new BrowserWindow({
        // This is to allow node code to run in html
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
        },
        width: 300,
        height: 200,
        title: 'Add Shopping List Item',
        parent: mainWindow,
        modal: true
    });

    // Load main.html into window
    // This syntax is just //__dirname/mainWindow.html
    addWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'addWindow.html'),
        protocol: 'file:',
        slashes: true
    }));

    // Garbage collection handle
    addWindow.on('close', function () {
        addWindow = null;
    });
}

/**
 * Builds the top menu that will be used by our electron app.
 */
function buildMainMenuTemplate() {
    // The template that is used for our menu at the top of our application.
    mainMenuTemplate = [{
        label: 'File',
        submenu: [{
                label: 'Add Item',
                click() {
                    createAddWindow();
                }
            },
            {
                label: 'Clear Items',
                click() {
                    mainWindow.webContents.send('item:clear');
                }
            },
            {
                type: 'separator'
            },
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
        submenu: [{
            label: 'About',
            click() {
                shell.openExternal('https://github.com/chen2573/CapstoneDesktopDev01#readme');
            }

        }]
    }
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

const DatabaseApi = require('./../src/utils/databaseFunctions');

/**
 * Inter Process Communication is used to communicate to our UI which
 * is our React App. The channels for the IPC channels are set up in public/preload.js.
 */
function createIPCChannels() {
    // IPC for Program/Departments
    ipcMain.on("toMain:Program", (event, args) => {
        console.log('Main recieved Program info', args);
        DatabaseApi.getPrograms().then((payload) => {
            mainWindow.webContents.send('fromMain:Program', payload.data);
        }).catch((error) => {
            console.log('Error with programs: ' + error);
        });
        /*queryDatabase(args).then((data) => {
            mainWindow.webContents.send('fromMain:Program', data)
        });*/
    });
    
    // IPC channel for courses.
    ipcMain.on("toMain:Course", (event, args) => {
        console.log('Main recieved Course info', args);
        queryDatabase(args).then((data) => {
            mainWindow.webContents.send('fromMain:Course', data)
        });
    });
}


// ============ DataBase functions ======================== 



/**
 * This function creates a new DB connection with given credentials.
 * This may be modified when we start using Swagger endpoints.
 * 
 * @returns promise - contains an open DB connection
 */
function connectToSever() {
    return new Promise((resolve, reject) => {
        var config = {
            host: 'capstonedb01.mysql.database.azure.com',
            user: 'desktopteam',
            password: 'desktoppass',
            database: 'classyschedule',
            port: 3306,
            //ssl: {ca: fs.readFileSync(path.join(__dirname, 'DBCertificate', 'DigiCertGlobalRootCA.crt.pem'))}
        };

        const conn = new mysql.createConnection(config);

        conn.connect(
            function (err) {
                if (err) {
                    console.log("!!! Cannot connect !!! Error:");
                    reject(err)
                } else {
                    resolve(conn)
                }
            });
    })

}

/**
 * This function queries our database
 * @param query - a vaild MySql database query created in our React App 
 * @returns 
 */
function queryDatabase(query) {
    return new Promise((resolve, reject) => {
        connectToSever().then(conn => {
            conn.query(query, function (err, results, fields) {
                if (err) {
                    reject(err);
                } else {
                    resolve(results);
                }
            })

        })
    })
}