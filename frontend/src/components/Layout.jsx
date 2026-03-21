import { Link, Outlet } from "react-router-dom";

export default function Layout() {
  return (
    <div style={{ minHeight: "100vh", background: "#020617", color: "white" }}>
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
          <Link to="/dashboard" style={{ color: "#94a3b8", textDecoration: "none" }}>
            Мой сад
          </Link>
          <Link to="/dashboard" style={{ color: "#94a3b8", textDecoration: "none" }}>
            Темы и связи
          </Link>
          <Link to="/dashboard" style={{ color: "#94a3b8", textDecoration: "none" }}>
            Повторение
          </Link>
          <Link to="/dashboard" style={{ color: "#94a3b8", textDecoration: "none" }}>
            Команда
          </Link>
        </div>

        <Link to="/profile">
          <button>Личный кабинет</button>
        </Link>
      </div>

      <div style={{ padding: "24px" }}>
        <Outlet />
      </div>
    </div>
  );
}