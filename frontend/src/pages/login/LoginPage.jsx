import { useState } from "react";
import "./login.css";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../../api/auth";

const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage("");

    try {
      const data = await loginUser({ username, password });
      localStorage.setItem("token", data.access_token);
      navigate("/topicPage");
    } catch (error) {
      setMessage(error.message || "Ошибка логина");
    }
  };

  
  return (
    <section className="login-page">
      <div className="login-card">
        <h1 className="title-login">Вход в свой профиль</h1>

        <form className="form-login" onSubmit={handleSubmit}>
          <input
            className="mail-username"
            type="text"
            placeholder="Почта или имя пользователя"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
          />

          <input
            className="login-password"
            type="password"
            placeholder="Пароль"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />

          <button className="login-button" type="submit">
            ВОЙТИ
          </button>
          <button className="auth" type="button" onClick={() => navigate("/register")}>
            ЗАРЕГЕСТРИРОВАТЬСЯ
          </button>
        </form>
        {message && <p>{message}</p>}
      </div>
    </section>
  );
};

export default LoginPage;