const { contextBridge } = require("electron");
window.ipcRenderer = require('electron').ipcRenderer;


/**
 * This function is a preload script to set up IPC channels.
 * 
 * This creates a context bridge between electron and our react app. This allows the electron app
 * to know about the React UI without the React UI know the inner workings of the IPC. 
 * 
 * This will Expose protected methods that allow the renderer process to use the ipcRenderer without exposing the entire object.
 * 
 * To add a new channelyou have to add the string to the 'validChannels' and add a constant to src/utils/ipcChannels.js.
 * 
 * There isn't a lot of resources on this, but can use Stack Overflow and start here https://www.electronjs.org/docs/latest/api/ipc-main/
 * I based the structure of the contextBridge from this StackOverflow: https://stackoverflow.com/questions/69214751/access-methods-in-electrons-main-process-from-render-process-after-building
 * 
 * Note: ContextBridge can be customized and validChannels is a string list that can be added to.
 * 
 */
contextBridge.exposeInMainWorld(
    "ContextBridge", {
        send: (channel, data) => {
            // whitelist channels
            let validChannels = ['toMain:Signal', 'toMain:Token'];
            if (validChannels.includes(channel)) {
                ipcRenderer.send(channel, data);
            }
        },
        receive: (channel, func) => {
            let validChannels = ['fromMain:Signal', 'fromMain:Token'];
            if (validChannels.includes(channel)) {
                // Deliberately strip event as it includes `sender` 
                ipcRenderer.once(channel, (event, ...args) => func(...args));
            }
        }
    }
);