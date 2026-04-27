import "./header.css";
import { Link } from "react-router-dom";

const Header = () => {
  const token = localStorage.getItem("token");

  return (
    <header className="site-header">
      <div className="shell">
        <div className="header">
          <Link className="logo" to="/">MindGarden</Link>

          <nav className="nav nav--topics">
            <Link to="/">О нас</Link>
            <Link className="is-active" to="/topicPage">Мой сад</Link>
            <Link to="/achieve">Достижения</Link>
            <Link to="/friends">Друзья</Link>
          </nav>

          <Link
            to={token ? "/profile" : "/login"}
            className="cabinet-btn"
          >
            <span>
              <strong>{token ? "Профиль" : "Войти"}</strong>
            </span>
            <svg
              width="15"
              height="15"
              viewBox="0 0 15 15"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path
                d="M4 2.25L9.25 7.5L4 12.75"
                stroke="#9FD76A"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </Link>
        </div>
        <div className="divider"></div>
      </div>
    </header>
  );
};

export default Header;