import logo from './logo.svg';
import './App.css';
const algosdk = require('algosdk');
window.Buffer = require('buffer/').Buffer;


function App() {



async function readGlobalState(client, index){
    let applicationInfoResponse = await client.applicationInfo(index).do();
    let globalState = []
    if(applicationInfoResponse['params'].includes('global-state')) {
        globalState = applicationInfoResponse['params']['global-state']
    }
    for (let n = 0; n < globalState.length; n++) {
        console.log(applicationInfoResponse['params']['global-state'][n]);
    }
}

  return (
    <div className="App">
      <header className="App-header">
        <img src='https://seeklogo.com/images/A/algorand-algo-logo-267E891DCB-seeklogo.com.png' className="App-Algo-Logo"></img> 
       {/* have to add title here */}
        <h1 className="App-title">Algo Counter</h1>    
        <label className="Text-Counter">1</label>   
        <div className="button-set">
          <button>Add</button>
          <button>Increment Adder</button>
        </div>
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
