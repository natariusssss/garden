import "./style.css";

const RARITY_META = {
  common: {
    label: "Обычное",
  },
  rare: {
    label: "Редкое",
  },
  epic: {
    label: "Эпическое",
  },
  legendary: {
    label: "Легендарная",
  },
};

export default function PlantProgressAchievementCard({
  title,
  description,
  img,
  rarity,
  name,
  current_value = 0,
  condition_value = 1,
  rarity_name,
  xpReward = 0,
  hideProgress = false,
  hideDescription = false,
  unlockLabel = "Открывает растение",
  statusText = "В процессе",
}) {
  const currentRarity = rarity || "common";
  const currentRarityName = rarity_name || RARITY_META[currentRarity]?.label || "Обычное";
  const safeCondition = condition_value || 1;
  const safeCurrent = current_value || 0;
  const width_per = Math.min(100, (safeCurrent / safeCondition) * 100);

  return (
    <article
      className={`plant-progress-achievement-card plant-progress-achievement-card--${currentRarity} ${hideProgress ? "plant-progress-achievement-card--without-progress" : ""} ${hideDescription ? "plant-progress-achievement-card--without-description" : ""}`}
    >
      {!hideProgress && (
        <span className="plant-progress-achievement-card__count">
          {safeCurrent} / {condition_value}
        </span>
      )}

      <div className="plant-progress-achievement-card__main">
        <div className="plant-progress-achievement-card__picture">
          <img
            className="plant-progress-achievement-card__image"
            src={img}
            alt={name || "Растение"}
          />
        </div>

        <div className="plant-progress-achievement-card__content">
          <h3 className="plant-progress-achievement-card__title">{title}</h3>
          {!hideDescription && description && (
            <p className="plant-progress-achievement-card__description">
              {description}
            </p>
          )}

          <div className="plant-progress-achievement-card__tags">
            <span className="plant-progress-achievement-card__tag plant-progress-achievement-card__tag--plant">
              Растение
            </span>
            <span
              className={`plant-progress-achievement-card__tag plant-progress-achievement-card__tag--${currentRarity}`}
            >
              {currentRarityName}
            </span>
          </div>
        </div>
      </div>

      {!hideProgress && (
        <div className="plant-progress-achievement-card__progress plant-progress-achievement-card__progress--plant">
          <span style={{ width: `${width_per}%` }} />
        </div>
      )}

      <div className="plant-progress-achievement-card__footer">
        <div className="plant-progress-achievement-card__unlock">
          <span>
            {unlockLabel}
            <strong>{name}</strong>
          </span>
        </div>

        <div className="plant-progress-achievement-card__footer-right">
          {xpReward > 0 && (
            <span className="plant-progress-achievement-card__xp-reward">
              +{xpReward} XP
            </span>
          )}
          <span className="plant-progress-achievement-card__status">
            {statusText}
          </span>
        </div>
      </div>
    </article>
  );
}
