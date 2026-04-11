import { useState } from "react";
import "./login.css";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const navigate = useNavigate();
  const [user, setUser]= useState()
  return (
    <section className="login-page">
      <div className="login-card">
        <h1 className="title-login">Вход в свой профиль</h1>

        <form className="form-login">
          <input
            className="mail-username"
            type="text"
            placeholder="Почта или имя пользователя"
          />

          <input
            className="login-password"
            type="password"
            placeholder="Пароль"
          />

          <button className="login-button" type="submit">
            ВОЙТИ
          </button>
          <button className="auth" type="button" onClick={() => navigate("/register")}>
            ЗАРЕГЕСТРИРОВАТЬСЯ
          </button>
        </form>
      </div>
    </section>
  );
};

export default LoginPage;