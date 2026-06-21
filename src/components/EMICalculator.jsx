import React, { useState } from 'react';

export default function EMICalculator() {
  // Input states
  const [loanAmount, setLoanAmount] = useState('100000');
  const [interestRate, setInterestRate] = useState('8.5');
  const [tenure, setTenure] = useState('60'); // default 60 months (5 years)

  // Validation state
  const [errors, setErrors] = useState({});

  // Calculation output state
  const [results, setResults] = useState(null);
  const [showSchedule, setShowSchedule] = useState(false);

  const validate = () => {
    const newErrors = {};
    
    // Validate Loan Amount
    if (!loanAmount || loanAmount.trim() === '') {
      newErrors.loanAmount = 'Loan Amount is required';
    } else {
      const amt = parseFloat(loanAmount);
      if (isNaN(amt) || amt <= 0) {
        newErrors.loanAmount = 'Loan Amount must be a positive number';
      }
    }

    // Validate Interest Rate
    if (!interestRate || interestRate.trim() === '') {
      newErrors.interestRate = 'Interest Rate is required';
    } else {
      const rate = parseFloat(interestRate);
      if (isNaN(rate) || rate < 0) {
        newErrors.interestRate = 'Interest Rate must be 0 or positive';
      } else if (rate > 100) {
        newErrors.interestRate = 'Interest Rate cannot exceed 100%';
      }
    }

    // Validate Tenure
    if (!tenure || tenure.trim() === '') {
      newErrors.tenure = 'Tenure is required';
    } else {
      const months = parseInt(tenure, 10);
      if (isNaN(months) || months <= 0) {
        newErrors.tenure = 'Tenure must be at least 1 month';
      } else if (months > 600) {
        newErrors.tenure = 'Tenure cannot exceed 600 months (50 years)';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCalculate = (e) => {
    e.preventDefault();
    if (!validate()) {
      setResults(null);
      return;
    }

    const P = parseFloat(loanAmount);
    const annualRate = parseFloat(interestRate);
    const N = parseInt(tenure, 10);

    // Monthly interest rate
    const R = annualRate / 12 / 100;

    let emi = 0;
    if (R === 0) {
      emi = P / N;
    } else {
      emi = (P * R * Math.pow(1 + R, N)) / (Math.pow(1 + R, N) - 1);
    }

    const totalAmount = emi * N;
    const totalInterest = totalAmount - P;

    // Generate monthly schedule
    const schedule = [];
    let remainingBalance = P;
    
    for (let month = 1; month <= N; month++) {
      const interestPaid = remainingBalance * R;
      const principalPaid = emi - interestPaid;
      remainingBalance = Math.max(0, remainingBalance - principalPaid);
      
      schedule.push({
        month,
        principalPaid,
        interestPaid,
        endingBalance: remainingBalance
      });
    }

    setResults({
      emi: emi.toFixed(2),
      totalAmount: totalAmount.toFixed(2),
      totalInterest: totalInterest.toFixed(2),
      principalPercentage: ((P / totalAmount) * 100).toFixed(1),
      interestPercentage: ((totalInterest / totalAmount) * 100).toFixed(1),
      schedule
    });
  };

  const formatCurrency = (val) => {
    const num = parseFloat(val);
    if (isNaN(num)) return '$0.00';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(num);
  };

  // SVG parameters for the Donut Chart
  const radius = 40;
  const circumference = 2 * Math.PI * radius; // ~251.3
  
  const principalStroke = results 
    ? (parseFloat(results.principalPercentage) / 100) * circumference 
    : circumference;
  const interestStroke = results 
    ? (parseFloat(results.interestPercentage) / 100) * circumference 
    : 0;

  return (
    <div className="calculator-card">
      <div className="calculator-grid">
        {/* Input Form Section */}
        <form onSubmit={handleCalculate} className="form-section">
          <h2>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
              <line x1="9" y1="9" x2="15" y2="9"></line>
              <line x1="9" y1="13" x2="15" y2="13"></line>
              <line x1="9" y1="17" x2="15" y2="17"></line>
              <line x1="12" y1="9" x2="12" y2="17"></line>
            </svg>
            Calculator Details
          </h2>

          {/* Loan Amount Input */}
          <div className="input-group">
            <div className="input-label-container">
              <span className="input-label">Loan Amount</span>
              {errors.loanAmount && <span className="validation-error">{errors.loanAmount}</span>}
            </div>
            <div className="input-wrapper">
              <input
                type="number"
                value={loanAmount}
                onChange={(e) => setLoanAmount(e.target.value)}
                placeholder="e.g. 100000"
                className="input-field"
              />
              <span className="input-addon">$</span>
            </div>
            <input
              type="range"
              min="5000"
              max="2000000"
              step="5000"
              value={loanAmount || 0}
              onChange={(e) => setLoanAmount(e.target.value)}
              className="slider"
            />
          </div>

          {/* Interest Rate Input */}
          <div className="input-group">
            <div className="input-label-container">
              <span className="input-label">Interest Rate (%)</span>
              {errors.interestRate && <span className="validation-error">{errors.interestRate}</span>}
            </div>
            <div className="input-wrapper">
              <input
                type="number"
                step="0.1"
                value={interestRate}
                onChange={(e) => setInterestRate(e.target.value)}
                placeholder="e.g. 8.5"
                className="input-field"
              />
              <span className="input-addon">%</span>
            </div>
            <input
              type="range"
              min="1"
              max="25"
              step="0.1"
              value={interestRate || 0}
              onChange={(e) => setInterestRate(e.target.value)}
              className="slider"
            />
          </div>

          {/* Tenure (Months) Input */}
          <div className="input-group">
            <div className="input-label-container">
              <span className="input-label">Tenure (months)</span>
              {errors.tenure && <span className="validation-error">{errors.tenure}</span>}
            </div>
            <div className="input-wrapper">
              <input
                type="number"
                value={tenure}
                onChange={(e) => setTenure(e.target.value)}
                placeholder="e.g. 60"
                className="input-field"
              />
              <span className="input-addon">Mo</span>
            </div>
            <input
              type="range"
              min="6"
              max="360"
              step="6"
              value={tenure || 0}
              onChange={(e) => setTenure(e.target.value)}
              className="slider"
            />
          </div>

          <button type="submit" className="btn-primary">
            Calculate EMI
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <circle cx="12" cy="12" r="10"></circle>
              <polyline points="12 16 16 12 12 8"></polyline>
              <line x1="8" y1="12" x2="16" y2="12"></line>
            </svg>
          </button>
        </form>

        {/* Results Visual Section */}
        <div className="results-section">
          {results ? (
            <>
              <h2>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M21.21 15.89A10 10 0 1 1 8 2.83"></path>
                  <path d="M22 12A10 10 0 0 0 12 2v10z"></path>
                </svg>
                EMI Summary
              </h2>

              <div className="emi-display-card">
                <div className="emi-label">Monthly EMI</div>
                <div className="emi-amount">{formatCurrency(results.emi)}</div>
              </div>

              <div className="metrics-grid">
                <div className="metric-card">
                  <span className="metric-label">Principal Amount</span>
                  <span className="metric-value">{formatCurrency(loanAmount)}</span>
                </div>
                <div className="metric-card">
                  <span className="metric-label">Total Interest</span>
                  <span className="metric-value">{formatCurrency(results.totalInterest)}</span>
                </div>
              </div>

              <div className="metric-card" style={{ textAlign: 'center' }}>
                <span className="metric-label">Total Payable (Principal + Interest)</span>
                <span className="metric-value" style={{ color: 'var(--accent)', fontSize: '1.4rem' }}>
                  {formatCurrency(results.totalAmount)}
                </span>
              </div>

              {/* Responsive SVG Donut Chart */}
              <div className="chart-container">
                <div className="donut-chart">
                  <svg width="100%" height="100%" viewBox="0 0 100 100">
                    <circle className="donut-hole" cx="50" cy="50" r={radius}></circle>
                    <circle className="donut-ring" cx="50" cy="50" r={radius}></circle>
                    
                    {/* Principal Segment */}
                    <circle 
                      className="donut-segment donut-segment-1" 
                      cx="50" 
                      cy="50" 
                      r={radius}
                      strokeDasharray={`${principalStroke} ${circumference}`}
                      strokeDashoffset="0"
                    ></circle>
                    
                    {/* Interest Segment */}
                    <circle 
                      className="donut-segment donut-segment-2" 
                      cx="50" 
                      cy="50" 
                      r={radius}
                      strokeDasharray={`${interestStroke} ${circumference}`}
                      strokeDashoffset={-principalStroke}
                    ></circle>
                  </svg>
                  
                  <div className="chart-text">
                    <div className="chart-percentage">{results.interestPercentage}%</div>
                    <div className="chart-label">Interest</div>
                  </div>
                </div>
              </div>

              <div className="chart-legend">
                <div className="legend-item">
                  <span className="legend-color principal"></span>
                  <span>Principal: {results.principalPercentage}%</span>
                </div>
                <div className="legend-item">
                  <span className="legend-color interest"></span>
                  <span>Interest: {results.interestPercentage}%</span>
                </div>
              </div>
            </>
          ) : (
            <div 
              style={{ 
                height: '100%', 
                display: 'flex', 
                flexDirection: 'column', 
                justifyContent: 'center', 
                alignItems: 'center',
                color: 'var(--text-muted)',
                textAlign: 'center',
                padding: '2rem',
                border: '1px dashed var(--card-border)',
                borderRadius: 'var(--radius-md)',
                background: 'rgba(15, 23, 42, 0.2)'
              }}
            >
              <svg 
                width="48" 
                height="48" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="1" 
                style={{ marginBottom: '1rem', opacity: 0.5 }}
              >
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="12"></line>
                <line x1="12" y1="16" x2="12.01" y2="16"></line>
              </svg>
              <h3>Awaiting Calculation</h3>
              <p style={{ fontSize: '0.9rem', marginTop: '0.5rem' }}>
                Fill in the details and click the button to see your payment breakdown.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Amortization Schedule Table */}
      {results && (
        <div style={{ marginTop: '1rem' }}>
          <button 
            type="button" 
            className="schedule-toggle" 
            onClick={() => setShowSchedule(!showSchedule)}
          >
            {showSchedule ? 'Hide Amortization Table' : 'View Monthly Amortization Table'}
            <svg 
              width="16" 
              height="16" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2.5"
              style={{ transform: showSchedule ? 'rotate(180deg)' : 'none', transition: 'var(--transition)' }}
            >
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
          </button>
          
          {showSchedule && (
            <div className="table-wrapper" style={{ marginTop: '1rem' }}>
              <table className="schedule-table">
                <thead>
                  <tr>
                    <th>Month</th>
                    <th>Principal Paid</th>
                    <th>Interest Paid</th>
                    <th>Remaining Balance</th>
                  </tr>
                </thead>
                <tbody>
                  {results.schedule.map((row) => (
                    <tr key={row.month}>
                      <td>{row.month}</td>
                      <td>{formatCurrency(row.principalPaid)}</td>
                      <td>{formatCurrency(row.interestPaid)}</td>
                      <td>{formatCurrency(row.endingBalance)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
