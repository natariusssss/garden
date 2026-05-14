import { createPortal } from "react-dom";
import Confetti from "../confetti/Confetti";
import "./style.css";

const ICONS = {
  stageArrow: "/card-icons/stage-arrow.svg",
};

const RARITY_LABELS = {
  common: "Обычное",
  rare: "Редкое",
  epic: "Эпическое",
  legendary: "Легендарное",
};

const getRarityClass = (rarity = "") => {
  const value = String(rarity).toLowerCase();

  if (value.includes("legendary") || value.includes("легендар")) {
    return "legendary";
  }

  if (value.includes("epic") || value.includes("эпичес")) {
    return "epic";
  }

  if (value.includes("rare") || value.includes("редк")) {
    return "rare";
  }

  return "common";
};

const getPreviousAccountLevel = (reward, currentLevel) => {
  const explicitPreviousLevel =
    reward?.old_level ??
    reward?.oldLevel ??
    reward?.previous_level ??
    reward?.previousLevel;

  const previousLevelNumber = Number(explicitPreviousLevel);

  if (Number.isFinite(previousLevelNumber) && previousLevelNumber > 0) {
    return previousLevelNumber;
  }

  return Math.max(currentLevel - 1, 1);
};

const renderPlantName = (name) => {
  const words = String(name || "Новое растение")
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  if (words.length <= 1) {
    return words[0] || "Новое растение";
  }

  return (
    <>
      {words[0]}
      <br />
      {words.slice(1).join(" ")}
    </>
  );
};

export default function ModalAccountLevelUp({ reward, onClose }) {
  const plant = reward?.plant;
  const currentAccountLevel = Number(reward?.level ?? reward?.account_level) || 1;
  const previousAccountLevel = getPreviousAccountLevel(
    reward,
    currentAccountLevel,
  );
  const rarityClass = getRarityClass(plant?.rarity);
  const rarityLabel = RARITY_LABELS[rarityClass] || plant?.rarity || "Обычное";
  const plantDescription = plant?.description || "Описание растения пока не добавлено";

  return createPortal(
    <div className="account-level-modal-overlay">
      <div className="account-level-modal-confetti">
        <Confetti />
      </div>

      <div className="account-level-modal">
        <h2 className="account-level-modal__title">Новый уровень аккаунта !</h2>

        <div className="account-level-modal__number">{currentAccountLevel}</div>
        <div className="account-level-modal__label">LVL</div>

        <div className="account-level-modal__change">
          <span>{previousAccountLevel}</span>
          <img
            className="account-level-modal__arrow"
            src={ICONS.stageArrow}
            alt=""
          />
          <span className="account-level-modal__green">
            {currentAccountLevel}
          </span>
        </div>

        <div className="account-level-modal__divider" />

        <p className="account-level-modal__text">
          Открыто новое растение для сада
        </p>

        {plant && (
          <div
            className={`account-level-modal__plant-card account-level-modal__plant-card--${rarityClass}`}
          >
            <div
              className={`account-level-modal__plant-glow account-level-modal__plant-glow--${rarityClass}`}
              aria-hidden="true"
            ></div>

            <img
              className="account-level-modal__plant-image"
              src={plant.image_url}
              alt={plant.name}
            />

            <div className="account-level-modal__plant-info">
              <span className="account-level-modal__plant-caption">
                Новое растение
              </span>

              <strong>{renderPlantName(plant.name)}</strong>

              <p className="account-level-modal__plant-description">
                {plantDescription}
              </p>

              <span
                className={`account-level-modal__rarity account-level-modal__rarity--${rarityClass}`}
              >
                {rarityLabel}
              </span>
            </div>
          </div>
        )}

        <button className="account-level-modal__button" onClick={onClose}>
          Продолжить
        </button>
      </div>
    </div>,
    document.getElementById("modalLevelUp"),
  );
}
