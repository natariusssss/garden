import React, { useEffect } from "react";
import "./style.css";

import PlantProgressAchievementCard from "../../components/achievement_cards/plantProgressAchievementCard/PlantProgressAchievementCard";
import XpProgressAchievementCard from "../../components/achievement_cards/xpProgressAchievementCard/XpProgressAchievementCard";
import PlantCompletedAchievementCard from "../../components/achievement_cards/plantCompletedAchievementCard/PlantCompletedAchievementCard";
import XpCompletedAchievementCard from "../../components/achievement_cards/xpCompletedAchievementCard/XpCompletedAchievementCard";
import Header from "../../components/header/Header.jsx";
import { getAchievementsProgress } from "../../api/auth.js";
import { useState } from "react";

const ICONS = {
  settings: "/card-icons/settings.svg",
  play: "/card-icons/play.svg",
  reset: "/card-icons/reset.svg",
  sendDark: "/card-icons/send-dark.svg",
  sendGreen: "/card-icons/send-green.svg",
  ai: "/card-icons/ai.svg",
  tasks: "/card-icons/tasks.svg",
  check: "/card-icons/check.svg",
  leaf: "/card-icons/leaf.svg",
  star: "/card-icons/star.svg",
  stageSeedling: "/card-icons/stage-seedling.svg",
  stageYoung: "/card-icons/stage-young.svg",
  stageAdult: "/card-icons/stage-adult.svg",
  stageArrow: "/card-icons/stage-arrow.svg",
  stageArrowSecond: "/card-icons/stage-arrow-2.svg",
};

export default function Achieve() {
  const [completedAchievements, setCompletedAchievements] = useState([]);
  const [progressAchievements, setProgressAchievements] = useState([]);
  const [message, setMessage] = useState("Загрузка...");

  useEffect(() => {
    loadAchieve();
  }, []);

  const loadAchieve = async () => {
    try {
      const data = await getAchievementsProgress();
      const achievements = Array.isArray(data) ? data : [];

      setCompletedAchievements(achievements.filter((item) => item.is_unlocked));

      setProgressAchievements(achievements.filter((item) => !item.is_unlocked));
      setMessage("");
    } catch (error) {
      setMessage(error.message);
    }
  };

  const hasXpReward = (achieve) => {
    return achieve.rewards?.some((reward) => reward.type === "xp");
  };

  const getXpReward = (achieve) => {
    return achieve.rewards?.find((reward) => reward.type === "xp")?.value ?? 0;
  };

  const hasPlantReward = (achieve) => {
    return achieve.rewards?.some((reward) => reward.type === "plant");
  };

  const getPlantReward = (achieve) => {
    return achieve.rewards?.find((reward) => reward.type === "plant");
  };
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
                className="achievements-tab achievements-tab--active"
              >
                В процессе
              </button>
              <button type="button" className="achievements-tab">
                Полученные
              </button>
            </div>
          </div>

          <div
            className="achievements-counter"
            aria-label="Количество полученных достижений"
          >
            <span className="achievements-counter__icon" aria-hidden="true">
              ★
            </span>
            <span>Получено</span>
            <strong>4/12</strong>
          </div>
        </section>

        <section
          className="achievements-section"
          aria-labelledby="progress-xp-title"
        >
          <div className="achievements-section__head">
            <div>
              <h2
                id="progress-xp-title"
                className="achievements-section__title"
              >
                <span className="achievements-section__accent achievements-section__accent--xp">
                  XP{" "}
                </span>
                {" "}достижения
              </h2>
              <p className="achievements-section__subtitle">
                Достижения, за которые начисляется опыт
              </p>
            </div>
          </div>

          <div className="achievements-grid achievements-grid--xp">
            {[...progressAchievements, ...completedAchievements]
              .filter((achieve) => hasXpReward(achieve))
              .map((achieve) => (
                <XpProgressAchievementCard
                  key={achieve.id}
                  title={achieve.title}
                  description={achieve.description}
                />
              ))}
          </div>
        </section>
        {/* 
        <section
          className="achievements-section"
          aria-labelledby="progress-plants-title"
        >
          <div className="achievements-section__head">
            <div>
              <h2
                id="progress-plants-title"
                className="achievements-section__title"
              >
                Достижения:{" "}
                <span className="achievements-section__accent achievements-section__accent--plant">
                  растения
                </span>
              </h2>
              <p className="achievements-section__subtitle">
                Достижения, которые открывают новые растения
              </p>
            </div>
          </div>

          <div className="achievements-grid achievements-grid--plants">
            <PlantProgressAchievementCard />
            <PlantProgressAchievementCard />
            <PlantProgressAchievementCard />
          </div>
        </section> */}
        {/* 
        <section
          className="achievements-section"
          aria-labelledby="completed-xp-title"
        >
          <div className="achievements-section__head">
            <div>
              <h2
                id="completed-xp-title"
                className="achievements-section__title"
              >
                Полученные:{" "}
                <span className="achievements-section__accent achievements-section__accent--xp">
                  XP
                </span>
              </h2>
              <p className="achievements-section__subtitle">
                Уже полученные награды опытом
              </p>
            </div>
          </div>

          <div className="achievements-grid achievements-grid--xp">
            <XpCompletedAchievementCard />
            <XpCompletedAchievementCard />
            <XpCompletedAchievementCard />
            <XpCompletedAchievementCard />
          </div>
        </section>

        <section
          className="achievements-section"
          aria-labelledby="completed-plants-title"
        >
          <div className="achievements-section__head">
            <div>
              <h2
                id="completed-plants-title"
                className="achievements-section__title"
              >
                Полученные:{" "}
                <span className="achievements-section__accent achievements-section__accent--plant">
                  растения
                </span>
              </h2>
              <p className="achievements-section__subtitle">
                Уже открытые растения
              </p>
            </div>
          </div>

          <div className="achievements-grid achievements-grid--plants">
            <PlantCompletedAchievementCard />
            <PlantCompletedAchievementCard />
            <PlantCompletedAchievementCard />
          </div>
        </section> */}
      </main>
    </>
  );
}
