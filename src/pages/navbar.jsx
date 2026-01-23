import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../Slices/authSlice';
import { fetchBalancesBySupabaseId } from '../Slices/balanceSlice';

const Navbar = ({ user }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const balance = useSelector(state => state.balances.items.length > 0 ? state.balances.items[0].balance : 0);

  useEffect(() => {
    if (user) {
      dispatch(fetchBalancesBySupabaseId(user.id));
    }
  }, [user, dispatch]);

  const handleLogout = async () => {
    await dispatch(logout());
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">Secret Bet</div>
      <div className="navbar-links">
        {user ? (
          <>
            <Link to="/bets" className="nav-link">Bets</Link>
            <Link to="/deposit" className="nav-link">Deposit</Link>
            <Link to="/profile" className="nav-link">Profile</Link>
            <Link to="/withdraw" className="nav-link">Withdraw</Link>
            <span className="balance">Balance: ${balance}</span>
            <button onClick={handleLogout} className="nav-link btn-logout">Logout</button>
          </>
        ) : (
          <>
            <Link to="/login" className="nav-link">Login</Link>
            <Link to="/register" className="nav-link">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
