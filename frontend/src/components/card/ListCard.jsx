import { useNavigate } from "react-router-dom";
import "./style.css";
import img from "./tree.png"

const ListCard = ({ name, onClick }) => {
  return (
    <article className="topic-card" onClick={onClick}>
      <div className="topic-card__top">
        <p className="topic-card__xp">
          432 / 560 <span>XP</span>
        </p>

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
          </div>

          <span className="topic-card__time">17ч</span>
        </div>
      </div>

      <div className="topic-card__image-wrap">
        <img src={img} alt={name} className="topic-card__image" />
      </div>

      <div className="topic-card__bottom">
        <div className="topic-card__level">
          <span className="topic-card__level-number">28</span>
          <span className="topic-card__level-text">LVL</span>
        </div>

        <h2 className="topic-card__name">{name}</h2>
      </div>
    </article>
  );
};

export default ListCard;
