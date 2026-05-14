import { useEffect, useState } from "react";
import "./style.css";

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

const getRarityClass = (rarity) => {
  const value = String(rarity).toLowerCase();

  if (value.includes("легендар")) return "legendary";
  if (value.includes("legendary")) return "legendary";
  if (value.includes("эпичес")) return "epic";
  if (value.includes("epic")) return "epic";
  if (value.includes("редк")) return "rare";
  if (value.includes("rare")) return "rare";

  return "common";
};

const AchievementPlantReward = ({ reward }) => {
  const rarityClass = getRarityClass(reward.plant.rarity);
  const rarityMeta = RARITY_META[rarityClass];

  return (
    <div
      className={`achievement-toast__reward-card achievement-toast__reward-card--plant achievement-toast__reward-card--${rarityClass}`}
    >
      <div className="achievement-toast__plant-picture" aria-hidden="true">
        <img src={reward.plant.image_url} alt="" />
      </div>

      <div className="achievement-toast__reward-content">
        <span className="achievement-toast__reward-label">Открыто растение</span>
        <strong className="achievement-toast__reward-value">
          {reward.plant.name}
        </strong>
        <span
          className={`achievement-toast__rarity achievement-toast__rarity--${rarityClass}`}
        >
          {rarityMeta.label}
        </span>
      </div>
    </div>
  );
};

const AchievementXpReward = ({ reward }) => {
  return (
    <div className="achievement-toast__reward-card achievement-toast__reward-card--xp">
      <div className="achievement-toast__xp-icon" aria-hidden="true">
        XP
      </div>

      <div className="achievement-toast__reward-content">
        <span className="achievement-toast__reward-label">Начислено опыта</span>
        <strong className="achievement-toast__reward-value">
          +{reward.value} XP
        </strong>
      </div>
    </div>
  );
};

const AchievementNotification = ({ achievement, onClose }) => {
  const [isClosing, setIsClosing] = useState(false);

  const plantReward = achievement.rewards.find(
    (reward) => reward.type === "plant",
  );
  const xpReward = achievement.rewards.find((reward) => reward.type === "xp");
  const hasPlantReward = Boolean(plantReward);
  const toastType = hasPlantReward
    ? getRarityClass(plantReward.plant.rarity)
    : "xp";

  const closeWithAnimation = () => {
    setIsClosing(true);

    setTimeout(() => {
      onClose();
    }, 420);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      closeWithAnimation();
    }, 10000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <article
      className={`achievement-toast achievement-toast--${toastType} ${hasPlantReward ? "achievement-toast--has-plant" : ""} ${isClosing ? "achievement-toast--closing" : ""}`}
      aria-label="Получено достижение"
    >
      <button
        className="achievement-toast__close"
        type="button"
        onClick={closeWithAnimation}
        aria-label="Закрыть уведомление"
      >
        ×
      </button>

      <div className="achievement-toast__header">
        <div className="achievement-toast__icon" aria-hidden="true">
          <img src="/card-icons/achieve.svg" alt="" />
        </div>

        <div className="achievement-toast__heading">
          <span className="achievement-toast__label">Достижение получено</span>

          <div className="achievement-toast__text">
            <h3 className="achievement-toast__title">{achievement.title}</h3>
            <p className="achievement-toast__description">
              {achievement.description}
            </p>
          </div>
        </div>
      </div>

      <div
        className={`achievement-toast__rewards ${hasPlantReward ? "achievement-toast__rewards--has-plant" : "achievement-toast__rewards--single"}`}
        aria-label="Награда за достижение"
      >
        {plantReward && <AchievementPlantReward reward={plantReward} />}
        {xpReward && <AchievementXpReward reward={xpReward} />}
      </div>
    </article>
  );
};

export default AchievementNotification;
