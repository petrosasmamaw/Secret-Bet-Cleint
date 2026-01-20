import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchBetsBySupabaseId, createBet } from '../Slices/betSlice';

export default function Bets({ user }) {
  const dispatch = useDispatch();
  const { items: bets, loading, error } = useSelector(s => s.bets);
  const [formData, setFormData] = useState({
    amount: '',
    isAccepted: false,
    status: 'pending',
    images: []
  });

  useEffect(() => {
    if (user && user.id) {
      dispatch(fetchBetsBySupabaseId(user.id));
    }
  }, [dispatch, user]);

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;

    if (name === 'images') {
      const selectedFiles = Array.from(files || []).slice(0, 5);
      setFormData(prev => ({
        ...prev,
        images: selectedFiles,
      }));
      return;
    }

    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (user && user.id) {
      const payload = {
        ...formData,
        supabaseId: user.id,
        amount: parseFloat(formData.amount),
        possibleWin: 0
      };
      dispatch(createBet(payload));
      setFormData({
        amount: '',
        isAccepted: false,
        status: 'pending',
        images: []
      });
    }
  };

  return (
    <div className="page">
      <h1 className="page-header">My <span>Bets</span></h1>
      <p className="page-description">Manage and view your betting activities on this page.</p>
      <div className="create-bet">
        <h2>Create New Bet</h2>
        <form onSubmit={handleSubmit} className="bet-form">
          <div className="form-group">
            <label htmlFor="images">Attach Images (1-5) screen shot of the bet</label>
            <input
              type="file"
              id="images"
              name="images"
              accept="image/*"
              multiple
              onChange={handleChange}
              required
            />
            <small className="input-help">You can upload between 1 and 5 images. screen shot of image </small>
          </div>
          <div className="form-group">
            <label htmlFor="amount">Amount</label>
            <input
              type="number"
              id="amount"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              placeholder="Enter amount"
              required
              min="0"
              step="0.01"
            />
          </div>
          <button type="submit" className="btn" disabled={loading || !user}>
            {loading ? 'Creating...' : 'Create Bet'}
          </button>
        </form>
      </div>
      {error && <p className="error">{typeof error === 'string' ? error : error.message || 'Error'}</p>}
      <div className="bets-list">
        <h2>Your Bets</h2>
        {loading && <p>Loading...</p>}
        {bets.length === 0 && !loading && <p>No bets found.</p>}
        <div className="bets-grid">
          {[...bets]
            .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
            .map(bet => (
            <div key={bet._id || bet.id} className="bet-item">
              {Array.isArray(bet.images) && bet.images.length > 0 && (
                <div className="bet-images">
                  {bet.images.map((imgUrl, idx) => (
                    <img
                      key={idx}
                      src={imgUrl}
                      alt={`Bet ${bet._id || bet.id} image ${idx + 1}`}
                      className="bet-image"
                    />
                  ))}
                </div>
              )}
              <p><strong>Amount:</strong> ${bet.amount}</p>
              <p><strong>Possible Win:</strong> ${bet.possibleWin}</p>
              <p><strong>Accepted:</strong> {bet.isAccepted ? 'Yes' : 'No'}</p>
              <p><strong>Status:</strong> {bet.status} {bet.status==='win' && `${bet.possibleWin} $ add to your balance 🎉`}</p>
              <p><strong>Created:</strong> {new Date(bet.createdAt).toLocaleDateString()}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

