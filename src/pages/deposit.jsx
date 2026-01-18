import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createDeposit, fetchDepositsBySupabaseId } from '../Slices/depositSlice';

const Deposit = ({ user }) => {
  const [phoneNo, setPhoneNo] = useState('');
  const [amount, setAmount] = useState('');
  const [method, setMethod] = useState('');
  const dispatch = useDispatch();
  const { items: deposits, loading, error } = useSelector(state => state.deposits);

  useEffect(() => {
    if (user) {
      dispatch(fetchDepositsBySupabaseId(user.id));
    }
  }, [user, dispatch]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (user && phoneNo && amount && method) {
      dispatch(createDeposit({ 
        supabaseId: user.id, 
        phoneNo: parseInt(phoneNo), 
        amount: parseFloat(amount), 
        method 
      }));
      setPhoneNo('');
      setAmount('');
      setMethod('');
    }
  };

  return (
    <div className="page">
      <h1 className="page-header">Deposit <span>Funds</span></h1>
      <p className="page-description">Make a deposit to your account.</p>
      <form onSubmit={handleSubmit} className="deposit-form">
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
            placeholder="Enter amount to deposit"
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
          {loading ? 'Depositing...' : 'Deposit'}
        </button>
      </form>

      <h2>Your Deposits</h2>
      {deposits.length === 0 ? (
        <p>No deposits found.</p>
      ) : (
        <div className="deposits-list">
          {[...deposits]
            .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
            .map(deposit => (
            <div key={deposit._id} className="deposit-item">
              <p><strong>Phone:</strong> {deposit.phoneNo}</p>
              <p><strong>Amount:</strong> ${deposit.amount}</p>
              <p><strong>Method:</strong> {deposit.method}</p>
              <p><strong>Status:</strong> <span className={`status ${deposit.status}`}>{deposit.status}</span></p>
              <p><strong>Date:</strong> {new Date(deposit.createdAt).toLocaleDateString()}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Deposit;