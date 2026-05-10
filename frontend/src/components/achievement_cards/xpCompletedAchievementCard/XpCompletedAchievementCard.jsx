import "./style.css";

export default function XpCompletedAchievementCard() {
  return (
    <article className="xp-completed-achievement-card xp-completed-achievement-card--xp xp-completed-achievement-card--completed">
      <div className="xp-completed-achievement-card__main">
        <div className="xp-completed-achievement-card__icon xp-completed-achievement-card__icon--xp">
          <span>XP</span>
        </div>

        <div className="xp-completed-achievement-card__content">
          <span className="xp-completed-achievement-card__reward xp-completed-achievement-card__reward--xp">+50 XP</span>
          <h3 className="xp-completed-achievement-card__title">Первые шаги</h3>
          <p className="xp-completed-achievement-card__description">
            Создай первую тему и получи стартовую награду
          </p>
        </div>
      </div>

      <div className="xp-completed-achievement-card__footer xp-completed-achievement-card__footer--completed">
        <span className="xp-completed-achievement-card__xp">50 XP</span>
        <span className="xp-completed-achievement-card__status xp-completed-achievement-card__status--done">
          Получено
        </span>
      </div>
    </article>
  );
}
