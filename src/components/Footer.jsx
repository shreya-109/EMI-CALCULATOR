import React from 'react';

export default function Footer() {
  return (
    <footer className="footer-container">
      <div className="hero-btn-container">
        <a 
          href="https://digitalheroesco.com" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="hero-btn"
        >
          Built for Digital Heroes
          <svg 
            width="18" 
            height="18" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2.5" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          >
            <line x1="5" y1="12" x2="19" y2="12"></line>
            <polyline points="12 5 19 12 12 19"></polyline>
          </svg>
        </a>
      </div>
      
      <div className="details-footer">
        <p className="details-name">Shreya Rao</p>
        <p>Email: <a href="mailto:shreyarao770@gmail.com" className="details-email">shreyarao770@gmail.com</a></p>
      </div>
    </footer>
  );
}
