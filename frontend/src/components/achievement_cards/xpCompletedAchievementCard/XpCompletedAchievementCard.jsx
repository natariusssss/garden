import "./style.css";
const ICONS = {
  ready: "/card-icons/ready.svg",
  achieve: "/card-icons/achieve.svg",
};

export default function XpCompletedAchievementCard({
  title,
  description,
  xpReward = 0,
}) {
  return (
    <article className="xp-completed-achievement-card xp-completed-achievement-card--xp xp-completed-achievement-card--completed">
      <img
        className="xp-completed-achievement-card__check"
        aria-label="Получено"
        src={ICONS.ready}
      ></img>

      <div className="xp-completed-achievement-card__main">
        <div className="xp-completed-achievement-card__icon xp-completed-achievement-card__icon--xp">
          <span>XP</span>
        </div>

        <div className="xp-completed-achievement-card__content">
          <h3 className="xp-completed-achievement-card__title">{title}</h3>
          <p className="xp-completed-achievement-card__description">
            {description}
          </p>
        </div>
      </div>

      <div className="xp-completed-achievement-card__footer xp-completed-achievement-card__footer--completed">
        <span className="xp-completed-achievement-card__xp">{xpReward} XP</span>
        <span className="xp-completed-achievement-card__status xp-completed-achievement-card__status--done">
          Получено
        </span>
      </div>
    </article>
  );
}
