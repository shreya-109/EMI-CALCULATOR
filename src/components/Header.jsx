import React from 'react';

export default function Header() {
  return (
    <header style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '1rem' }}>
      <h1>EMI Precision Pro</h1>
      <p className="subheading">Calculate your monthly installments with clinical accuracy</p>
    </header>
  );
}
