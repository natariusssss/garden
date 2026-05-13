import "./style.css";

export default function XpProgressAchievementCard({
  title,
  description,
  current_value = 0,
  condition_value = 1,
  xpReward = 0,
}) {
  const safeCondition = condition_value || 1;
  const safeCurrent = current_value || 0;
  const width_per = Math.min(100, (safeCurrent / safeCondition) * 100);

  return (
    <article className="xp-progress-achievement-card xp-progress-achievement-card--xp">
      <span className="xp-progress-achievement-card__count">
        {safeCurrent} / {condition_value}
      </span>

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
        <span style={{ width: `${width_per}%` }} />
      </div>

      <div className="xp-progress-achievement-card__footer">
        <span className="xp-progress-achievement-card__xp">+{xpReward} XP</span>
        <span className="xp-progress-achievement-card__status">В процессе</span>
      </div>
    </article>
  );
}
