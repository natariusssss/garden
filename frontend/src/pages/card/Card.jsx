import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { addXpToTopic, deleteTopicById, getTopicById } from "../../api/auth";
import ModalAddTopic from "../../components/modalsAddCard/ModalAddTopic";
import Header from "../../components/header/Header";
import plants from "../../data/plants.js";
import "./style.css";
import ModalsLevelUp from "../../components/modalsLevelUp/ModalsLevelUp.jsx";
import ModalNewPlantState from "../../components/modalNewPlantState/ModalNewPlantState.jsx";
import StagesGrowth from "../../components/stagesGrowth/StagesGrowth.jsx";
import NotificationXp from "../../components/notificationXp/NotificationXp.jsx";
import ModalAccountLevelUp from "../../components/modalAccountLevelUp/ModalAccountLevelUp.jsx";

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

const formatTimer = (seconds) => {
  const total = Math.floor(seconds);
  const hours = Math.floor(total / 3600);
  const minutes = Math.floor((total % 3600) / 60);
  const secs = total % 60;

  const formattedTimer = [hours, minutes, secs]
    .map((value) => String(value).padStart(2, "0"))
    .join(":");

  return { formattedTimer, total };
};

const getRarityClass = (rarity = "") => {
  const value = String(rarity).toLowerCase();

  if (value.includes("легендар")) return "legendary";
  if (value.includes("эпичес")) return "epic";
  if (value.includes("редк")) return "rare";
  return "common";
};

const currentPlant = (tree_state) => {
  if (tree_state === "seed") {
  }
};

const Card = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [buttonTimer, setButtonTimer] = useState("disabled");
  const [time, setTime] = useState(0);
  const [saveTime, setSaveTime] = useState(0);
  const [infoPlant, setInfoPlant] = useState([]);
  const [message, setMessage] = useState("Загрузка...");
  const [aiMessage, setAiMessage] = useState("");
  const [permissionEdit, setPermissionEdit] = useState(false);
  const [stateSettings, setStateSettings] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalLevelUpOpen, setIsModalLevelUpOpen] = useState(false);
  const [isModalNewPlantState, setIsModalNewPlantState] = useState(false);
  const [levelUpInfo, setLevelUpInfo] = useState(null);
  const [flagStateChange, setFlagStateChange] = useState(false);
  const [notificationXp, setNotificationXp] = useState(null);
  const [isModalAccountLevelUpOpen, setIsModalAccountLevelUpOpen] =
    useState(false);
  const [accountLevelRewardInfo, setAccountLevelRewardInfo] = useState(null);
  const [accountLevelRewardQueue, setAccountLevelRewardQueue] = useState([]);
  const [pendingPlantStateModal, setPendingPlantStateModal] = useState(false);
  const handleAddXp = async (event) => {
    event.preventDefault();

    try {
      const xpUp = formatTimer(time).total * 2200;
      const updated = await addXpToTopic(id, xpUp);
      const isPlantStateChanged = updated.tree_state !== infoPlant.tree_state;
      const newLevelRewards = Array.isArray(updated.new_level_rewards)
        ? updated.new_level_rewards
        : [];
      const hasTopicLevelUp = updated.level > infoPlant.level;
      const hasAccountLevelReward = newLevelRewards.length > 0;

      setNotificationXp({
        xp: xpUp || 0,
        text: "Выполнение задачи",
      });

      setAccountLevelRewardQueue(newLevelRewards);
      setAccountLevelRewardInfo(newLevelRewards[0] || null);
      setPendingPlantStateModal(isPlantStateChanged);

      if (hasTopicLevelUp) {
        setLevelUpInfo({
          oldLevel: infoPlant.level,
          newLevel: updated.level,
          currentMaxXp: updated.current_max_xp,
          currentProgress: updated.current_progress_xp,
        });

        setFlagStateChange(isPlantStateChanged);
        setIsModalLevelUpOpen(true);
      } else if (hasAccountLevelReward) {
        setIsModalAccountLevelUpOpen(true);
      } else if (isPlantStateChanged) {
        setIsModalNewPlantState(true);
      }

      setInfoPlant((prev) => ({
        ...prev,
        xp: updated.xp,
        level: updated.level,
        tree_state: updated.tree_state,
        current_max_xp: updated.current_max_xp,
        current_progress_xp: updated.current_progress_xp,
        progress_width: updated.progress_width,
        image_url: updated.image_url,
        is_dry: updated.is_dry,
        review_count: updated.review_count,
        last_reviewed: updated.last_reviewed,
      }));
      setButtonTimer("disabled");
      setTime(0);
      setSaveTime(0);
    } catch (error) {
      setMessage(error.message);
    }
  };

  const handleDeleteTopic = async () => {
    try {
      await deleteTopicById(id);
      navigate("/topicPage");
    } catch (error) {
      setMessage(error.message);
    }
  };
  useEffect(() => {
    loadTopic();
  }, [id]);

  const loadTopic = async () => {
    try {
      const data = await getTopicById(id);
      setInfoPlant(data);
      setMessage("");
    } catch (error) {
      setMessage(error.message);
    }
  };

  useEffect(() => {
    if (buttonTimer !== "active") return;

    const startTime = Date.now();

    const timerId = setInterval(() => {
      setTime((Date.now() - startTime) / 1000 + saveTime);
    }, 1000);

    return () => {
      clearInterval(timerId);
    };
  }, [buttonTimer, saveTime]);

  const handleCloseAccountLevelUpModal = () => {
    const nextQueue = accountLevelRewardQueue.slice(1);

    if (nextQueue.length > 0) {
      setAccountLevelRewardQueue(nextQueue);
      setAccountLevelRewardInfo(nextQueue[0]);
      return;
    }

    setIsModalAccountLevelUpOpen(false);
    setAccountLevelRewardQueue([]);
    setAccountLevelRewardInfo(null);

    if (pendingPlantStateModal) {
      setIsModalNewPlantState(true);
      setPendingPlantStateModal(false);
    }
  };

  const rarityClass = getRarityClass(infoPlant.rarity);

  return (
    <>
      <Header />

      <main className="topic-inside-page">
        <section className="topic-inside" aria-label="Карточка темы">
          <section className="topic-info-panel" aria-label="Описание темы">
            <div className="topic-hero">
              <h1>{infoPlant.name}</h1>

              <div className="topic-hero__description-row">
                <p>{infoPlant.description}</p>
              </div>
            </div>

            <section className="topic-xp-card" aria-label="Прогресс темы">
              <div className="topic-xp-card__level">
                <span>{infoPlant.level}</span>
                <strong>LVL</strong>
              </div>

              <div className="topic-xp-card__info">
                <span>
                  {infoPlant.current_progress_xp} / {infoPlant.current_max_xp}
                </span>

                <div className="topic-xp-card__bar" aria-hidden="true">
                  <div
                    className={`topic-xp-card__bar-fill topic-xp-card__bar-fill--${rarityClass}`}
                    style={{
                      "--progress-width": infoPlant.progress_width || "0%",
                    }}
                  ></div>
                </div>
              </div>
            </section>
          </section>

          <section
            className="topic-work-panel"
            aria-label="Фокусировка и AI запрос"
          >
            <form
              className="topic-timer-panel"
              aria-label="Таймер фокусировки"
              onSubmit={handleAddXp}
            >
              <div className="topic-timer-panel__time">
                <strong
                  key={Math.floor(time)}
                  className="topic-timer-panel__value"
                >
                  {formatTimer(time).formattedTimer}
                </strong>
                <span>фокусировка</span>
              </div>

              <div className="topic-timer-panel__actions">
                {buttonTimer === "pause" || buttonTimer === "disabled" ? (
                  <button
                    className="topic-control-btn topic-control-btn--start topic-control-btn--appear"
                    type="button"
                    onClick={() => setButtonTimer("active")}
                  >
                    <img
                      className="topic-icon topic-icon--play"
                      src={ICONS.play}
                      alt=""
                      aria-hidden="true"
                    />
                    <span>Старт</span>
                  </button>
                ) : (
                  <button
                    className="topic-control-btn topic-control-btn--pause topic-control-btn--appear"
                    type="button"
                    onClick={() => {
                      setSaveTime(time);
                      setButtonTimer("pause");
                    }}
                  >
                    <span className="topic-pause-icon" aria-hidden="true">
                      <span></span>
                      <span></span>
                    </span>
                    <span>Пауза</span>
                  </button>
                )}

                <button
                  className="topic-control-btn topic-control-btn--reset"
                  type="button"
                  onClick={() => {
                    setButtonTimer("disabled");
                    setTime(0);
                    setSaveTime(0);
                  }}
                >
                  <img
                    className="topic-icon topic-icon--reset"
                    src={ICONS.reset}
                    alt=""
                    aria-hidden="true"
                  />
                  <span>Сброс</span>
                </button>

                <button
                  className="topic-control-btn topic-control-btn--send"
                  type="submit"
                >
                  <img
                    className="topic-icon topic-icon--send-dark"
                    src={ICONS.sendDark}
                    alt=""
                    aria-hidden="true"
                  />
                  <span>Отправить</span>
                </button>
              </div>
            </form>

            <div className="topic-work-panel__divider" aria-hidden="true"></div>

            <section className="topic-ai-panel" aria-label="AI запрос">
              <div className="topic-panel-title topic-ai-panel__title">
                <img
                  className="topic-icon topic-icon--ai"
                  src={ICONS.ai}
                  alt=""
                  aria-hidden="true"
                />
                <span>AI запрос</span>
              </div>

              <div className="topic-ai-panel__row">
                <input
                  className="topic-ai-panel__input"
                  type="text"
                  placeholder="Напишите о своем прогрессе..."
                  value={aiMessage}
                  onChange={(event) => setAiMessage(event.target.value)}
                />

                <button
                  className="topic-ai-panel__send"
                  type="button"
                  aria-label="Отправить AI запрос"
                >
                  <img
                    className="topic-icon topic-icon--send-green"
                    src={ICONS.sendGreen}
                    alt=""
                    aria-hidden="true"
                  />
                </button>
              </div>
            </section>
          </section>

          <section className="topic-tasks-panel" aria-label="Задачи">
            <div className="topic-panel-title topic-tasks-panel__title">
              <img
                className="topic-icon topic-icon--tasks"
                src={ICONS.tasks}
                alt=""
                aria-hidden="true"
              />
              <span>Задачи</span>
            </div>

            <div className="topic-tasks-panel__list">
              <div className="topic-task-row">
                <div className="topic-task-row__text">
                  <img
                    className="topic-icon topic-icon--check"
                    src={ICONS.check}
                    alt=""
                    aria-hidden="true"
                  />
                  <span>Сфокусироваться на теме</span>
                </div>

                <span className="topic-task-row__xp">+10XP</span>
              </div>

              <div className="topic-task-row">
                <div className="topic-task-row__text">
                  <img
                    className="topic-icon topic-icon--check"
                    src={ICONS.check}
                    alt=""
                    aria-hidden="true"
                  />
                  <span>Сфокусироваться на теме</span>
                </div>

                <span className="topic-task-row__xp">+10XP</span>
              </div>

              <div className="topic-task-row">
                <div className="topic-task-row__text">
                  <img
                    className="topic-icon topic-icon--check"
                    src={ICONS.check}
                    alt=""
                    aria-hidden="true"
                  />
                  <span>Сфокусироваться на теме</span>
                </div>

                <span className="topic-task-row__xp">+70XP</span>
              </div>
            </div>
          </section>
          <div
            className={`topic-tree-back-glow topic-tree-back-glow--${rarityClass}`}
            aria-hidden="true"
          ></div>
          <section className="topic-tree-panel" aria-label="Растение темы">
            <div
              className={`topic-tree-visual topic-tree-visual--${rarityClass}`}
              aria-hidden="true"
            >
              {rarityClass === "epic" && (
                <div
                  className="topic-tree-visual__particles"
                  aria-hidden="true"
                >
                  {EPIC_PARTICLES.map((particle) => {
                    const particleType = particle.startsWith("dot")
                      ? "dot"
                      : "star";

                    return (
                      <span
                        key={particle}
                        className={`topic-tree-visual__particle topic-tree-visual__particle--${particleType} topic-tree-visual__particle--${particle}`}
                      />
                    );
                  })}
                </div>
              )}

              {rarityClass === "legendary" && (
                <div
                  className="topic-tree-visual__legendary-effects"
                  aria-hidden="true"
                >
                  <span className="topic-tree-visual__legendary-aura" />
                  <span className="topic-tree-visual__legendary-orbit topic-tree-visual__legendary-orbit--one" />
                  <span className="topic-tree-visual__legendary-orbit topic-tree-visual__legendary-orbit--two" />
                  <span className="topic-tree-visual__legendary-orbit topic-tree-visual__legendary-orbit--three" />

                  {LEGENDARY_STARS.map((particle) => {
                    const particleType = particle.startsWith("dot")
                      ? "dot"
                      : "star";

                    return (
                      <span
                        key={particle}
                        className={`topic-tree-visual__legendary-particle topic-tree-visual__legendary-particle--${particleType} topic-tree-visual__legendary-particle--${particle}`}
                      />
                    );
                  })}

                  <span className="topic-tree-visual__legendary-leaf topic-tree-visual__legendary-leaf--one" />
                  <span className="topic-tree-visual__legendary-leaf topic-tree-visual__legendary-leaf--two" />
                </div>
              )}

              <img
                className="topic-tree-visual__image"
                src={infoPlant.image_url}
                alt=""
              />
            </div>

            <button
              className="topic-settings-btn"
              type="button"
              onClick={
                stateSettings === false
                  ? () => setStateSettings(true)
                  : () => setStateSettings(false)
              }
            >
              <img
                className="topic-icon topic-icon--settings"
                src={ICONS.settings}
                alt=""
                aria-hidden="true"
              />
              <span>Настройки</span>
            </button>

            {stateSettings && (
              <div
                className="topic-settings-menu"
                aria-label="Действия с темой"
              >
                <button type="button" onClick={() => setIsModalOpen(true)}>
                  Редактировать
                </button>

                <span aria-hidden="true"></span>

                <button
                  type="button"
                  className="topic-settings-menu__delete"
                  onClick={handleDeleteTopic}
                >
                  Удалить тему
                </button>
              </div>
            )}
          </section>

          <section
            className="topic-plant-panel"
            aria-label="Информация о растении"
          >
            <div className="topic-plant-panel__short-info">
              <div className="topic-plant-feature">
                <img
                  className="topic-icon topic-icon--leaf"
                  src={ICONS.leaf}
                  alt=""
                  aria-hidden="true"
                />

                <div>
                  <span>Растение</span>
                  <strong>{infoPlant.tree_type}</strong>
                </div>
              </div>

              <div className="topic-plant-feature topic-plant-feature--rarity">
                <span
                  className={`topic-icon topic-icon--star topic-icon--star--${rarityClass}`}
                  aria-hidden="true"
                ></span>

                <div>
                  <span>Редкость</span>
                  <strong
                    className={`topic-plant-feature__rarity topic-plant-feature__rarity--${rarityClass}`}
                  >
                    {infoPlant.rarity}
                  </strong>
                </div>
              </div>
            </div>

            <div className="topic-stage">
              <div className="topic-stage__divider"></div>

              <StagesGrowth state={infoPlant.tree_state} />
            </div>
          </section>
        </section>
      </main>
      {isModalOpen && (
        <ModalAddTopic
          onClose={() => setIsModalOpen(false)}
          mode="edit"
          title="Редактировать тему"
          name={infoPlant.name}
          descriptionEdit={infoPlant.description}
          onCreated={loadTopic}
          id={id}
        />
      )}
      {isModalLevelUpOpen && (
        <ModalsLevelUp
          newLevel={levelUpInfo.newLevel}
          oldLevel={levelUpInfo.oldLevel}
          currentMaxXp={levelUpInfo.currentMaxXp}
          currentProgress={levelUpInfo.currentProgress}
          onClose={() => {
            setIsModalLevelUpOpen(false);

            if (accountLevelRewardInfo) {
              setIsModalAccountLevelUpOpen(true);
            } else {
              setIsModalNewPlantState(flagStateChange);
              setPendingPlantStateModal(false);
            }
          }}
        />
      )}

      {isModalNewPlantState && (
        <ModalNewPlantState
          img={infoPlant.image_url}
          state={infoPlant.tree_state}
          name={infoPlant.tree_type}
          onClose={() => setIsModalNewPlantState(false)}
        />
      )}
      {notificationXp && notificationXp.xp > 0 && (
        <NotificationXp
          xp={notificationXp.xp}
          text={notificationXp.text}
          onClose={() => setNotificationXp(null)}
        />
      )}
      {isModalAccountLevelUpOpen && accountLevelRewardInfo && (
        <ModalAccountLevelUp
          reward={accountLevelRewardInfo}
          onClose={handleCloseAccountLevelUpModal}
        />
      )}
    </>
  );
};

export default Card;
