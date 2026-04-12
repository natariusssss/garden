import Header from "../../components/header/Header";
import "./style.css";
import img from "./tree.png";

const TopicsPage = () => {
  return (
        <>
        <Header/>
        <main className="topics-page">
    <section className="topics-section">
      <div className="topics-section__container">
        <h1 className="topics-section__title">Ваши темы и связи</h1>

        <div className="topics-grid">

          <article className="topic-card">
            <div className="topic-card__top">
              <p className="topic-card__xp">432 / 560 <span>XP</span></p>

              <div className="topic-card__badges">
                <div className="topic-card__badge topic-card__badge--success" aria-label="Тема завершена на сегодня">
                  ✓
                </div>

                <div className="topic-card__badge topic-card__badge--time" aria-label="Время до повтора">
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <circle cx="12" cy="12" r="8"></circle>
                    <path d="M12 8v4l3 2"></path>
                  </svg>
                </div>

                <span className="topic-card__time">17ч</span>
              </div>
            </div>

            <div className="topic-card__image-wrap">
              <img
                src={img}
                alt="Тема Алгебра"
                className="topic-card__image"
              ></img>
            </div>

            <div className="topic-card__bottom">
              <div className="topic-card__level">
                <span className="topic-card__level-number">28</span>
                <span className="topic-card__level-text">LVL</span>
              </div>

              <h2 className="topic-card__name">Алгебра</h2>
            </div>
          </article>

          <button className="add-topic-card" type="button" aria-label="Добавить тему">
            <span className="add-topic-card__plus"></span>
            <span className="add-topic-card__text">Нажмите, чтобы добавить тему</span>
          </button>
        </div>
      </div>
    </section>
  </main>
    
    </>
  );
};

export default TopicsPage;