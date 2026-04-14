import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../../api/auth";
import "./login.css";

export default function LoginPage() {
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
      setMessage(error.message || "Ошибка входа");
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
            placeholder="Введите логин или почту"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
          />

          <input
            className="login-password"
            type="password"
            placeholder="Введите пароль"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />

          <button className="login-button" type="submit">
            ВОЙТИ
          </button>

          {message && <p>{message}</p>}
        </form>
      </div>
    </section>
  );
}