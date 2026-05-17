import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../components/header/Header";
import {
  getMe,
  getFriends,
  getUserStats,
  updateProfile,
  getAchievementsProgress,
  getLevelRewardsProgress,
} from "../../api/auth";
import EditProfileModal from "../../components/modalsEditProfile/EditProfileModal";
import "./profile.css";

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [friends, setFriends] = useState([]);
  const [stats, setStats] = useState(null);
  const [latestAchievements, setLatestAchievements] = useState([]);
  const [message, setMessage] = useState("Загрузка профиля...");
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");

    async function fetchProfileData() {
      try {
        const [me, friendsData, statsData, achievementsData, levelRewardsData] =
          await Promise.all([
            getMe(token),
            getFriends(token),
            getUserStats(token),
            getAchievementsProgress(),
            getLevelRewardsProgress(),
          ]);

        setUser(me);
        setFriends(friendsData);
        setStats(statsData);
        const achievements = Array.isArray(achievementsData)
          ? achievementsData
          : [];

        const levelRewards = Array.isArray(levelRewardsData)
          ? levelRewardsData
          : [];

        const unlockedAchievements = achievements
          .filter((item) => item.is_unlocked)
          .map((item) => ({
            id: `achievement-${item.id}`,
            title: item.title,
            description: item.description,
            type: "achievement",
            xp:
              item.rewards?.find((reward) => reward.type === "xp")?.value ?? 0,
          }));

        const unlockedLevelRewards = levelRewards
          .filter((item) => item.is_unlocked)
          .map((item) => ({
            id: `level-${item.id}`,
            title: `${item.level} уровень аккаунта`,
            description: item.plant?.name
              ? `Открыто растение ${item.plant.name}`
              : "Открыта награда за уровень",
            type: "plant",
            xp: 0,
            image_url: item.plant?.image_url,
            rarity: item.plant?.rarity,
          }));

        setLatestAchievements(
          [...unlockedAchievements, ...unlockedLevelRewards]
            .slice(-4)
            .reverse(),
        );
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
  const level = stats?.level ?? 0;
  const totalXp = stats?.total_xp ?? 0;
  const currentXp = stats?.current_progress_xp ?? 0;
  const maxXp = stats?.current_max_xp ?? 100;
  const progressWidth = `${Math.min((currentXp / maxXp) * 100, 100)}%`;

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
                  <button
                    className="profile-edit-button"
                    onClick={() => setIsEditProfileOpen(true)}
                  >
                    ✎
                  </button>
                </div>

                <p className="profile-user-tag">@{user?.username || "user"}</p>
                <p className="profile-bio">
                  {user?.description || "Описание профиля пока не добавлено"}
                </p>

                <div className="profile-meta-row">
                  <span className="profile-meta-item">
                    <span className="profile-meta-icon">▣</span>
                    Участник с {formatJoinDate(user?.created_at)}
                  </span>
                  <button onClick={handleLogout} className="profile-btn-logout">
                    Выйти
                  </button>
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

            <section
              className="profile-stats-grid"
              aria-label="Статистика профиля"
            >
              <article className="profile-stat-card profile-panel profile-stat-card--wide">
                <span className="profile-stat-icon profile-stat-icon--green">
                  ✚
                </span>
                <div className="profile-level-box">
                  <div className="title-lvl">
                    <strong className="lvl">{level}</strong>
                    <span className="lvl-tit">уровень</span>
                  </div>
                  <div className="profile-xp-bar" aria-hidden="true">
                    <span style={{ width: stats?.progress_width || "0%" }} />
                  </div>

                  <small>
                    {stats?.current_progress_xp ?? 0} /{" "}
                    {stats?.current_max_xp ?? 100} XP
                  </small>
                </div>
              </article>

              <article className="profile-stat-card profile-panel">
                <span className="profile-stat-icon profile-stat-icon--green">
                  ◷
                </span>
                <div>
                  <strong>67 ч</strong>
                  <span>
                    Общее время
                    <br />
                    фокусировки
                  </span>
                </div>
              </article>

              <article className="profile-stat-card profile-panel">
                <span className="profile-stat-icon profile-stat-icon--gold">
                  ☆
                </span>
                <div>
                  <strong>{totalXp}</strong>
                  <span>XP заработано</span>
                </div>
              </article>

              <article className="profile-stat-card profile-panel">
                <span className="profile-stat-icon profile-stat-icon--green">
                  ⚇
                </span>
                <div>
                  <strong>{friends.length}</strong>
                  <span>Друзей</span>
                </div>
              </article>
            </section>

            <section className="profile-bottom-grid">
              <article className="profile-panel profile-section-card profile-achievements-card">
                <div className="profile-section-header">
                  <h2>Последние достижения</h2>
                </div>

                <div className="profile-achievements-list">
                  {latestAchievements.length > 0 ? (
                    latestAchievements.map((achievement) => (
                      <div
                        key={achievement.id}
                        className="profile-achievement-item"
                      >
                        <div className="profile-achievement-icon">
                          {achievement.image_url ? (
                            <img src={achievement.image_url} alt="" />
                          ) : (
                            <span>XP</span>
                          )}
                        </div>

                        <div className="profile-achievement-info">
                          <div className="profile-achievement-top">
                            <h3>{achievement.title}</h3>

                            {achievement.xp > 0 && (
                              <span className="profile-achievement-xp">
                                +{achievement.xp} XP
                              </span>
                            )}
                          </div>

                          <p>{achievement.description}</p>

                          <span className="profile-achievement-status">
                            Получено
                          </span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="profile-friends-empty">Достижений пока нет</p>
                  )}
                </div>
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
                          <span
                            className={`profile-rating-rank profile-rating-rank--${index + 1}`}
                          >
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

        {isEditProfileOpen && (
          <EditProfileModal
            user={user}
            onClose={() => setIsEditProfileOpen(false)}
            onSave={async (payload) => {
              const token = localStorage.getItem("token");

              const usernameChanged = payload.username !== user?.username;

              const updatedUser = await updateProfile(token, payload);

              if (usernameChanged) {
                localStorage.removeItem("token");
                setIsEditProfileOpen(false);
                window.location.href = "/";
                return;
              }

              setUser(updatedUser);
              setIsEditProfileOpen(false);
            }}
          />
        )}
      </main>
    </div>
  );
}
