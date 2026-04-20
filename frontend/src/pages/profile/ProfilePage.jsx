import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getMe } from "../../api/auth";
import Header from "../../components/header/Header";
import "./profile.css";
import lockImg from "../achievements/lock.png";

const friends = [
  {
    id: 1,
    username: "Антон Чехов",
    avatar: lockImg,
  },
  {
    id: 2,
    username: "Сергей Витальевич",
    avatar: lockImg,
  },
  {
    id: 3,
    username: "Николай",
    avatar: lockImg,
  },
  {
    id: 4,
    username: "Максим Антонович",
    avatar: lockImg,
  },


];

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

  return (
    <div className="profile-page">
      <Header />

      <main className="profile-container">
        <section className="profile-layout">
          <div className="profile-left">
            <div className="profile-card">
              <div className="profile-info">
                <div className="profile-avatar-wrap">
                  <img src={lockImg} alt="Аватар" className="profile-avatar" />
                </div>

                <div className="profile-stats">
                  <h1 className="profile-name">
                    {user ? user.username : "Загрузка..."}
                  </h1>

                  <p className="profile-level">17 уровень</p>
                  <p className="profile-xp">XP: 253</p>
                  <p className="profile-friends-count">21 друзей</p>
                  <p className="profile-created">
                    {user
                      ? "Дата регистрации: " +
                        new Date(user.created_at).toLocaleDateString()
                      : "Загрузка..."}
                  </p>
                </div>
              </div>
            </div>

            <div className="profile-achievements-card">
              <h1 className="profile-achievements-header">Деятельность</h1>

              <div className="profile-achievements-stats">
                <div className="profile-achievements-count">
                  <h2>достижений выполнено</h2>
                  <img
                    src={lockImg}
                    alt="Аватар"
                    className="achievements-count-image"
                  />
                  <h3>32/52</h3>
                </div>

                <div className="profile-achievements-cards-count">
                  <h2>карточек создано</h2>
                  <img
                    src={lockImg}
                    alt="Аватар"
                    className="cards-count-image"
                  />
                  <h3>32/52</h3>
                </div>

                <div className="profile-achievements-hours-count">
                  <h2>часов фокуса</h2>
                  <img
                    src={lockImg}
                    alt="Аватар"
                    className="hours-count-image"
                  />
                  <h3>32/52</h3>
                </div>
              </div>
            </div>
          </div>

          <aside className="profile-friends-card">
            <h1 className="profile-friends-header">Рейтинг друзей</h1>

            <div className="profile-friends-list">
              {friends.length > 0 ? (
                friends.map((friend, index) => (
                  <div key={friend.id} className="profile-friends-item">
                    <span className="profile-friends-rank">{index + 1}</span>

                    <img
                      src={friend.avatar}
                      alt={friend.username}
                      className="profile-friends-item-icon"
                    />

                    <p className="profile-friends-item-username">
                      {friend.username}
                    </p>
                  </div>
                ))
              ) : (
                <p className="profile-friends-empty">Нет друзей</p>
              )}
            </div>
          </aside>
          </section>
        </main>
        </div>
  )
}
