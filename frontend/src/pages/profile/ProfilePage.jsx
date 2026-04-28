import Header from "../../components/header/Header";
import "./profile.css";

export default function ProfilePage() {
  return (
    <div className="profile-page">
      <Header />

      <main className="profile-container">
        <section className="profile-dashboard">
          <article className="profile-hero profile-panel">
            <div className="profile-avatar" aria-hidden="true">
              <span>А</span>
              <span className="profile-avatar-edit">✎</span>
            </div>

            <div className="profile-main-info">
              <div className="profile-title-row">
                <h1>Алексей</h1>
                <span className="profile-edit-button" aria-hidden="true">✎</span>
              </div>

              <p className="profile-user-tag">@alexey</p>
              <p className="profile-bio">
                Фокусируюсь на росте каждый день.
                <br />
                Маленькие шаги — большие результаты.
              </p>

              <div className="profile-meta-row">
                <span className="profile-meta-item">
                  <span className="profile-meta-icon">▣</span>
                  Участник с марта 2024
                </span>
              </div>
            </div>

            <div className="profile-streak-card">
              <div>
                <p>Серия дней</p>
                <strong>14 дней</strong>
                <span>Лучший результат: 28 дней</span>
              </div>
            </div>
          </article>

          <section className="profile-stats-grid" aria-label="Статистика профиля">
            <article className="profile-stat-card profile-panel profile-stat-card--wide">
              <span className="profile-stat-icon profile-stat-icon--green">✚</span>
              <div className="profile-level-box">
                <div className="title-lvl">
                  <strong className="lvl">27</strong>
                  <span className="lvl-tit">уровень</span>
                </div>
                <div className="profile-xp-bar" aria-hidden="true">
                  <span style={{ width: "68%" }} />
                </div>
                <small>2380 / 3500 XP</small>
              </div>
            </article>

            <article className="profile-stat-card profile-panel">
              <span className="profile-stat-icon profile-stat-icon--green">◷</span>
              <div>
                <strong>32 ч 15 м</strong>
                <span>Общее время<br />фокусировки</span>
              </div>
            </article>

            <article className="profile-stat-card profile-panel">
              <span className="profile-stat-icon profile-stat-icon--gold">☆</span>
              <div>
                <strong>2 380</strong>
                <span>XP заработано</span>
              </div>
            </article>

            <article className="profile-stat-card profile-panel">
              <span className="profile-stat-icon profile-stat-icon--green">⚇</span>
              <div>
                <strong>8</strong>
                <span>Друзей</span>
              </div>
            </article>
          </section>

          <section className="profile-bottom-grid">
            <article className="profile-panel profile-section-card profile-achievements-card">
              <div className="profile-section-header">
                <h2>Достижения</h2>
              </div>

              <div className="profile-achievements-list">
                <div className="profile-achievement profile-achievement--pink">
                  <span className="profile-achievement-icon">♨</span>
                  <div>
                    <strong>Пламя дисциплины</strong>
                    <p>14 дней подряд</p>
                  </div>
                  <span className="profile-done-check">✓</span>
                </div>

                <div className="profile-achievement profile-achievement--orange">
                  <span className="profile-achievement-icon">◎</span>
                  <div>
                    <strong>Мастер фокуса</strong>
                    <p>Провести 50 фокус-сессий</p>
                  </div>
                  <span className="profile-done-check">✓</span>
                </div>

                <div className="profile-achievement profile-achievement--cyan">
                  <span className="profile-achievement-icon">◷</span>
                  <div>
                    <strong>Время — золото</strong>
                    <p>Сфокусироваться 50 часов</p>
                  </div>
                  <span className="profile-done-check">✓</span>
                </div>

                <div className="profile-achievement profile-achievement--purple">
                  <span className="profile-achievement-icon">♕</span>
                  <div>
                    <strong>Целеустремлённость</strong>
                    <p>Выполнить 100 задач</p>
                  </div>
                  <span className="profile-done-check">✓</span>
                </div>
              </div>
            </article>

            <aside className="profile-panel profile-section-card profile-rating-card">
              <div className="profile-section-header">
                <h2>Рейтинг друзей</h2>
              </div>

              <div className="profile-rating-list">
                <div className="profile-rating-item">
                  <span className="profile-rating-rank profile-rating-rank--1">1</span>
                  <span className="profile-rating-avatar">М</span>
                  <strong>Михаил</strong>
                  <span className="profile-rating-xp">4 820 XP</span>
                </div>

                <div className="profile-rating-item">
                  <span className="profile-rating-rank profile-rating-rank--2">2</span>
                  <span className="profile-rating-avatar">А</span>
                  <strong>Алексей</strong>
                  <span className="profile-rating-xp">3 940 XP</span>
                </div>

                <div className="profile-rating-item">
                  <span className="profile-rating-rank profile-rating-rank--3">3</span>
                  <span className="profile-rating-avatar">Д</span>
                  <strong>Данил</strong>
                  <span className="profile-rating-xp">3 510 XP</span>
                </div>

                <div className="profile-rating-item">
                  <span className="profile-rating-rank">4</span>
                  <span className="profile-rating-avatar">К</span>
                  <strong>Кирилл</strong>
                  <span className="profile-rating-xp">2 840 XP</span>
                </div>

                <div className="profile-rating-item">
                  <span className="profile-rating-rank">5</span>
                  <span className="profile-rating-avatar">Н</span>
                  <strong>Никита</strong>
                  <span className="profile-rating-xp">2 410 XP</span>
                </div>
              </div>
            </aside>
          </section>
        </section>
      </main>
    </div>
  );
}
