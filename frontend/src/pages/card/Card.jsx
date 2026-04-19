import Header from "../../components/header/Header";
import "./style.css";
import treeImg from "./tree.png";
import { getTopicById } from "../../api/auth";
import { useParams } from "react-router-dom";
import { useState } from "react";
import { useEffect } from "react";
import { matchPath } from "react-router-dom";

const Card = () => {
  const [topicInfo, setTopicInfo] = useState([]);
  const { id } = useParams();
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
    if (buttonTimer !== "active") return;

    const startTime = Date.now();
    const timerId = setInterval(() => {
      setTime((Date.now() - startTime) / 1000 + saveTime);
    }, 1000);

    return () => {
      clearInterval(timerId);
    };
  }, [buttonTimer]);

  return (
    <>
      <Header />

      <main className="topic-detail-page">
        <section className="topic-detail">
          <div className="topic-detail__container">
            <h1 className="topic-detail__title">Мой сад / {topicInfo.name}</h1>

            <div className="topic-detail__layout">
              <article className="topic-card topic-card--detail">
                <div className="topic-card__head">
                  <div className="topic-card__chips">
                    <span className="topic-card__chip topic-card__chip--tree">
                      Сакура
                    </span>
                    <span className="topic-card__chip topic-card__chip--rarity">
                      Легендарная
                    </span>
                  </div>

                  <div className="topic-card__badges">
                    <div
                      className="topic-card__badge topic-card__badge--success"
                      aria-label="Тема завершена на сегодня"
                    >
                      ✓
                    </div>

                    <div
                      className="topic-card__badge topic-card__badge--time"
                      aria-label="Время до повтора"
                    >
                      <svg viewBox="0 0 24 24" aria-hidden="true">
                        <circle cx="12" cy="12" r="8"></circle>
                        <path d="M12 8v4l3 2"></path>
                      </svg>
                      <span className="topic-card__time">17ч</span>
                    </div>
                  </div>
                </div>

                <div className="topic-card__image-wrap">
                  <img
                    src={treeImg}
                    alt={topicInfo.name}
                    className="topic-card__image"
                  />
                </div>

                <div className="topic-card__bottom">
                  <div className="topic-card__bottom-top">
                    <div className="topic-card__level">
                      <span className="topic-card__level-number">
                        {topicInfo.level}
                      </span>
                      <span className="topic-card__level-text">LVL</span>
                    </div>

                    <div className="topic-card__divider"></div>

                    <h2 className="topic-card__name">{topicInfo.name}</h2>
                  </div>

                  <div className="topic-card__progress">
                    <div
                      className="topic-card__progress-fill"
                      style={{
                        width: `${Math.min(((topicInfo.xp || 0) / 560) * 100, 100)}%`,
                      }}
                    ></div>
                    <span className="topic-card__progress-text">
                      {topicInfo.xp || 0} / 560 XP
                    </span>
                  </div>
                </div>
              </article>

              <article className="topic-workspace">
                <div className="topic-workspace__status">
                  <span>Состояние:</span>
                  <span className="topic-workspace__status-check">✓</span>
                </div>

                <section className="topic-workspace__section">
                  <h2 className="topic-workspace__label">Таймер</h2>

                  <div className="topic-workspace__timer-row">
                    <div className="topic-workspace__timer-box">
                      {String(Math.floor(time / 60)).padStart(2, "0")}:
                      {String(Math.floor(time % 60)).padStart(2, "0")}
                    </div>

                    {buttonTimer === "pause" || buttonTimer === "disabled" ? (
                      <button
                        className="topic-workspace__icon-btn"
                        type="button"
                        aria-label="Запустить таймер"
                        onClick={() => setButtonTimer("active")}
                      >
                        <svg viewBox="0 0 24 24" aria-hidden="true">
                          <path
                            d="M8 6.5L18 12L8 17.5V6.5Z"
                            fill="currentColor"
                          />
                        </svg>
                      </button>
                    ) : (
                      <button
                        className="topic-workspace__icon-btn"
                        type="button"
                        aria-label="Пауза-Старт"
                        onClick={() => {
                          setSaveTime(time);
                          setButtonTimer("pause");
                        }}
                      >
                        <svg viewBox="0 0 24 24" aria-hidden="true">
                          <rect
                            x="6"
                            y="5"
                            width="4"
                            height="14"
                            rx="1.5"
                            fill="currentColor"
                          />
                          <rect
                            x="14"
                            y="5"
                            width="4"
                            height="14"
                            rx="1.5"
                            fill="currentColor"
                          />
                        </svg>
                      </button>
                    )}

                    <button
                      className="topic-workspace__decline-btn"
                      type="button"
                      onClick={() => {
                        setButtonTimer("disabled");
                        setTime(0);
                        setSaveTime(0);
                      }}
                    >
                      Cбросить
                    </button>
                    <button
                      className="topic-workspace__accept-btn"
                      type="button"
                    >
                      Отправить время
                    </button>
                  </div>
                </section>

                <section className="topic-workspace__section">
                  <h2 className="topic-workspace__label">Запрос XP</h2>

                  <div className="topic-workspace__request-row">
                    <input
                      className="topic-workspace__input"
                      type="text"
                      placeholder="Напишите о том, что сделали за сегодня и наша ИИ модель зачтет вам XP"
                      readOnly
                    />

                    <button className="topic-workspace__send-btn" type="button">
                      Отправить запрос
                    </button>
                  </div>
                </section>

                <section className="topic-workspace__section topic-workspace__section--description">
                  <h2 className="topic-workspace__label">Описание</h2>

                  <div className="topic-workspace__description">
                    {topicInfo.description}
                  </div>
                </section>
              </article>
            </div>
          </div>
        </section>
      </main>
    </>
  );
};

export default Card;
