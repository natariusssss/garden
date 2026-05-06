import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../components/header/Header";
import { getMe, getFriends, getUserStats } from "../../api/auth";
import "./profile.css";

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [friends, setFriends] = useState([]);
  const [stats, setStats] = useState(null);
  const [message, setMessage] = useState("Загрузка профиля...");

  useEffect(() => {
    const token = localStorage.getItem("token");

    async function fetchProfileData() {
      try {
        const me = await getMe(token);
        const friendsData = await getFriends(token);
        const statsData = await getUserStats(token);

        setUser(me);
        setFriends(friendsData);
        setStats(statsData);
        setMessage("");
      } catch (error) {
        setMessage(error.message || "Ошибка загрузки профиля");
      }
    }

    fetchProfileData();
  }, []);

  const formatJoinDate = (date) => {
    if (!date) return "—";

    return new Date(date).toLocaleDateString("ru-RU", {
      month: "long",
      year: "numeric",
    });
  };

  const getInitial = (username) => {
    return username ? username[0].toUpperCase() : "?";
  };

  const navigate = useNavigate();
  const handleLogout = () => {
    const isConfirmed = window.confirm(`Вы хотите выйти?`);

    if (!isConfirmed) return;

    localStorage.removeItem("token");
    navigate("/");

  };

  return (
    <div className="profile-page">
      <Header />

      <main className="profile-container">
        {message && !user ? (
          <p className="profile-message">{message}</p>
        ) : (
          <section className="profile-dashboard">
            <article className="profile-hero profile-panel">
              <div className="profile-avatar" aria-hidden="true">
                <span>{getInitial(user?.username)}</span>
                <button className="profile-avatar-edit">✎</button>
              </div>

              <div className="profile-main-info">
                <div className="profile-title-row">
                  <h1>{user?.username || "Пользователь"}</h1>
                  <button className="profile-edit-button" aria-hidden="true">✎</button>
                </div>

                <p className="profile-user-tag">@{user?.username || "user"}</p>
                <p className="profile-bio">
                  Фокусируюсь на росте каждый день.
                  <br />
                  Маленькие шаги — большие результаты.
                </p>

                <div className="profile-meta-row">
                  <span className="profile-meta-item">
                    <span className="profile-meta-icon">▣</span>
                    Участник с {formatJoinDate(user?.created_at)}
                  </span>
                  <button onClick={handleLogout} className="profile-btn-logout">Выйти</button>
                </div>
              </div>

              <div className="profile-streak-card">
                <div>
                  <p>Серия дней</p>
                  <strong>67 дней</strong>
                  <span>Лучший результат: 67 дней</span>
                </div>
              </div>
            </article>

            <section className="profile-stats-grid" aria-label="Статистика профиля">
              <article className="profile-stat-card profile-panel profile-stat-card--wide">
                <span className="profile-stat-icon profile-stat-icon--green">✚</span>
                <div className="profile-level-box">
                  <div className="title-lvl">
                    <strong className="lvl">67</strong>
                    <span className="lvl-tit">уровень</span>
                  </div>
                  <div className="profile-xp-bar" aria-hidden="true">
                    <span style={{ width: "68%" }} />
                  </div>
                  <small>67 XP</small>
                </div>
              </article>

              <article className="profile-stat-card profile-panel">
                <span className="profile-stat-icon profile-stat-icon--green">◷</span>
                <div>
                  <strong>67 ч</strong>
                  <span>Общее время<br />фокусировки</span>
                </div>
              </article>

              <article className="profile-stat-card profile-panel">
                <span className="profile-stat-icon profile-stat-icon--gold">☆</span>
                <div>
                  <strong>67</strong>
                  <span>XP заработано</span>
                </div>
              </article>

              <article className="profile-stat-card profile-panel">
                <span className="profile-stat-icon profile-stat-icon--green">⚇</span>
                <div>
                  <strong>{friends.length}</strong>
                  <span>Друзей</span>
                </div>
              </article>
            </section>

            <section className="profile-bottom-grid">
              
              <article className="profile-panel profile-section-card profile-achievements-card">
              
              </article>

              <aside className="profile-panel profile-section-card profile-rating-card">
                <div className="profile-section-header">
                  <h2>Рейтинг друзей</h2>
                </div>

                <div className="profile-rating-list">
                  {friends.length > 0 ? (
                    friends
                      .slice()
                      .sort((a, b) => (b.total_xp ?? 0) - (a.total_xp ?? 0))
                      .map((friend, index) => (
                        <div key={friend.id} className="profile-rating-item">
                          <span className={`profile-rating-rank profile-rating-rank--${index + 1}`}>
                            {index + 1}
                          </span>
                          <span className="profile-rating-avatar">
                            {getInitial(friend.username)}
                          </span>
                          <strong>{friend.username}</strong>
                          <span className="profile-rating-xp">
                            {friend.total_xp ?? 0} XP
                          </span>
                        </div>
                      ))
                  ) : (
                    <p className="profile-friends-empty">Друзей нет</p>
                  )}
                </div>
              </aside>
            </section>
          </section>
        )}
      </main>
    </div>
  );
}