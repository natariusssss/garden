import "./style.css";
import basicPlant from "./../../assets/basic_plant.png";

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

const EPIC_PARTICLES = [
  "star-1",
  "star-2",
  "star-3",
  "star-4",
  "star-5",
  "star-6",
  "star-7",
  "star-8",
  "star-9",
  "spark-1",
  "spark-2",
  "spark-3",
  "spark-4",
  "spark-5",
  "dot-1",
  "dot-2",
  "dot-3",
  "dot-4",
];

const LEGENDARY_STARS = [
  "star-1",
  "star-2",
  "star-3",
  "star-4",
  "star-5",
  "star-6",
  "star-7",
  "star-8",
  "dot-1",
  "dot-2",
  "dot-3",
  "dot-4",
  "dot-5",
  "dot-6",
];



const getRarityClass = (rarity = "") => {
  const value = String(rarity).toLowerCase();

  if (value.includes("легендар")) return "legendary";
  if (value.includes("эпичес")) return "epic";
  if (value.includes("редк")) return "rare";
  return "common";
};

const TimePassed = (last_reviewed) => {
  if (!last_reviewed) return "—";
  const lastDate = new Date(last_reviewed);
  const now = new Date();
  const diffMs = now - lastDate;
  if (diffMs < 0) return "0";
  const diffMinutes = Math.floor(diffMs / 1000 / 60);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);
  const diffMonths = Math.floor(diffDays / 30);
  const diffYears = Math.floor(diffDays / 365);
  if (diffHours < 48) return diffHours;
  if (diffHours < 48 && diffDays <= 31) return diffDays;
  if (diffHours < 48 && diffDays <= 31 && diffMonths <= 12) return diffMonths;
  return diffYears;
};

const ListCard = ({
  name,
  level = 0,
  image,
  plant_name,
  rarity,
  onClick,
  xp,
  current_progress_xp,
  current_max_xp,
  progress_width,
  last_reviewed,
}) => {
  const rarityClass = getRarityClass(rarity);
  const rarityMeta = RARITY_META[rarityClass];

  return (
    <article
      className={`topic-card topic-card--${rarityClass}`}
      onClick={onClick}
    >
      <div className="topic-card__head">
        <div className="topic-card__chips">
          <span className="topic-card__chip topic-card__chip--tree">
            {plant_name || "Дерево"}
          </span>

          <span className="topic-card__chip topic-card__chip--rarity">
            {rarityMeta.label}
          </span>
        </div>

        <div className="topic-card__badges">
          <div
            className="topic-card__badge topic-card__badge--time"
            aria-label="Время до повтора"
          >
            <img
              src="/card-icons/topic-clock.svg"
              alt=""
              className="topic-card__clock"
              aria-hidden="true"
            />
            <span className="topic-card__time">
              {TimePassed(last_reviewed)}ч
            </span>
          </div>

          <div
            className="topic-card__badge topic-card__badge--success"
            aria-label="Тема завершена на сегодня"
          >
            <img
              src="/card-icons/topic-check.svg"
              alt=""
              className="topic-card__check"
              aria-hidden="true"
            />
          </div>
        </div>
      </div>

      {rarityClass === "epic" && (
        <div className="topic-card__particles" aria-hidden="true">
          {EPIC_PARTICLES.map((particle) => {
            const particleType = particle.startsWith("dot") ? "dot" : "star";

            return (
              <span
                key={particle}
                className={`topic-card__particle topic-card__particle--${particleType} topic-card__particle--${particle}`}
              />
            );
          })}
        </div>
      )}

      {rarityClass === "legendary" && (
        <div className="topic-card__legendary-effects" aria-hidden="true">
          <span className="topic-card__legendary-aura" />
          <span className="topic-card__legendary-orbit topic-card__legendary-orbit--one" />
          <span className="topic-card__legendary-orbit topic-card__legendary-orbit--two" />
          <span className="topic-card__legendary-orbit topic-card__legendary-orbit--three" />

          {LEGENDARY_STARS.map((particle) => {
            const particleType = particle.startsWith("dot") ? "dot" : "star";

            return (
              <span
                key={particle}
                className={`topic-card__legendary-particle topic-card__legendary-particle--${particleType} topic-card__legendary-particle--${particle}`}
              />
            );
          })}

          <span className="topic-card__legendary-leaf topic-card__legendary-leaf--one" />
          <span className="topic-card__legendary-leaf topic-card__legendary-leaf--two" />
        </div>
      )}

      <div className="topic-card__image-wrap">
        <img
          src={image || basicPlant}
          alt={name}
          className="topic-card__image"
        />
      </div>

      <div className="topic-card__bottom">
        <div className="topic-card__level">
          <span className="topic-card__level-number">{level}</span>
          <span className="topic-card__level-text">LVL</span>
        </div>

        <div className="topic-card__divider" />

        <h2 className="topic-card__name">{name}</h2>

        <div className="topic-card__progress">
          <div
            className="topic-card__progress-fill"
            style={{ "--progress-width": progress_width || "0%" }}
          />
          <span className="topic-card__progress-text">
            {current_progress_xp} / {current_max_xp}
          </span>
        </div>
      </div>
    </article>
  );
};

export default ListCard;
