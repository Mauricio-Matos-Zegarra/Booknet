// src/components/Footer.jsx

import React from 'react';

const Footer = () => {
  return (
    <footer className="footer-container">
      <div className="footer-inner">
        <div className="footer-brand">Book<span>Net</span></div>
        <p className="footer-tagline">Tu librería digital — lee, descubre, comparte.</p>
        <hr className="footer-divider" />
        <p className="footer-copy">&copy; {new Date().getFullYear()} BookNet. Todos los derechos reservados.</p>
      </div>
    </footer>
  );
};

export default Footer;