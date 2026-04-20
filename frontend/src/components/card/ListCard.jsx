import "./style.css";
import basic_plant from "./../../assets/basic_plant.png";

const ListCard = ({
  name,
  xp,
  level,
  image,
  plant_name,
  rarity,
  onClick,
}) => {
  const maxXp = 560;
  const progress = Math.min((xp / maxXp) * 100, 100);

  const getRarityClass = (rarity) => {
    switch (rarity) {
      case "Обычное":
        return "common";
      case "Редкое":
        return "rare";
      case "Эпическое":
        return "epic";
      case "Легендарное":
        return "legendary";
      default:
        return "common";
    }
  };

  const rarityClass = getRarityClass(rarity);

  return (
    <article
      className={`topic-card topic-card--${rarityClass}`}
      onClick={onClick}
    >
      <div className="topic-card__head">
        <div className="topic-card__chips">
          <span className="topic-card__chip topic-card__chip--tree">
            {plant_name}
          </span>

          <span
            className={`topic-card__chip topic-card__chip--rarity topic-card__chip--rarity-${rarityClass}`}
          >
            {rarity}
          </span>
        </div>

        <div className="topic-card__badges">
          <div
            className="topic-card__badge topic-card__badge--success"
            aria-label="Тема завершена на сегодня"
          >
            ✓
          </div>

          <div
            className="topic-card__badge topic-card__badge--time"
            aria-label="Время до повтора"
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <circle cx="12" cy="12" r="8"></circle>
              <path d="M12 8v4l3 2"></path>
            </svg>
            <span className="topic-card__time">17ч</span>
          </div>
        </div>
      </div>

      <div className="topic-card__image-wrap">
        <img src={image || basic_plant} alt={name} className="topic-card__image" />
      </div>

      <div className="topic-card__bottom">
        <div className="topic-card__bottom-top">
          <div className="topic-card__level">
            <span className="topic-card__level-number">{level}</span>
            <span className="topic-card__level-text">LVL</span>
          </div>

          <div className="topic-card__divider"></div>

          <h2 className="topic-card__name">{name}</h2>
        </div>

        <div className="topic-card__progress">
          <div
            className="topic-card__progress-fill"
            style={{ width: `${progress}%` }}
          ></div>
          <span className="topic-card__progress-text">
            {xp} / {maxXp} XP
          </span>
        </div>
      </div>
    </article>
  );
};

export default ListCard;