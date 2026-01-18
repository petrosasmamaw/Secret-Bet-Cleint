import React from 'react';
import {Link} from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-brand">
          <h2 className="footer-title">Secret<span>BET.Zone</span></h2>
          <p className="footer-tagline">Smart bets, secure payouts, and real-time action.</p>
        </div>
        <div className="footer-columns">
          <div className="footer-column">
            <h3>Explore</h3>
            <ul>
              <li><Link to="/bets">My Bets</Link></li>
              <li><Link to="/deposit">Deposit</Link></li>
              <li><Link to="/withdraw">Withdraw</Link></li>
            </ul>
          </div>
          <div className="footer-column">
            <h3>Support</h3>
            <ul>
              <li><a href="https://support.skybet.com/app/answers/detail/football-rules-hub/">Help Center</a></li>
              <li><a href="https://support.skybet.com/app/answers/detail/football-rules-hub/">Responsible Gaming</a></li>
              <li><a href="https://support.skybet.com/app/answers/detail/football-rules-hub/">Contact Us</a></li>
            </ul>
          </div>
          <div className="footer-column">
            <h3>Follow</h3>
            <div className="footer-social">
              <a href="https://www.facebook.com/" aria-label="Facebook">Fb</a>
              <a href="https://twitter.com/" aria-label="X">X</a>
              <a href="https://www.instagram.com/" aria-label="Instagram">Ig</a>
            </div>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} BetZone. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
