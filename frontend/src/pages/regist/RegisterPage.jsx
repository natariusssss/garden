import "./register.css";

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../../api/auth";

export default function RegisterPage() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      await registerUser({ username, email, password });
      navigate("/login");
    } catch (error) {
      setMessage(error.message || "Ошибка регистрации");
    }
  };

  return (
    <section className="register-page">
      <div className="register-card">
        <h1 className="title-register">Регистрация</h1>

        <form className="form-register" onSubmit={handleSubmit}>
          <input
            className="username"
            type="text"
            placeholder="Имя пользователя"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          <input
            className="mail"
            type="text"
            placeholder="Почта"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            className="register-password"
            type="password"
            placeholder="Пароль"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button className="auth-button" type="submit">
            ЗАРЕГИСТРИРОВАТЬСЯ
          </button>

          {message && <p>{message}</p>}
        </form>
      </div>
    </section>
  );
}