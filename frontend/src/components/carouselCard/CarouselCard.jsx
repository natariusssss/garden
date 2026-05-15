import "./style.css";

const CarouselCard = ({
  selected,
  id,
  name,
  rarity,
  rarityClass,
  img_small,
  onClick,
  locked = false,
  unlockText = "",
}) => {
  return (
    <article
      onClick={onClick}
      key={id}
      className={`topic-modal__plant-card${
        selected ? " topic-modal__plant-card--selected" : ""
      }${locked ? " topic-modal__plant-card--locked" : ""}`}
      aria-disabled={locked}
    >
      <div className="topic-modal__plant-visual">
        <div className="topic-modal__plant-glow"></div>

        {img_small ? (
          <img
            src={img_small}
            alt={name}
            className="topic-modal__plant-image"
          />
        ) : (
          <div className="topic-modal__plant-image-placeholder"></div>
        )}
      </div>
      <h4 className="topic-modal__plant-name">{name}</h4>

      <span
        className={`topic-modal__badge topic-modal__badge--small topic-modal__badge--${rarityClass}-small`}
      >
        {rarity}
      </span>

      {locked && (
        <div className="topic-modal__plant-lock">
          <span className="topic-modal__plant-lock-icon" aria-hidden="true">
            <img src="/card-icons/lock.svg" alt="" />
          </span>
          <small>{unlockText || "заблокировано"}</small>
        </div>
      )}
    </article>
  );
};

export default CarouselCard;
