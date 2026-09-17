import React from 'react';
import { Leaf, MapPin, Users, Building2, HelpCircle } from 'lucide-react';

export default function Header({ 
  onOpenModal,
  activeModal 
}) {
  return (
    <header className="main-navbar">
      <div className="navbar-container">
        {/* Logomarca */}
        <div className="brand-group">
          <div className="logo-icon-box">
            <Leaf className="logo-leaf" size={26} />
          </div>
          <div>
            <div className="brand-title">
              Refaça o Verde <span className="brand-badge">Brasil</span>
            </div>
            <p className="brand-tagline">
              Monitoramento Ecológico, Clima & Restauração Florestal por Estado
            </p>
          </div>
        </div>

        {/* Menu de Navegação Principal (Modais) */}
        <nav className="header-nav-menu">
          <button 
            className={`nav-menu-btn ${activeModal === 'about' ? 'active' : ''}`}
            onClick={() => onOpenModal('about')}
          >
            <Users size={16} />
            <span>Quem Somos</span>
          </button>

          <button 
            className={`nav-menu-btn ${activeModal === 'orgs' ? 'active' : ''}`}
            onClick={() => onOpenModal('orgs')}
          >
            <Building2 size={16} />
            <span>Órgãos & Entidades</span>
          </button>

          <button 
            className={`nav-menu-btn ${activeModal === 'faq' ? 'active' : ''}`}
            onClick={() => onOpenModal('faq')}
          >
            <HelpCircle size={16} />
            <span>Dúvidas Frequentes</span>
          </button>
        </nav>
      </div>
    </header>
  );
}

