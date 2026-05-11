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
  current_value,
  condition_value,
  rarity_name,
  xpReward = 0,
}) {
  const width_per = (current_value / condition_value) * 100;

  return (
    <article
      className={`plant-progress-achievement-card plant-progress-achievement-card--${rarity}`}
    >
      <span className="plant-progress-achievement-card__count">
        {current_value} / {condition_value}
      </span>

      <div className="plant-progress-achievement-card__main">
        <div className="plant-progress-achievement-card__picture">
          <img
            className="plant-progress-achievement-card__image"
            src={img}
            alt="Сакура"
          />
        </div>

        <div className="plant-progress-achievement-card__content">
          <h3 className="plant-progress-achievement-card__title">{title}</h3>
          <p className="plant-progress-achievement-card__description">
            {description}
          </p>

          <div className="plant-progress-achievement-card__tags">
            <span className="plant-progress-achievement-card__tag plant-progress-achievement-card__tag--plant">
              Растение
            </span>
            <span
              className={`plant-progress-achievement-card__tag plant-progress-achievement-card__tag--${rarity}`}
            >
              {rarity_name}
            </span>
          </div>
        </div>
      </div>

      <div className="plant-progress-achievement-card__progress plant-progress-achievement-card__progress--plant">
        <span style={{ width: `${width_per}%` }} />
      </div>

      <div className="plant-progress-achievement-card__footer">
        <div className="plant-progress-achievement-card__unlock">
          <span>
            Открывает растение
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
            В процессе
          </span>
        </div>
      </div>
    </article>
  );
}
