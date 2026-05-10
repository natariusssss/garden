import "./style.css";

export default function PlantProgressAchievementCard() {
  return (
    <article className="plant-progress-achievement-card plant-progress-achievement-card--legendary">
      <span className="plant-progress-achievement-card__count">5/8</span>

      <div className="plant-progress-achievement-card__main">
        <div className="plant-progress-achievement-card__picture">
          <img
            className="plant-progress-achievement-card__image"
            src="/sakura/sakura_big.png"
            alt="Сакура"
          />
        </div>

        <div className="plant-progress-achievement-card__content">
          <h3 className="plant-progress-achievement-card__title">Цветущий сад</h3>
          <p className="plant-progress-achievement-card__description">
            Дойди до высокого уровня темы и открой редкую награду
          </p>

          <div className="plant-progress-achievement-card__tags">
            <span className="plant-progress-achievement-card__tag plant-progress-achievement-card__tag--plant">
              Растение
            </span>
            <span className="plant-progress-achievement-card__tag plant-progress-achievement-card__tag--legendary">
              Легендарное
            </span>
          </div>
        </div>
      </div>

      <div className="plant-progress-achievement-card__progress plant-progress-achievement-card__progress--plant">
        <span style={{ width: "62%" }} />
      </div>

      <div className="plant-progress-achievement-card__footer">
        <div className="plant-progress-achievement-card__unlock">
          <span>
            Открывает растение
            <strong>Сакура</strong>
          </span>
        </div>
        <span className="plant-progress-achievement-card__status">В процессе</span>
      </div>
    </article>
  );
}
