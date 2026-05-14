import React, { useEffect } from "react";
import "./style.css";

import PlantProgressAchievementCard from "../../components/achievement_cards/plantProgressAchievementCard/PlantProgressAchievementCard";
import XpProgressAchievementCard from "../../components/achievement_cards/xpProgressAchievementCard/XpProgressAchievementCard";
import PlantCompletedAchievementCard from "../../components/achievement_cards/plantCompletedAchievementCard/PlantCompletedAchievementCard";
import XpCompletedAchievementCard from "../../components/achievement_cards/xpCompletedAchievementCard/XpCompletedAchievementCard";
import Header from "../../components/header/Header.jsx";
import {
  getAchievementsProgress,
  getLevelRewardsProgress,
} from "../../api/auth.js";
import { useState } from "react";

const ICONS = {
  ready: "/card-icons/ready.svg",
  achieve: "/card-icons/achieve.svg",
};

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

const getRewards = (achieve) => {
  if (!Array.isArray(achieve?.rewards)) {
    return [];
  }

  return achieve.rewards;
};

const getXpReward = (achieve) =>
  getRewards(achieve).find((reward) => reward.type === "xp");

const getPlantReward = (achieve) =>
  getRewards(achieve).find((reward) => reward.type === "plant");

const isPlantAchievement = (achieve) => Boolean(getPlantReward(achieve));

const isXpAchievement = (achieve) =>
  !isPlantAchievement(achieve) && Boolean(getXpReward(achieve));

const getRarityName = (rarity) => RARITY_META[rarity]?.label ?? "Обычное";

const getLevelRewardTitle = (reward) =>
  `${reward?.level ?? "?"} уровень аккаунта`;

export default function Achieve() {
  const [completedAchievements, setCompletedAchievements] = useState([]);
  const [progressAchievements, setProgressAchievements] = useState([]);
  const [levelRewards, setLevelRewards] = useState([]);
  const [achieveFilter, setAchieveFilter] = useState("progress");
  const [message, setMessage] = useState("Загрузка...");

  useEffect(() => {
    loadAchieve();

    const handleFocus = () => loadAchieve();
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        loadAchieve();
      }
    };

    window.addEventListener("focus", handleFocus);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      window.removeEventListener("focus", handleFocus);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  const loadAchieve = async () => {
    try {
      const [achievementsData, levelRewardsData] = await Promise.all([
        getAchievementsProgress(),
        getLevelRewardsProgress(),
      ]);

      const achievements = Array.isArray(achievementsData)
        ? achievementsData
        : [];
      const accountLevelRewards = Array.isArray(levelRewardsData)
        ? levelRewardsData
        : [];

      setCompletedAchievements(achievements.filter((item) => item.is_unlocked));

      setProgressAchievements(achievements.filter((item) => !item.is_unlocked));
      setLevelRewards(accountLevelRewards);
      setMessage("");
    } catch (error) {
      setMessage(error.message);
    }
  };

  const unlockedLevelRewardsCount = levelRewards.filter(
    (reward) => reward.is_unlocked,
  ).length;
  const completedItemsCount = completedAchievements.length + unlockedLevelRewardsCount;
  const totalItemsCount =
    completedAchievements.length + progressAchievements.length + levelRewards.length;

  return (
    <>
      <Header />
      <main className="achievements-page">
        <section className="achievements-hero">
          <div className="achievements-hero__left">
            <h1 className="achievements-title">Достижения</h1>

            <div className="achievements-tabs" aria-label="Фильтр достижений">
              <button
                type="button"
                className={`achievements-tab ${achieveFilter === "progress" ? "achievements-tab--active" : ""}`}
                onClick={() => setAchieveFilter("progress")}
              >
                Все
              </button>
              <button
                type="button"
                className={`achievements-tab ${achieveFilter === "completed" ? "achievements-tab--active" : ""}`}
                onClick={() => setAchieveFilter("completed")}
              >
                Полученные
              </button>
            </div>
          </div>

          <div
            className="achievements-counter"
            aria-label="Количество полученных достижений"
          >
            <img className="achieve-icon" src={ICONS.achieve} />
            <span>Получено</span>
            <strong>
              {completedItemsCount}/{totalItemsCount}
            </strong>
          </div>
        </section>

        {achieveFilter === "progress" && (
          <>
            <section
              className="achievements-section"
              aria-labelledby="progress-xp-title"
            >
              <div className="achievements-section__head">
                <div className="achieve-flex">
                  <h2
                    id="progress-xp-title"
                    className="achievements-section__title"
                  >
                    <span className="achievements-section__accent achievements-section__accent--xp">
                      Активность{" "}
                    </span>
                  </h2>

                  <p className="achievements-section__subtitle">
                    Достижения, за которые начисляется опыт
                  </p>
                </div>
              </div>

              <div className="achievements-grid achievements-grid--xp">
                {progressAchievements
                  .filter(
                    (achieve) =>
                      Array.isArray(achieve.rewards) &&
                      achieve.rewards.length > 0 &&
                      achieve.rewards.every((reward) => reward.type === "xp"),
                  )
                  .map((achieve) => (
                    <XpProgressAchievementCard
                      key={achieve.id}
                      title={achieve.title}
                      description={achieve.description}
                      current_value={achieve.current_value}
                      condition_value={achieve.condition_value}
                      xpReward={
                        achieve.rewards?.find((reward) => reward.type === "xp")
                          ?.value ?? 0
                      }
                    />
                  ))}
              </div>
            </section>

            <section
              className="achievements-section"
              aria-labelledby="progress-plants-title"
            >
              <div className="achievements-section__head">
                <div className="achieve-flex">
                  <h2
                    id="progress-plants-title"
                    className="achievements-section__title"
                  >
                    <span className="achievements-section__accent achievements-section__accent--plant">
                      Растения
                    </span>
                  </h2>

                  <p className="achievements-section__subtitle">
                    Достижения, которые открывают новые растения
                  </p>
                </div>
              </div>

              <div className="achievements-grid achievements-grid--plants">
                {progressAchievements
                  .filter(
                    (achieve) =>
                      Array.isArray(achieve.rewards) &&
                      achieve.rewards.some((reward) => reward.type === "plant"),
                  )
                  .map((achieve) => {
                    const plantReward = achieve.rewards?.find(
                      (reward) => reward.type === "plant",
                    );
                    const xpReward = getXpReward(achieve);

                    return (
                      <PlantProgressAchievementCard
                        key={achieve.id}
                        title={achieve.title}
                        description={achieve.description}
                        img={plantReward?.plant?.image_url}
                        rarity={plantReward?.plant?.rarity}
                        name={plantReward?.plant?.name}
                        current_value={achieve.current_value}
                        condition_value={achieve.condition_value}
                        rarity_name={
                          RARITY_META[plantReward?.plant?.rarity]?.label
                        }
                        xpReward={xpReward?.value ?? 0}
                      />
                    );
                  })}
              </div>
            </section>

            <section
              className="achievements-section achievements-section--level-rewards"
              aria-labelledby="progress-level-plants-title"
            >
              <div className="achievements-section__head">
                <div className="achieve-flex">
                  <h2
                    id="progress-level-plants-title"
                    className="achievements-section__title"
                  >
                    <span className="achievements-section__accent achievements-section__accent--level-plant">
                      Растения за уровень аккаунта
                    </span>
                  </h2>

                  <p className="achievements-section__subtitle">
                    Растения, которые открываются за повышение уровня аккаунта
                  </p>
                </div>
              </div>

              <div className="achievements-grid achievements-grid--level-plants">
                {levelRewards
                  .filter((reward) => !reward.is_unlocked)
                  .map((reward) => {
                    const plant = reward.plant;

                    return (
                      <PlantProgressAchievementCard
                        key={`level-reward-${reward.id}`}
                        title={getLevelRewardTitle(reward)}
                        img={plant?.image_url}
                        rarity={plant?.rarity}
                        name={plant?.name}
                        rarity_name={getRarityName(plant?.rarity)}
                        hideProgress
                        unlockLabel="Откроется растение"
                        statusText="В процессе"
                        hideDescription
                      />
                    );
                  })}
              </div>
            </section>
          </>
        )}

        {achieveFilter === "completed" && (
          <>
            <section
              className="achievements-section"
              aria-labelledby="completed-xp-title"
            >
              <div className="achievements-section__head">
                <div className="achieve-flex">
                  <h2
                    id="completed-xp-title"
                    className="achievements-section__title"
                  >
                    <span className="achievements-section__accent achievements-section__accent--xp">
                      Активность{" "}
                    </span>
                  </h2>

                  <p className="achievements-section__subtitle">
                    Достижения, за которые начисляется опыт
                  </p>
                </div>
              </div>

              <div className="achievements-grid achievements-grid--xp achievements-grid--completed-xp">
                {completedAchievements
                  .filter(isXpAchievement)
                  .map((achieve) => {
                    const xpReward = getXpReward(achieve);

                    return (
                      <XpCompletedAchievementCard
                        key={achieve.id}
                        title={achieve.title}
                        description={achieve.description}
                        xpReward={xpReward?.value ?? 0}
                      />
                    );
                  })}
              </div>
            </section>

            <section
              className="achievements-section"
              aria-labelledby="completed-plants-title"
            >
              <div className="achievements-section__head">
                <div className="achieve-flex">
                  <h2
                    id="completed-plants-title"
                    className="achievements-section__title"
                  >
                    <span className="achievements-section__accent achievements-section__accent--plant">
                      Растения
                    </span>
                  </h2>

                  <p className="achievements-section__subtitle">
                    Достижения, которые открывают новые растения
                  </p>
                </div>
              </div>

              <div className="achievements-grid achievements-grid--plants achievements-grid--completed-plants">
                {completedAchievements
                  .filter(isPlantAchievement)
                  .map((achieve) => {
                    const plantReward = getPlantReward(achieve);
                    const xpReward = getXpReward(achieve);
                    const plant = plantReward?.plant;

                    return (
                      <PlantCompletedAchievementCard
                        key={achieve.id}
                        title={achieve.title}
                        description={achieve.description}
                        img={plant?.image_url}
                        rarity={plant?.rarity}
                        name={plant?.name}
                        rarity_name={getRarityName(plant?.rarity)}
                        xpReward={xpReward?.value ?? 0}
                      />
                    );
                  })}
              </div>
            </section>

            <section
              className="achievements-section achievements-section--level-rewards"
              aria-labelledby="completed-level-plants-title"
            >
              <div className="achievements-section__head">
                <div className="achieve-flex">
                  <h2
                    id="completed-level-plants-title"
                    className="achievements-section__title"
                  >
                    <span className="achievements-section__accent achievements-section__accent--level-plant">
                      Растения за уровень аккаунта
                    </span>
                  </h2>

                  <p className="achievements-section__subtitle">
                    Уже открытые растения за уровни аккаунта
                  </p>
                </div>
              </div>

              <div className="achievements-grid achievements-grid--level-plants achievements-grid--completed-level-plants">
                {levelRewards
                  .filter((reward) => reward.is_unlocked)
                  .map((reward) => {
                    const plant = reward.plant;

                    return (
                      <PlantCompletedAchievementCard
                        key={`completed-level-reward-${reward.id}`}
                        title={getLevelRewardTitle(reward)}
                        img={plant?.image_url}
                        rarity={plant?.rarity}
                        name={plant?.name}
                        rarity_name={getRarityName(plant?.rarity)}
                        unlockLabel="Открыто за уровень"
                        hideDescription
                      />
                    );
                  })}
              </div>
            </section>
          </>
        )}
      </main>
    </>
  );
}
