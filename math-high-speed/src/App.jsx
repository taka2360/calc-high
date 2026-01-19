import React, { useState } from 'react';
import './App.css';
import StartScreen from './components/StartScreen';
import GameScreen from './components/GameScreen';
import ResultScreen from './components/ResultScreen';

function App() {
  const [screen, setScreen] = useState('start');
  const [gameConfig, setGameConfig] = useState(null);
  const [results, setResults] = useState([]);
  
  // Store the last used config to restore it on "Home" or use it for "Retry"
  const [savedConfig, setSavedConfig] = useState(null);

  const handleStart = (config) => {
    setGameConfig(config);
    setSavedConfig(config);
    setScreen('game');
  };

  const handleFinish = (res) => {
    setResults(res);
    setScreen('result');
  };

  const handleRetry = () => {
    // Reuse savedConfig
    if (savedConfig) {
        setGameConfig(savedConfig);
        setScreen('game');
        setResults([]);
    } else {
        setScreen('start');
    }
  };

  const handleHome = () => {
    setScreen('start');
    setResults([]);
    setGameConfig(null);
  };

  return (
    <div className="app-container">
      {/* Title hidden during game */}
      {screen !== 'game' && (
          <header className="app-header">
            <h1>Math High-Speed</h1>
          </header>
      )}
      
      <main className="app-main">
        {screen === 'start' && (
            <StartScreen 
                onStart={handleStart} 
                initialConfig={savedConfig} 
            />
        )}
        {screen === 'game' && (
            <GameScreen 
                config={gameConfig} 
                onFinish={handleFinish} 
                onHome={handleHome} // Passed here
            />
        )}
        {screen === 'result' && (
            <ResultScreen 
                results={results} 
                onRetry={handleRetry} 
                onHome={handleHome}
            />
        )}
      </main>
    </div>
  );
}

export default App;
