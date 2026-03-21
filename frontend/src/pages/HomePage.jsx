import { Link, useNavigate } from "react-router-dom";

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <div style={{ minHeight: "100vh", background: "#020617", color: "white" }}>
      {/* NAVBAR */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "16px 32px",
          borderBottom: "1px solid #1e293b",
        }}
      >
        <div style={{ fontWeight: "bold", fontSize: "20px" }}>
            🌱 MindGarden
        </div>

        <div style={{ display: "flex", gap: "24px" }}>
          <button
            onClick={() => navigate("/register")}
            style={{
              background: "transparent",
              border: "none",
              color: "#94a3b8",
              cursor: "pointer",
            }}
          >
            Мой сад
          </button>

          <button
            onClick={() => navigate("/register")}
            style={{
              background: "transparent",
              border: "none",
              color: "#94a3b8",
              cursor: "pointer",
            }}
          >
            Темы и связи
          </button>

          <button
            onClick={() => navigate("/register")}
            style={{
              background: "transparent",
              border: "none",
              color: "#94a3b8",
              cursor: "pointer",
            }}
          >
            Повторение
          </button>

          <button
            onClick={() => navigate("/register")}
            style={{
              background: "transparent",
              border: "none",
              color: "#94a3b8",
              cursor: "pointer",
            }}
          >
            Команда
          </button>
        </div>

        <div style={{ display: "flex", gap: "12px" }}>
          <Link to="/login">
            <button>Логин</button>
          </Link>
          <Link to="/register">
            <button>Регистрация</button>
          </Link>
        </div>
      </div>

      {/* HERO */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          height: "80vh",
          padding: "40px",
        }}
      >
        <div style={{ maxWidth: "500px" }}>
          <h1 style={{ fontSize: "48px", lineHeight: "1.2" }}>
            Взращивай <br /> свои знания
          </h1>

          <p style={{ marginTop: "20px", color: "#94a3b8" }}>
            Алгоритм интервального повторения и наглядная визуализация
            прогресса. Вы видите, какие темы закреплены, какие увядают
            и что требует внимания.
          </p>

          <p style={{ marginTop: "10px", fontSize: "14px", color: "#64748b" }}>
            Система обучения с интервальным повторением и визуализацией
            прогресса
          </p>

          <button
            onClick={() => navigate("/register")}
            style={{
              marginTop: "30px",
              padding: "12px 24px",
              background: "#22c55e",
              border: "none",
              borderRadius: "8px",
              fontWeight: "bold",
              cursor: "pointer",
            }}
          >
            ПОПРОБОВАТЬ ПРЯМО СЕЙЧАС
          </button>
        </div>

        <div style={{ fontSize: "200px" }}>🌱</div>
      </div>
    </div>
  );
}