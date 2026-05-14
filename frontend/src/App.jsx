import { Navigate, Route, Routes } from "react-router-dom";
import TopicsPage from "./pages/topics/TopicsPage";
import LoginPage from "./pages/login/LoginPage";
import RegisterPage from "./pages/regist/RegisterPage";
import Home from "./pages/home/Home";
import AchievePage from "./pages/achievements/Achieve";
import ProfilePage from "./pages/profile/ProfilePage";
import Card from "./pages/card/Card";
import FriendsPage from "./pages/friends/FriendsPage";
import FriendProfilePage from "./pages/friends/FriendProfilePage";
import GlobalAchievementNotifications from "./components/achievementNotification/GlobalAchievementNotifications";

function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");
  if (!token) return <Navigate to="/login" replace />;
  return children;
}

export default function App() {
  return (
    <>
      <GlobalAchievementNotifications />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/friends/:friendId" element={<FriendProfilePage />} />

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
              <Card />
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

        <Route
          path="/achieve"
          element={
            <ProtectedRoute>
              <AchievePage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/friends"
          element={
            <ProtectedRoute>
              <FriendsPage />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}
