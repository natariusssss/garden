import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../api/auth";

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
    <div style={{ padding: "24px" }}>
      <div style={{ marginBottom: "16px" }}>
        <Link to="/login">
          <button>Логин</button>
        </Link>
        <Link to="/register">
          <button style={{ marginLeft: "8px" }}>Регистрация</button>
        </Link>
      </div>
      <h1> Mind Garden</h1>
      <h1>Регистрация</h1>

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
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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

        <button type="submit">Зарегистрироваться</button>
      </form>

      {message && <p>{message}</p>}
    </div>
  );
}