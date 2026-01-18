import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserBySupabaseId, createUser } from '../Slices/userSlice';
import { fetchBalancesBySupabaseId } from '../Slices/balanceSlice';

const Profile = ({ user }) => {
  const dispatch = useDispatch();
  const { items: users, loading, error } = useSelector(state => state.users);
  const { items: balances, loading: balancesLoading, error: balancesError } = useSelector(state => state.balances);

  const currentUser = Array.isArray(users) ? users.find(u => u.supabaseId === user?.id) || {} : users;

  useEffect(() => {
    if (user && user.id) {
      // First check if user exists by fetching
      dispatch(fetchUserBySupabaseId(user.id));
      dispatch(fetchBalancesBySupabaseId(user.id));
    }
  }, [user, dispatch]);

  useEffect(() => {
    if (!loading && user && user.id && user.email) {
      const hasUser = Array.isArray(users) && users.length > 0;
      if (!hasUser && error) {
        const errorMessage = typeof error === 'string' ? error : error?.message || '';
        if (errorMessage.includes('User not found') || errorMessage.includes('not found')) {
          // User doesn't exist, create it
          dispatch(createUser({
            supabaseId: user.id,
            email: user.email
          }));
        }
      }
    }
  }, [loading, error, users, user, dispatch]);

  const getCurrentBalance = () => {
    if (!Array.isArray(balances) || balances.length === 0) return 0;

    const latest = balances.reduce((latestItem, currentItem) => {
      const latestDate = new Date(latestItem.updatedAt || latestItem.createdAt || 0);
      const currentDate = new Date(currentItem.updatedAt || currentItem.createdAt || 0);
      return currentDate > latestDate ? currentItem : latestItem;
    });

    return typeof latest.balance === 'number' ? latest.balance : 0;
  };

  const currentBalance = getCurrentBalance();

  return (
    <div className="page">
      <h1 className="page-header">My <span>Profile</span></h1>
      <p className="page-description">View your profile information here.</p>
      {error && !error.includes('User not found') && !error.includes('not found') && (
        <p className="error">{typeof error === 'string' ? error : error.message || 'An error occurred'}</p>
      )}
      {loading || balancesLoading ? (
        <p>Loading profile...</p>
      ) : (
        <div className="profile-info">
          <div className="profile-field">
            <label>Email:</label>
            <span>{user?.email || currentUser.email || 'Not set'}</span>
          </div>
          <div className="profile-field">
            <label>Role:</label>
            <span>{currentUser.role || 'user'}</span>
          </div>
          <div className="profile-field">
            <label>Balance:</label>
            <span>${currentBalance}</span>
          </div>
          <div className="profile-field">
            <label>Status:</label>
            <span className={currentUser.isBlocked ? 'blocked' : 'active'}>
              {currentUser.isBlocked ? 'Blocked' : 'Active'}
            </span>
          </div>
          <div className="profile-field">
            <label>Member Since:</label>
            <span>{currentUser.createdAt ? new Date(currentUser.createdAt).toLocaleDateString() : 'N/A'}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
