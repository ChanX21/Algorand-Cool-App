import logo from './logo.svg';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src='https://seeklogo.com/images/A/algorand-algo-logo-267E891DCB-seeklogo.com.png' className="App-Algo-Logo"></img> 
       {/* have to add title here */}
        <h1 className="App-title">Algo Counter</h1>    
        <label className="Text-Counter">1</label>   
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
