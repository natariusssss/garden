import { Navigate, Route, Routes } from "react-router-dom";
import TopicsPage from "./pages/topics/TopicsPage";
import LoginPage from "./pages/login/LoginPage";
import RegisterPage from "./pages/regist/RegisterPage";
import Home from "./pages/home/Home";
import AchievePage from "./pages/achievements/Achieve";
import ProfilePage from "./pages/profile/ProfilePage";

function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");
  if (!token) return <Navigate to="/login" replace />;
  return children;
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/achieve" element={<AchievePage />} />

      <Route
        path="/topicPage"
        element={
          <ProtectedRoute>
            <TopicsPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/topics/:id"
        element={
          <ProtectedRoute>
            <TopicsPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
