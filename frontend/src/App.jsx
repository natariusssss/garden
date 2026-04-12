import { Navigate, Route, Routes } from "react-router-dom";
import TopicsPage from "./pages/topics/TopicsPage"
import TopicPage from "./pages/TopicPage";
import LoginPage from "./pages/login/LoginPage";
import RegisterPage from "./pages/regist/RegisterPage"
import Home from "./pages/home/Home";

function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");
  if (!token) return <Navigate to="/register" replace />;
  return children;
}

export default function App() {
  return (
    <Routes>
      {/* публичные страницы */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* защищённая часть приложения */}
      <Route>
        <Route path="/topicPage" element={<TopicsPage />} />
        <Route path="/topics/:id" element={<TopicPage />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}