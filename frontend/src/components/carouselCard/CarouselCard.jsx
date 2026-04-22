import "./style.css";

const carouselCard = ({
  selected,
  id,
  name,
  rarity,
  rarityClass,
  img_small,
  onClick,
}) => {
  return (
    <article
      onClick={onClick}
      key={id}
      className={`topic-modal__plant-card${
        selected ? " topic-modal__plant-card--selected" : ""
      }`}
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
        className={`topic-modal__badge topic-modal__badge--small ${
          rarityClass === "legendary"
            ? "topic-modal__badge--legendary-small"
            : rarityClass === "rare"
              ? "topic-modal__badge--rare"
              : "topic-modal__badge--common"
        }`}
      >
        {rarity}
      </span>
    </article>
  );
};

export default carouselCard;
