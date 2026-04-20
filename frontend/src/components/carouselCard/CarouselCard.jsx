import "./style.css"

const carouselCard = ({selected,id,name,rarity, rarityClass, onClick}) => {
  return (
    <article
    onClick={onClick}
      key={id}
      className={`topic-modal__plant-card${
        selected ? " topic-modal__plant-card--selected" : ""
      }`}
    >
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
