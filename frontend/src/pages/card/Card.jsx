import Header from "../../components/header/Header";
import "./style.css";
import { getTopicById } from "../../api/auth";
import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";

const MAX_XP = 3500;
const DEFAULT_TREE_IMAGE = "/sakura_big.png";
const DEFAULT_DESCRIPTION =
  "Алгоритм интервального повторения и наглядная визуализация прогресса. Вы видите, бывает же вот дела Алгоритмы и структуры данных Алгоритмы и структуры данных";

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
};

const formatTimer = (seconds) => {
  const total = Math.floor(seconds);
  const hours = Math.floor(total / 3600);
  const minutes = Math.floor((total % 3600) / 60);
  const secs = total % 60;

  return [hours, minutes, secs]
    .map((value) => String(value).padStart(2, "0"))
    .join(":");
};

const getRarityLabel = (rarity) => {
  const labels = {
    Обычное: "Обычная",
    Обычная: "Обычная",
    Редкое: "Редкая",
    Редкая: "Редкая",
    Эпическое: "Эпическая",
    Эпическая: "Эпическая",
    Легендарное: "Легендарная",
    Легендарная: "Легендарная",
  };

  return labels[rarity] || rarity || "Легендарная";
};

const getStageIndex = (topic) => {
  const state = String(topic.tree_state || "").toLowerCase();
  const level = Number(topic.level) || 0;

  if (["adult", "grown", "mature", "взрослое"].includes(state)) return 2;
  if (["young", "middle", "medium", "молодое"].includes(state)) return 1;
  if (level >= 30) return 2;
  if (level >= 10) return 1;

  return 0;
};

const Card = () => {
  const { id } = useParams();
  const [topicInfo, setTopicInfo] = useState({});
  const [buttonTimer, setButtonTimer] = useState("disabled");
  const [time, setTime] = useState(0);
  const [saveTime, setSaveTime] = useState(0);
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function loadTopic() {
      try {
        const data = await getTopicById(id);
        setTopicInfo(data);
        setMessage("");
      } catch (error) {
        setMessage(error.message);
      }
    }

    loadTopic();
  }, [id]);

  useEffect(() => {
    if (buttonTimer !== "active") return undefined;

    const startTime = Date.now();
    const timerId = setInterval(() => {
      setTime((Date.now() - startTime) / 1000 + saveTime);
    }, 1000);

    return () => {
      clearInterval(timerId);
    };
  }, [buttonTimer, saveTime]);

  const title = topicInfo.name || "Алгоритмы и структуры данных";
  const description = topicInfo.description || DEFAULT_DESCRIPTION;
  const plantName = topicInfo.tree_type || "Сакура";
  const rarity = getRarityLabel(topicInfo.rarity);
  const level = topicInfo.level ?? 27;
  const xp = topicInfo.xp ?? 2380;
  const progress = Math.min((xp / MAX_XP) * 100, 100);
  const treeImage = topicInfo.image_url || DEFAULT_TREE_IMAGE;
  const stageIndex = useMemo(() => getStageIndex(topicInfo), [topicInfo]);
  const stages = ["Саженец", "Молодое\nРастение", "Взрослое\nрастение"];

  return (
    <>
      <Header />

      <main className="topic-inside-page">
        <section className="topic-inside" aria-label="Карточка темы">
          {message && <p className="topic-inside__message">{message}</p>}

          <button className="topic-settings-btn" type="button">
            <img
              className="topic-icon topic-icon--settings"
              src={ICONS.settings}
              alt=""
              aria-hidden="true"
            />
            <span>Настройки темы</span>
          </button>

          <section className="topic-hero">
            <h1>{title}</h1>
            <p>{description}</p>
          </section>

          <section className="topic-xp-card" aria-label="Прогресс темы">
            <div className="topic-xp-card__level">
              <span>{level}</span>
              <strong>LVL</strong>
            </div>

            <div className="topic-xp-card__info">
              <span>
                {xp} / {MAX_XP} XP
              </span>
              <div className="topic-xp-card__bar" aria-hidden="true">
                <div style={{ width: `${progress}%` }}></div>
              </div>
            </div>
          </section>

          <section className="topic-timer-panel" aria-label="Таймер фокусировки">
            <div className="topic-timer-panel__time">
              <strong>{formatTimer(time)}</strong>
              <span>фокусировка</span>
            </div>

            <div className="topic-timer-panel__actions">
              {buttonTimer === "pause" || buttonTimer === "disabled" ? (
                <button
                  className="topic-control-btn topic-control-btn--start"
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
                  className="topic-control-btn topic-control-btn--start"
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
                <span>Cброс</span>
              </button>

              <button className="topic-control-btn topic-control-btn--send" type="button">
                <img
                  className="topic-icon topic-icon--send-dark"
                  src={ICONS.sendDark}
                  alt=""
                  aria-hidden="true"
                />
                <span>Отправить</span>
              </button>
            </div>
          </section>

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
                readOnly
              />

              <button className="topic-ai-panel__send" type="button" aria-label="Отправить AI запрос">
                <img
                  className="topic-icon topic-icon--send-green"
                  src={ICONS.sendGreen}
                  alt=""
                  aria-hidden="true"
                />
              </button>
            </div>
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
              {[80, 10, 70].map((taskXp) => (
                <div className="topic-task-row" key={taskXp}>
                  <div className="topic-task-row__text">
                    <img
                      className="topic-icon topic-icon--check"
                      src={ICONS.check}
                      alt=""
                      aria-hidden="true"
                    />
                    <span>Сфокусироваться на теме</span>
                  </div>
                  <span className="topic-task-row__xp">+{taskXp}XP</span>
                </div>
              ))}
            </div>
          </section>

          <div className="topic-tree-visual" aria-hidden="true">
            <div className="topic-tree-visual__glow"></div>
            <img className="topic-tree-visual__image" src={treeImage} alt="" />
          </div>

          <section className="topic-plant-panel" aria-label="Информация о растении">
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
                  <strong>{plantName}</strong>
                </div>
              </div>

              <div className="topic-plant-feature">
                <img
                  className="topic-icon topic-icon--star"
                  src={ICONS.star}
                  alt=""
                  aria-hidden="true"
                />
                <div>
                  <span>Редкость</span>
                  <strong className="topic-plant-feature__rarity">{rarity}</strong>
                </div>
              </div>
            </div>

            <div className="topic-stage">
              <div className="topic-stage__divider"></div>

              <div className="topic-stage__content">
                <div className="topic-stage__inner">
                  <div className="topic-stage__icons">
                    <img
                      className="topic-icon topic-icon--stage-seedling"
                      src={ICONS.stageSeedling}
                      alt=""
                      aria-hidden="true"
                    />
                    <img
                      className="topic-icon topic-icon--stage-young"
                      src={ICONS.stageYoung}
                      alt=""
                      aria-hidden="true"
                    />
                    <img
                      className="topic-icon topic-icon--stage-adult"
                      src={ICONS.stageAdult}
                      alt=""
                      aria-hidden="true"
                    />
                  </div>

                  <div className="topic-stage__track" aria-hidden="true">
                    <span
                      className={`topic-stage__line ${
                        stageIndex >= 1 ? "topic-stage__line--done" : ""
                      }`}
                    ></span>
                    <span
                      className={`topic-stage__line ${
                        stageIndex >= 2 ? "topic-stage__line--done" : ""
                      }`}
                    ></span>

                    {stages.map((stage, index) => (
                      <span
                        className={`topic-stage__dot ${
                          index <= stageIndex ? "topic-stage__dot--active" : ""
                        }`}
                        key={stage}
                      ></span>
                    ))}
                  </div>

                  <div className="topic-stage__labels">
                    {stages.map((stage) => (
                      <span key={stage}>{stage}</span>
                    ))}
                  </div>
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