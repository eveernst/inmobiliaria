import React from 'react';

const Header = () => {
  return (
    <header className="header">
      <div className="header-container">
        <h1>AAC</h1>
        <div className="menu">
          <button>Categorías</button>
          <input type="text" placeholder="Buscar" />
          <span>Usuario</span>
        </div>
      </div>
    </header>
  );
};

export default Header;
