import "./achieve.css";
import Header from "../../components/header/Header";
import trophyImg from "./trphu.png";
import lockImg from "./lock.png";

export default function AchievePage() {
  return (
    <>
      <Header />

      <main className="achievements-page">
        <section className="achievements-hero">
          <h1 className="achievements-title">Достижения</h1>

          <div className="achievements-counter" aria-label="Получено достижений">
            <span className="achievements-counter__icon" aria-hidden="true">♕</span>
            <span>Получено</span>
            <strong>4/48</strong>
          </div>
        </section>

        <section className="achievements-section" aria-labelledby="completed-achievements-title">
          <h2 id="completed-achievements-title" className="achievements-section__title">
            Полученные
          </h2>

          <div className="achievements-grid">
            <article className="achievement-card achievement-card--complete" style={{ "--achievement-accent": "#9DBD5F" }}>
              <div className="achievement-card__state" aria-hidden="true">✓</div>
              <div className="achievement-card__body">
                <div className="achievement-card__icon">
                  <img className="achievement-icon__image" src={trophyImg} alt="7 дней подряд" />
                </div>
                <div className="achievement-card__content">
                  <h3 className="achievement-card__title">7 дней подряд</h3>
                  <p className="achievement-card__description">Поливай тему 7 дней без пропусков</p>
                </div>
              </div>
              <div className="achievement-card__footer">
                <span className="achievement-card__xp">170 XP</span>
                <span className="achievement-card__badge">Получено</span>
              </div>
            </article>

            <article className="achievement-card achievement-card--complete" style={{ "--achievement-accent": "#9DBD5F" }}>
              <div className="achievement-card__state" aria-hidden="true">✓</div>
              <div className="achievement-card__body">
                <div className="achievement-card__icon">
                  <span className="achievement-icon__symbol achievement-icon__symbol--sprout" aria-hidden="true">✦</span>
                </div>
                <div className="achievement-card__content">
                  <h3 className="achievement-card__title">Первые 5 тем</h3>
                  <p className="achievement-card__description">Создай и оформи 5 тем в саду</p>
                </div>
              </div>
              <div className="achievement-card__footer">
                <span className="achievement-card__xp">120 XP</span>
                <span className="achievement-card__badge">Получено</span>
              </div>
            </article>

            <article className="achievement-card achievement-card--complete" style={{ "--achievement-accent": "#E7B94F" }}>
              <div className="achievement-card__state" aria-hidden="true">✓</div>
              <div className="achievement-card__body">
                <div className="achievement-card__icon">
                  <span className="achievement-icon__symbol achievement-icon__symbol--spark" aria-hidden="true">★</span>
                </div>
                <div className="achievement-card__content">
                  <h3 className="achievement-card__title">Легендарный рост</h3>
                  <p className="achievement-card__description">Доведи легендарную тему до 10 уровня</p>
                </div>
              </div>
              <div className="achievement-card__footer">
                <span className="achievement-card__xp">300 XP</span>
                <span className="achievement-card__badge">Получено</span>
              </div>
            </article>

            <article className="achievement-card achievement-card--complete" style={{ "--achievement-accent": "#9DBD5F" }}>
              <div className="achievement-card__state" aria-hidden="true">✓</div>
              <div className="achievement-card__body">
                <div className="achievement-card__icon">
                  <span className="achievement-icon__symbol achievement-icon__symbol--friends" aria-hidden="true">♥</span>
                </div>
                <div className="achievement-card__content">
                  <h3 className="achievement-card__title">Первый друг</h3>
                  <p className="achievement-card__description">Добавь 1 друга в MindGarden</p>
                </div>
              </div>
              <div className="achievement-card__footer">
                <span className="achievement-card__xp">80 XP</span>
                <span className="achievement-card__badge">Получено</span>
              </div>
            </article>
          </div>
        </section>

        <section className="achievements-section achievements-section--progress" aria-labelledby="progress-achievements-title">
          <h2 id="progress-achievements-title" className="achievements-section__title">
            В процессе
          </h2>

          <div className="achievements-grid">
            <article className="achievement-card achievement-card--progress" style={{ "--achievement-accent": "#9DBD5F" }}>
              <div className="achievement-card__state" aria-hidden="true">9/14</div>
              <div className="achievement-card__body">
                <div className="achievement-card__icon">
                  <img className="achievement-icon__image" src={lockImg} alt="14 дней подряд" />
                </div>
                <div className="achievement-card__content">
                  <h3 className="achievement-card__title">14 дней подряд</h3>
                  <p className="achievement-card__description">Поливай тему 14 дней без пропусков</p>
                </div>
              </div>
              <div className="achievement-card__progress" aria-label="Прогресс 9/14">
                <span style={{ width: "64%" }} />
              </div>
              <div className="achievement-card__footer">
                <span className="achievement-card__xp">170 XP</span>
                <span className="achievement-card__badge">В процессе</span>
              </div>
            </article>

            <article className="achievement-card achievement-card--progress" style={{ "--achievement-accent": "#EAA71A" }}>
              <div className="achievement-card__state" aria-hidden="true">12/20</div>
              <div className="achievement-card__body">
                <div className="achievement-card__icon">
                  <span className="achievement-icon__symbol achievement-icon__symbol--repeat" aria-hidden="true">↻</span>
                </div>
                <div className="achievement-card__content">
                  <h3 className="achievement-card__title">20 повторений</h3>
                  <p className="achievement-card__description">Повтори действия 20 раз</p>
                </div>
              </div>
              <div className="achievement-card__progress" aria-label="Прогресс 12/20">
                <span style={{ width: "60%" }} />
              </div>
              <div className="achievement-card__footer">
                <span className="achievement-card__xp">120 XP</span>
                <span className="achievement-card__badge">В процессе</span>
              </div>
            </article>

            <article className="achievement-card achievement-card--progress" style={{ "--achievement-accent": "#65AEEA" }}>
              <div className="achievement-card__state" aria-hidden="true">6/10</div>
              <div className="achievement-card__body">
                <div className="achievement-card__icon">
                  <span className="achievement-icon__symbol achievement-icon__symbol--book" aria-hidden="true">▣</span>
                </div>
                <div className="achievement-card__content">
                  <h3 className="achievement-card__title">Коллекционер</h3>
                  <p className="achievement-card__description">Собери 10 тем в коллекцию</p>
                </div>
              </div>
              <div className="achievement-card__progress" aria-label="Прогресс 6/10">
                <span style={{ width: "60%" }} />
              </div>
              <div className="achievement-card__footer">
                <span className="achievement-card__xp">150 XP</span>
                <span className="achievement-card__badge">В процессе</span>
              </div>
            </article>

            <article className="achievement-card achievement-card--progress" style={{ "--achievement-accent": "#9DBD5F" }}>
              <div className="achievement-card__state" aria-hidden="true">1/3</div>
              <div className="achievement-card__body">
                <div className="achievement-card__icon">
                  <span className="achievement-icon__symbol achievement-icon__symbol--leaf" aria-hidden="true">☘</span>
                </div>
                <div className="achievement-card__content">
                  <h3 className="achievement-card__title">Нужный функционал</h3>
                  <p className="achievement-card__description">Добавь 1 фильтр в свой сад</p>
                </div>
              </div>
              <div className="achievement-card__progress" aria-label="Прогресс 1/3">
                <span style={{ width: "33%" }} />
              </div>
              <div className="achievement-card__footer">
                <span className="achievement-card__xp">80 XP</span>
                <span className="achievement-card__badge">В процессе</span>
              </div>
            </article>
          </div>
        </section>
      </main>
    </>
  );
}
