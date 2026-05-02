import "./style.css";
import basicPlant from "./../../assets/basic_plant.png";
import { useState } from "react";

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

const getRarityClass = (rarity = "") => {
  const value = String(rarity).toLowerCase();

  if (value.includes("легендар")) return "legendary";
  if (value.includes("эпичес")) return "epic";
  if (value.includes("редк")) return "rare";
  return "common";
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
            <span className="topic-card__time">17ч</span>
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
            style={{ "--progress-width":progress_width }}
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
