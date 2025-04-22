import React, { useState } from 'react';
import './App.css';

function App() {
  const [formData, setFormData] = useState({
    id: '',
    followers_count: 0,
    friends_count: 0,
    listed_count: 0,
    favourites_count: 0,
    statuses_count: 0,
    default_profile: false,
    default_profile_image: false,
    verified: false,
    protected: false,
    geo_enabled: false,
    contributors_enabled: false
  });
  
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pastPredictions, setPastPredictions] = useState([]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: type === 'checkbox' ? checked : (type === 'number' ? parseInt(value) : value)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('http://localhost:5000/api/predict', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ account_data: formData }),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setResult(data);
        setPastPredictions(prev => [data, ...prev].slice(0, 10));
      } else {
        setError(data.error || 'Failed to get prediction');
      }
    } catch (err) {
      setError(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>Bot Detection Dashboard</h1>
        <p>Determine if a social media account is a bot or a real user</p>
      </header>
      
      <main className="app-main">
        <div className="input-section">
          <h2>Account Information</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="id">Account ID:</label>
              <input
                type="text"
                id="id"
                name="id"
                value={formData.id}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="followers_count">Followers:</label>
                <input
                  type="number"
                  id="followers_count"
                  name="followers_count"
                  value={formData.followers_count}
                  onChange={handleChange}
                  min="0"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="friends_count">Following:</label>
                <input
                  type="number"
                  id="friends_count"
                  name="friends_count"
                  value={formData.friends_count}
                  onChange={handleChange}
                  min="0"
                />
              </div>
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="listed_count">Listed Count:</label>
                <input
                  type="number"
                  id="listed_count"
                  name="listed_count"
                  value={formData.listed_count}
                  onChange={handleChange}
                  min="0"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="favourites_count">Favorites:</label>
                <input
                  type="number"
                  id="favourites_count"
                  name="favourites_count"
                  value={formData.favourites_count}
                  onChange={handleChange}
                  min="0"
                />
              </div>
            </div>
            
            <div className="form-group">
              <label htmlFor="statuses_count">Status Count:</label>
              <input
                type="number"
                id="statuses_count"
                name="statuses_count"
                value={formData.statuses_count}
                onChange={handleChange}
                min="0"
              />
            </div>
            
            <div className="checkbox-section">
              <h3>Account Attributes</h3>
              <div className="checkbox-group">
                <div className="checkbox-item">
                  <input
                    type="checkbox"
                    id="verified"
                    name="verified"
                    checked={formData.verified}
                    onChange={handleChange}
                  />
                  <label htmlFor="verified">Verified</label>
                </div>
                
                <div className="checkbox-item">
                  <input
                    type="checkbox"
                    id="protected"
                    name="protected"
                    checked={formData.protected}
                    onChange={handleChange}
                  />
                  <label htmlFor="protected">Protected</label>
                </div>
                
                <div className="checkbox-item">
                  <input
                    type="checkbox"
                    id="default_profile"
                    name="default_profile"
                    checked={formData.default_profile}
                    onChange={handleChange}
                  />
                  <label htmlFor="default_profile">Default Profile</label>
                </div>
                
                <div className="checkbox-item">
                  <input
                    type="checkbox"
                    id="default_profile_image"
                    name="default_profile_image"
                    checked={formData.default_profile_image}
                    onChange={handleChange}
                  />
                  <label htmlFor="default_profile_image">Default Image</label>
                </div>
                
                <div className="checkbox-item">
                  <input
                    type="checkbox"
                    id="geo_enabled"
                    name="geo_enabled"
                    checked={formData.geo_enabled}
                    onChange={handleChange}
                  />
                  <label htmlFor="geo_enabled">Geo Enabled</label>
                </div>
                
                <div className="checkbox-item">
                  <input
                    type="checkbox"
                    id="contributors_enabled"
                    name="contributors_enabled"
                    checked={formData.contributors_enabled}
                    onChange={handleChange}
                  />
                  <label htmlFor="contributors_enabled">Contributors Enabled</label>
                </div>
              </div>
            </div>
            
            <button type="submit" disabled={loading} className="submit-button">
              {loading ? 'Processing...' : 'Detect Bot'}
            </button>
          </form>
        </div>
        
        <div className="results-section">
          {error && <div className="error-message">{error}</div>}
          
          {result && (
            <div className={`result-card ${result.is_bot ? 'bot' : 'human'}`}>
              <h2>Detection Result</h2>
              <div className="result-header">
                <span className="account-id">ID: {result.account_id}</span>
                <span className={`result-badge ${result.is_bot ? 'bot' : 'human'}`}>
                  {result.is_bot ? 'BOT' : 'HUMAN'}
                </span>
              </div>
              
              <div className="confidence-meter">
                <div className="confidence-label">
                  Confidence: {Math.round(result.confidence * 100)}%
                </div>
                <div className="meter-bar">
                  <div 
                    className="meter-fill" 
                    style={{ width: `${result.confidence * 100}%` }}
                  ></div>
                </div>
              </div>
              
              <div className="result-details">
                <p>
                  This account is {result.is_bot ? 'likely a bot' : 'likely a real user'} with 
                  {' '}{Math.round(result.confidence * 100)}% confidence.
                </p>
              </div>
            </div>
          )}
          
          {pastPredictions.length > 0 && (
            <div className="past-predictions">
              <h3>Recent Predictions</h3>
              <ul>
                {pastPredictions.map((pred, index) => (
                  <li key={index} className={pred.is_bot ? 'bot' : 'human'}>
                    <span className="account-id">{pred.account_id}</span>
                    <span className={`badge ${pred.is_bot ? 'bot' : 'human'}`}>
                      {pred.is_bot ? 'BOT' : 'HUMAN'}
                    </span>
                    <span className="confidence">
                      {Math.round(pred.confidence * 100)}%
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default App;