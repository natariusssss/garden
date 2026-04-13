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

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage("");

    try {
      await registerUser({ username, email, password });
      navigate("/login");
    } 
    catch (error) {
  const message =
    typeof error?.message === "string"
      ? error.message
      : "Ошибка регистрации";

  setMessage(message);
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
            onChange={(event) => setUsername(event.target.value)}
          />

          <input
            className="mail"
            type="text"
            placeholder="Почта"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />

          <input
            className="register-password"
            type="password"
            placeholder="Пароль"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
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