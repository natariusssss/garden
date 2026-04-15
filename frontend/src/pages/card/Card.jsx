import Header from "../../components/header/Header";
import "./style.css";
import treeImg from "./tree.png";

const Card = () => {
  return (
    <>
      <Header />

      <main className="topic-detail-page">
        <section className="topic-detail">
          <div className="topic-detail__container">
            <h1 className="topic-detail__title">Мой сад / Алгебра</h1>

            <div className="topic-detail__layout">
              <article className="topic-preview-card">
                <div className="topic-preview-card__head">
                  <h2 className="topic-preview-card__name">Секвойя</h2>
                  <span className="topic-preview-card__rarity">редкое</span>
                </div>

                <div className="topic-preview-card__image-wrap">
                  <img
                    src={treeImg}
                    alt="Секвойя"
                    className="topic-preview-card__image"
                  />
                </div>

                <div className="topic-preview-card__progress">
                  <div className="topic-preview-card__level">
                    <span className="topic-preview-card__level-number">28</span>
                    <span className="topic-preview-card__level-text">LVL</span>
                  </div>

                  <div className="topic-preview-card__progress-main">
                    <p className="topic-preview-card__xp">
                      432 / 560 <span>XP</span>
                    </p>

                    <div className="topic-preview-card__bar">
                      <span className="topic-preview-card__bar-fill"></span>
                    </div>
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
                    <div className="topic-workspace__timer-box">45 : 42</div>

                    <button
                      className="topic-workspace__icon-btn"
                      type="button"
                      aria-label="Запустить таймер"
                    >
                      <svg viewBox="0 0 24 24" aria-hidden="true">
                        <path
                          d="M8 6.5L18 12L8 17.5V6.5Z"
                          fill="currentColor"
                        />
                      </svg>
                    </button>

                    <button
                      className="topic-workspace__icon-btn"
                      type="button"
                      aria-label="Пауза"
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

                    <button
                      className="topic-workspace__accept-btn"
                      type="button"
                    >
                      Принять
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
                    Алгоритм интервального повторения и наглядная визуализация
                    прогресса. Вы видите, какие темы закреплены, какие увядают и
                    что требует внимания.
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
