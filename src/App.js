import React from 'react';
import { Analytics } from '@vercel/analytics/react';
import DOT_GAME from './components/DOT_GAME';

function App() {
  return (
    <div className="App">
      <DOT_GAME />
      <Analytics />
    </div>
  );
}

export default App; 