import "./style.css";

export default function XpProgressAchievementCard({ title, description }) {
  return (
    <article className="xp-progress-achievement-card xp-progress-achievement-card--xp">
      <div className="xp-progress-achievement-card__main">
        <div className="xp-progress-achievement-card__icon xp-progress-achievement-card__icon--xp">
          <span>XP</span>
        </div>

        <div className="xp-progress-achievement-card__content">
          <h3 className="xp-progress-achievement-card__title">{title}</h3>
          <p className="xp-progress-achievement-card__description">
            {description}
          </p>
        </div>
      </div>

      <div className="xp-progress-achievement-card__progress">
        <span
          className="xp-progress-achievement-card__progress-fill"
          style={{ width: "60%" }}
        />

        <span className="xp-progress-achievement-card__progress-count">
          12/20
        </span>
      </div>

      <div className="xp-progress-achievement-card__footer">
        <span className="xp-progress-achievement-card__xp">150 XP</span>
        <span className="xp-progress-achievement-card__status">В процессе</span>
      </div>
    </article>
  );
}
