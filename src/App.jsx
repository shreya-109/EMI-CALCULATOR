import React from 'react';
import Header from './components/Header';
import EMICalculator from './components/EMICalculator';
import Footer from './components/Footer';

function App() {
  return (
    <>
      <div className="bg-glow-1"></div>
      <div className="bg-glow-2"></div>
      <div className="app-container">
        <Header />
        <EMICalculator />
        <Footer />
      </div>
    </>
  );
}

export default App;
