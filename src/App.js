
/**
 * This function is the entry point for the react application. This component is used in index.js. index.js is mounted onto public/index.html.
 * index.html is what ends up being rendered to the screen.
 * @returns App component
 */
function App() {
  return (
    <div>
        <h1>React App (Renderer Process)</h1>
        <br />
        <br />
        <input type="button" value="Send Signal To Main Process" onClick={sendSignal}/>
        <br />
        <br />
        <input type="button" value="Get token" onClick={getTokenFromAPI}/>
    </div>
  );
}

/**
 * The button sends a message via the 'toMain:Signal' channel and recieves from 'fromMain:Signal'. 
 * Channels can be customized in public/preload.js.
 */
function sendSignal() {
  window.ContextBridge.send('toMain:Signal', 'Hello from renderer Process button');

  window.ContextBridge.receive('fromMain:Signal', (data) => {
    window.alert('Message From Main: ' + data);
  });
}

/**
 * This function will demonstrate how renderer processes can communicate to other services.
 */
function getTokenFromAPI() {
  window.ContextBridge.send('toMain:Token', 'Query made to API');

  window.ContextBridge.receive('fromMain:Token', (data) => {
    window.alert('Message From Main: Your token is ' + data);
  });
}

export default App;
