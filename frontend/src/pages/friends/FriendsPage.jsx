import Header from "../../components/header/Header";
import "./friends.css";

const UsersIcon = ({ className = "" }) => (
  <svg
    className={className}
    width="48"
    height="48"
    viewBox="0 0 48 48"
    fill="none"
    aria-hidden="true"
  >
    <path
      d="M18.5 24.5c5.247 0 9.5-4.253 9.5-9.5s-4.253-9.5-9.5-9.5S9 9.753 9 15s4.253 9.5 9.5 9.5Z"
      stroke="currentColor"
      strokeWidth="3.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M4.5 42c1.91-8.01 6.85-12.5 14-12.5S30.59 33.99 32.5 42"
      stroke="currentColor"
      strokeWidth="3.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M31.5 23.5c3.83-.33 7-3.82 7-8 0-4.42-3.36-8-7.5-8"
      stroke="currentColor"
      strokeWidth="3.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M34.5 30.5c5.02 1.28 8.02 5.15 9 11.5"
      stroke="currentColor"
      strokeWidth="3.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const SearchIcon = ({ className = "" }) => (
  <svg
    className={className}
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    aria-hidden="true"
  >
    <path
      d="M10.75 18.5a7.75 7.75 0 1 0 0-15.5 7.75 7.75 0 0 0 0 15.5ZM16.5 16.5 21 21"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const MoreIcon = ({ className = "" }) => (
  <svg
    className={className}
    width="22"
    height="22"
    viewBox="0 0 22 22"
    fill="none"
    aria-hidden="true"
  >
    <path
      d="M11 5.2h.01M11 11h.01M11 16.8h.01"
      stroke="currentColor"
      strokeWidth="3.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default function FriendsPage() {
  return (
    <div className="friends-page">
      <Header />

      <main className="friends-container">
        <section className="friends-hero">
          <h1 className="friends-title">Друзья</h1>
          <p className="friends-subtitle">Находите друзей и управляйте заявками</p>
        </section>

        <section className="friends-top-grid">
          <div className="friends-search-card">
            <h2 className="friends-search-title">Найти пользователя</h2>

            <label className="friends-search-field">
              <SearchIcon className="friends-search-icon" />
              <input
                type="text"
                placeholder="Введите имя пользователя..."
                aria-label="Глобальный поиск пользователей"
              />
            </label>
          </div>

          <div className="friends-stat-card friends-stat-card-green">
            <UsersIcon className="friends-stat-icon" />
            <div>
              <p className="friends-stat-label">Друзей</p>
              <p className="friends-stat-value">8</p>
            </div>
          </div>
        </section>

        <section className="friends-content-grid">
          <div className="friends-panel friends-list-panel">
            <div className="friends-panel-header friends-panel-header-green">
              <h2>Мои друзья</h2>
            </div>

            <div className="friends-scroll-area friends-list-items">
              <article className="friends-item">
                <div className="friends-item-icon" aria-hidden="true"><span>М</span></div>
                <div className="friends-item-info">
                  <p className="friends-item-username">Михаил</p>
                  <p className="friends-item-meta">Уровень 31</p>
                </div>
                <button className="friends-profile-button" type="button">Удалить</button>
                <button className="friends-more-button" type="button" aria-label="Дополнительно"><MoreIcon /></button>
              </article>

              <article className="friends-item">
                <div className="friends-item-icon" aria-hidden="true"><span>Д</span></div>
                <div className="friends-item-info">
                  <p className="friends-item-username">Данил</p>
                  <p className="friends-item-meta">Уровень 24</p>
                </div>
                <button className="friends-profile-button" type="button">Удалить</button>
                <button className="friends-more-button" type="button" aria-label="Дополнительно"><MoreIcon /></button>
              </article>

              <article className="friends-item">
                <div className="friends-item-icon" aria-hidden="true"><span>К</span></div>
                <div className="friends-item-info">
                  <p className="friends-item-username">Кирилл</p>
                  <p className="friends-item-meta">Уровень 19</p>
                </div>
                <button className="friends-profile-button" type="button">Удалить</button>
                <button className="friends-more-button" type="button" aria-label="Дополнительно"><MoreIcon /></button>
              </article>

              <article className="friends-item">
                <div className="friends-item-icon" aria-hidden="true"><span>Н</span></div>
                <div className="friends-item-info">
                  <p className="friends-item-username">Никита</p>
                  <p className="friends-item-meta">Уровень 16</p>
                </div>
                <button className="friends-profile-button" type="button">Удалить</button>
                <button className="friends-more-button" type="button" aria-label="Дополнительно"><MoreIcon /></button>
              </article>
            </div>
          </div>

          <div className="friends-panel friends-requests-panel">
            <div className="friends-panel-header friends-panel-header-purple">
              <h2>Заявки в друзья</h2>
              <span>3</span>
            </div>

            <div className="friends-scroll-area friends-notifications-items">
              <article className="friends-request-item">
                <div className="friends-request-icon" aria-hidden="true"><span>А</span></div>
                <div className="friends-request-info">
                  <p className="friends-request-username">Артём</p>
                  <p className="friends-request-email">artem@example.com</p>
                </div>
                <div className="friends-request-actions">
                  <button className="friends-request-accept" type="button">Принять</button>
                  <button className="friends-request-reject" type="button">Отклонить</button>
                  <button className="friends-more-button" type="button" aria-label="Дополнительно"><MoreIcon /></button>
                </div>
              </article>

              <article className="friends-request-item">
                <div className="friends-request-icon" aria-hidden="true"><span>С</span></div>
                <div className="friends-request-info">
                  <p className="friends-request-username">София</p>
                  <p className="friends-request-email">Уровень 12</p>
                </div>
                <div className="friends-request-actions">
                  <button className="friends-request-accept" type="button">Принять</button>
                  <button className="friends-request-reject" type="button">Отклонить</button>
                  <button className="friends-more-button" type="button" aria-label="Дополнительно"><MoreIcon /></button>
                </div>
              </article>

              <article className="friends-request-item">
                <div className="friends-request-icon" aria-hidden="true"><span>И</span></div>
                <div className="friends-request-info">
                  <p className="friends-request-username">Илья</p>
                  <p className="friends-request-email">Уровень 9</p>
                </div>
                <div className="friends-request-actions">
                  <button className="friends-request-accept" type="button">Принять</button>
                  <button className="friends-request-reject" type="button">Отклонить</button>
                  <button className="friends-more-button" type="button" aria-label="Дополнительно"><MoreIcon /></button>
                </div>
              </article>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
