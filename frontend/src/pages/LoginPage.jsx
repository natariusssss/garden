import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../api/auth";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const data = await loginUser({ username, password });
      localStorage.setItem("token", data.access_token);
      navigate("/dashboard");
    } catch (error) {
      setMessage(error.message || "Ошибка логина");
    }
  };

  return (
    <div style={{ padding: "24px" }}>
      <div style={{ marginBottom: "16px" }}>
        <Link to="/login">
          <button>Логин</button>
        </Link>
        <Link to="/register">
          <button style={{ marginLeft: "8px" }}>Регистрация</button>
        </Link>
      </div>

      <h1>Логин</h1>

      <form onSubmit={handleSubmit}>
        <div>
          <input
            type="text"
            placeholder="Имя пользователя"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>

        <div>
          <input
            type="password"
            placeholder="Пароль"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button type="submit">Войти</button>
      </form>

      {message && <p>{message}</p>}
    </div>
  );
}