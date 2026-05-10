import "./style.css";

export default function PlantCompletedAchievementCard() {
  return (
    <article className="plant-completed-achievement-card plant-completed-achievement-card--rare plant-completed-achievement-card--completed">
      <div className="plant-completed-achievement-card__main">
        <div className="plant-completed-achievement-card__picture">
          <img
            className="plant-completed-achievement-card__image"
            src="/baobab/baobab_big.png"
            alt="Баобаб"
          />
        </div>

        <div className="plant-completed-achievement-card__content">
          <h3 className="plant-completed-achievement-card__title">Первое открытие</h3>
          <p className="plant-completed-achievement-card__description">
            Получи первое растение за выполненное достижение
          </p>

          <div className="plant-completed-achievement-card__tags">
            <span className="plant-completed-achievement-card__tag plant-completed-achievement-card__tag--plant">
              Растение
            </span>
            <span className="plant-completed-achievement-card__tag plant-completed-achievement-card__tag--rare">
              Редкое
            </span>
          </div>
        </div>
      </div>

      <div className="plant-completed-achievement-card__footer plant-completed-achievement-card__footer--completed">
        <div className="plant-completed-achievement-card__unlock">
          <span>
            Открыто растение
            <strong>Баобаб</strong>
          </span>
        </div>
        <span className="plant-completed-achievement-card__status plant-completed-achievement-card__status--done">
          Получено
        </span>
      </div>
    </article>
  );
}
