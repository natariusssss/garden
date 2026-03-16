import { useState } from "react";
import { registerUser } from "../api/auth";

export default function RegisterPage() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const user = await registerUser({
        username,
        email,
        password,
      });

      setMessage(`Пользователь ${user.username} успешно зарегистрирован`);
      setUsername("");
      setEmail("");
      setPassword("");
    } catch (error) {
      setMessage(error.message || "Ошибка регистрации");
    }
  };


  
  return (
    <div>
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