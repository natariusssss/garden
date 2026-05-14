import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "../../components/header/Header";
import { getFriendProgress } from "../../api/auth";
import "../profile/profile.css";

export default function FriendProfilePage() {
  const { friendId } = useParams();
  const [friend, setFriend] = useState(null);
  const [message, setMessage] = useState("Загрузка профиля друга...");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");

    async function fetchFriendProfile() {
      try {
        const data = await getFriendProgress(friendId, token);
        setFriend(data);
        setMessage("");
      } catch (error) {
        setMessage(error.message || "Ошибка загрузки профиля друга");
      }
    }

    fetchFriendProfile();
  }, [friendId]);

  const getInitial = (username) => {
    return username ? username[0].toUpperCase() : "?";
  };

  return (
    <div className="profile-page">
      <Header />

      <main className="profile-container">
        <div className="friend-back-row">
          <button
            className="friend-back-button"
            onClick={() => navigate("/friends")}
          >
            <span className="friend-back-arrow">←</span>
            Назад к друзьям
          </button>
        </div>
        {message && !friend ? (
          <p className="profile-message">{message}</p>
        ) : (
          <section className="profile-dashboard friend-profile-dashboard">
            <article className="profile-hero profile-panel">
              <div className="profile-avatar" aria-hidden="true">
                <span>{getInitial(friend?.username)}</span>
              </div>

              <div className="profile-main-info">
                <div className="profile-title-row">
                  <h1>{friend?.username}</h1>
                </div>

                <p className="profile-user-tag">@{friend?.username}</p>

                <p className="profile-bio">
                  Профиль друга.
                  <br />
                  Можно посмотреть его прогресс.
                </p>
              </div>

              <div className="profile-streak-card">
                <div>
                  <p>Уровень</p>
                  <strong>{friend?.total_level ?? 1}</strong>
                  <span>{friend?.total_xp ?? 0} XP</span>
                </div>
              </div>
            </article>

            <section
              className="profile-stats-grid"
              aria-label="Статистика друга"
            >
              <article className="profile-stat-card profile-panel profile-stat-card--wide">
                <span className="profile-stat-icon profile-stat-icon--green">
                  ✚
                </span>
                <div className="profile-level-box">
                  <div className="title-lvl">
                    <strong className="lvl">{friend?.total_level ?? 1}</strong>
                    <span className="lvl-tit">уровень</span>
                  </div>

                  <div className="profile-xp-bar" aria-hidden="true">
                    <span style={{ width: "68%" }} />
                  </div>

                  <small>{friend?.total_xp ?? 0} XP</small>
                </div>
              </article>

              <article className="profile-stat-card profile-panel">
                <span className="profile-stat-icon profile-stat-icon--gold">
                  ☆
                </span>
                <div>
                  <strong>{friend?.total_xp ?? 0}</strong>
                  <span>XP заработано</span>
                </div>
              </article>

              <article className="profile-stat-card profile-panel">
                <span className="profile-stat-icon profile-stat-icon--green">
                  ⚇
                </span>
                <div>
                  <strong>{friend?.topics_count ?? 0}</strong>
                  <span>Тем создано</span>
                </div>
              </article>
            </section>

            <section className="friend-profile-bottom">
              <article className="profile-panel profile-section-card friend-topics-card">
                <div className="profile-section-header">
                  <h2>Темы друга</h2>
                </div>

                <div className="profile-achievements-list">
                  {friend?.topics?.length > 0 ? (
                    friend.topics.map((topic) => (
                      <div key={topic.id} className="profile-achievement">
                        <span className="profile-achievement-icon">🌱</span>
                        <div>
                          <strong>{topic.name}</strong>
                          <p>
                            Уровень {topic.level} · {topic.xp} XP
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="profile-friends-empty">Тем пока нет</p>
                  )}
                </div>
              </article>
            </section>
          </section>
        )}
      </main>
    </div>
  );
}
