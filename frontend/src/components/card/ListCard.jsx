import "./style.css";
import img from "./tree.png";

const ListCard = ({ name, xp, level, onClick }) => {
  const maxXp = 560;
  const progress = Math.min((xp / maxXp) * 100, 100);

  return (
    <article className="topic-card" onClick={onClick}>
      <div className="topic-card__head">
        <div className="topic-card__chips">
          <span className="topic-card__chip topic-card__chip--tree">Дерево</span>
          <span className="topic-card__chip topic-card__chip--rarity">Обычная</span>
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
        <img src={img} alt={name} className="topic-card__image" />
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
          <span className="topic-card__progress-text">{xp} / {maxXp} XP</span>
        </div>
      </div>
    </article>
  );
};

export default ListCard;