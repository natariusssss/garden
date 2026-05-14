import "./style.css";

const ICONS = {
  ready: "/card-icons/ready.svg",
  achieve: "/card-icons/achieve.svg",
};

export default function PlantCompletedAchievementCard({
  title,
  description,
  img,
  rarity = "common",
  name,
  rarity_name = "Обычное",
  xpReward = 0,
  hideDescription = false,
  unlockLabel = "Открыто растение",
  statusText = "Получено",
}) {
  const currentRarity = rarity || "common";

  return (
    <article
      className={`plant-completed-achievement-card plant-completed-achievement-card--${currentRarity} plant-completed-achievement-card--completed ${hideDescription ? "plant-completed-achievement-card--without-description" : ""}`}
    >
      <img
        className="plant-completed-achievement-card__check"
        aria-label="Получено"
        src={ICONS.ready}
      ></img>

      <div className="plant-completed-achievement-card__main">
        <div className="plant-completed-achievement-card__picture">
          <img
            className="plant-completed-achievement-card__image"
            src={img}
            alt={name || "Растение"}
          />
        </div>

        <div className="plant-completed-achievement-card__content">
          <h3 className="plant-completed-achievement-card__title">{title}</h3>
          {!hideDescription && description && (
            <p className="plant-completed-achievement-card__description">
              {description}
            </p>
          )}

          <div className="plant-completed-achievement-card__tags">
            <span className="plant-completed-achievement-card__tag plant-completed-achievement-card__tag--plant">
              Растение
            </span>
            <span
              className={`plant-completed-achievement-card__tag plant-completed-achievement-card__tag--${currentRarity}`}
            >
              {rarity_name}
            </span>
          </div>
        </div>
      </div>

      <div className="plant-completed-achievement-card__footer plant-completed-achievement-card__footer--completed">
        <div className="plant-completed-achievement-card__unlock">
          <span>
            {unlockLabel}
            <strong>{name}</strong>
          </span>
        </div>

        <div className="plant-completed-achievement-card__footer-right">
          {xpReward > 0 && (
            <span className="plant-completed-achievement-card__xp-reward">
              +{xpReward} XP
            </span>
          )}
          <span className="plant-completed-achievement-card__status plant-completed-achievement-card__status--done">
            {statusText}
          </span>
        </div>
      </div>
    </article>
  );
}
