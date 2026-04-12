import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getMe } from "../api/auth";


export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [message, setMessage] = useState("Загрузка профиля...");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");

    async function fetchProfile() {
      try {
        const me = await getMe(token);
        setUser(me);
        setMessage("");
      } catch (error) {
        setMessage(error.message || "Ошибка загрузки профиля");
      }
    }

    fetchProfile();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  if (message) {
    return <p>{message}</p>;
  }

  return (
    <div style={{ padding: "24px" }}>
      <h1>Профиль</h1>

      {user && (
        <>
          <p>ID: {user.id}</p>
          <p>Username: {user.username}</p>
          <p>Email: {user.email}</p>
          <p>Created at: {user.created_at}</p>

          <button onClick={handleLogout}>Выйти</button>
        </>
      )}
    </div>
  );
}