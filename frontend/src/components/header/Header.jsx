import "./header.css"
import { Link } from "react-router-dom";

const Header = () => {
    return ( 
    <header className="site-header">
    <div className="shell">
      <div className="header">
        <a className="logo" href="index.html">MindGarden</a>
        <nav className="nav nav--topics">
            
          <a href="index.html#hero">О нас</a>
          <Link to="/login" className="is-active">Мой сад</Link>
          <Link to="/login">Достижения</Link>
          <Link to="/login">Друзья</Link>
        </nav>
        <Link to="/login" className="cabinet-btn">
          <span><strong>Личный кабинет</strong></span>
          <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <path d="M4 2.25L9.25 7.5L4 12.75" stroke="#9FD76A" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </Link>
      </div>
      <div className="divider"></div>
    </div>
  </header>
  );
}
 
export default Header;