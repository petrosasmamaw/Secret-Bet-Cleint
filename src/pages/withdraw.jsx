import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createWithdrawal, fetchWithdrawalsBySupabaseId } from '../Slices/withdrawalSlice';

const Withdraw = ({ user }) => {
  const [userName, setUserName] = useState('');
  const [phoneNo, setPhoneNo] = useState('');
  const [amount, setAmount] = useState('');
  const [method, setMethod] = useState('');
  const dispatch = useDispatch();
  const { items: withdrawals, loading, error } = useSelector(state => state.withdrawals);

  useEffect(() => {
    if (user) {
      dispatch(fetchWithdrawalsBySupabaseId(user.id));
    }
  }, [user, dispatch]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (user && userName && phoneNo && amount && method) {
      dispatch(createWithdrawal({ 
        supabaseId: user.id, 
        userName, 
        phoneNo: parseInt(phoneNo), 
        amount: parseFloat(amount), 
        method 
      }));
      setUserName('');
      setPhoneNo('');
      setAmount('');
      setMethod('');
    }
  };

  return (
    <div className="page">
      <h1 className="page-header">Withdraw <span>Funds</span></h1>
      <p className="page-description">Request a withdrawal from your account.</p>
      <form onSubmit={handleSubmit} className="withdraw-form">
        <div className="form-group">
          <label htmlFor="userName">User Name</label>
          <input
            type="text"
            id="userName"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            placeholder="Enter your name"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="phoneNo">Phone Number</label>
          <input
            type="tel"
            id="phoneNo"
            value={phoneNo}
            onChange={(e) => setPhoneNo(e.target.value)}
            placeholder="Enter phone number"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="amount">Amount</label>
          <input
            type="number"
            id="amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Enter amount to withdraw"
            required
            min="0"
            step="0.01"
          />
        </div>
        <div className="form-group">
          <label htmlFor="method">Payment Method</label>
          <select
            id="method"
            value={method}
            onChange={(e) => setMethod(e.target.value)}
            required
          >
            <option value="">Select method</option>
            <option value="bank">CBE Transfer</option>
            <option value="card">TeleBirr</option>
            <option value="paypal">BOA</option>
            <option value="crypto">Cryptocurrency</option>
          </select>
        </div>
        {error && <p className="error">{typeof error === 'string' ? error : error.message || 'An error occurred'}</p>}
        <button type="submit" className="btn" disabled={loading || !user}>
          {loading ? 'Requesting...' : 'Request Withdrawal'}
        </button>
      </form>

      <h2>Your Withdrawal Requests</h2>
      {withdrawals.length === 0 ? (
        <p>No withdrawal requests found.</p>
      ) : (
        <div className="withdrawals-list">
          {[...withdrawals]
            .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
            .map(withdrawal => (
            <div key={withdrawal._id} className="withdrawal-item">
              <p><strong>User Name:</strong> {withdrawal.userName}</p>
              <p><strong>Phone:</strong> {withdrawal.phoneNo}</p>
              <p><strong>Method:</strong> {withdrawal.method}</p>
              <p><strong>Amount:</strong> ${withdrawal.amount}</p>
              <p><strong>Status:</strong> <span className={`status ${withdrawal.status}`}>{withdrawal.status}</span></p>
              <p><strong>Date:</strong> {new Date(withdrawal.createdAt).toLocaleDateString()}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Withdraw;
