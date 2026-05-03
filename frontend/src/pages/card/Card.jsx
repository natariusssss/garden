import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { addXpToTopic, deleteTopicById, getTopicById } from "../../api/auth";
import Header from "../../components/header/Header";
import "./style.css";

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
  const [edit, setEdit] = useState(false);
  const [stateSettings, setStateSettings] = useState(false);

  const handleAddXp = async (event) => {
    event.preventDefault();

    try {
      const updated = await addXpToTopic(id, formatTimer(time).total * 1000);

      setInfoPlant((prev) => ({
        ...prev,
        xp: updated.xp,
        level: updated.level,
        tree_state: updated.tree_state,
        current_max_xp: updated.current_max_xp,
        current_progress_xp: updated.current_progress_xp,
        progress_width: updated.progress_width,
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
    const loadTopic = async () => {
      try {
        const data = await getTopicById(id);
        setInfoPlant(data);
        setMessage("");
      } catch (error) {
        setMessage(error.message);
      }
    };

    if (id) {
      loadTopic();
    }
  }, [id]);

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
            <div className="topic-tree-visual" aria-hidden="true">
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
                <button type="button" onClick={() => setEdit(true)}>
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

              <div className="topic-stage__steps">
                <div
                  className={`${infoPlant.tree_state === "seed" ? "topic-stage__step topic-stage__step--active" : "topic-stage__step topic-stage__step--done"} `}
                >
                  <div className="topic-stage__circle">
                    <img
                      className="topic-icon topic-icon--stage-seedling"
                      src={ICONS.stageSeedling}
                      alt=""
                      aria-hidden="true"
                    />
                  </div>
                  <span>Саженец</span>
                </div>

                <img
                  className="topic-icon topic-stage__arrow"
                  src={ICONS.stageArrow}
                  alt=""
                  aria-hidden="true"
                />

                <div
                  className={`${infoPlant.tree_state === "young" ? "topic-stage__step topic-stage__step--active" : infoPlant.tree_state === "seed" ? "topic-stage__step topic-stage__step--next" : "topic-stage__step topic-stage__step--done"} `}
                >
                  <div className="topic-stage__circle">
                    <img
                      className="topic-icon topic-icon--stage-young"
                      src={ICONS.stageYoung}
                      alt=""
                      aria-hidden="true"
                    />
                  </div>
                  <span>
                    Молодое
                    <br />
                    Растение
                  </span>
                </div>

                <img
                  className="topic-icon topic-stage__arrow"
                  src={ICONS.stageArrowSecond}
                  alt=""
                  aria-hidden="true"
                />

                <div
                  className={`${infoPlant.tree_state === "adult" ? "topic-stage__step topic-stage__step--active" : "topic-stage__step topic-stage__step--next"} `}
                >
                  <div className="topic-stage__circle">
                    <img
                      className="topic-icon topic-icon--stage-adult"
                      src={ICONS.stageAdult}
                      alt=""
                      aria-hidden="true"
                    />
                  </div>
                  <span>
                    Взрослое
                    <br />
                    растение
                  </span>
                </div>
              </div>
            </div>
          </section>
        </section>
      </main>
    </>
  );
};

export default Card;
