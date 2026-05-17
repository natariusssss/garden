import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../components/header/Header";
import ListCard from "../../components/card/ListCard";
import img from "./leaves.svg";
import "./home.css";

const rewardRibbonTop = [
  {
    title: "Первая цель",
    description: "Создай первую тему и начни путь",
    tag: "Старт",
    reward: "+25 XP",
    progress: "Получено",
    tone: "green",
  },
  {
    title: "Серия фокуса",
    description: "Выполни несколько занятий подряд",
    tag: "Фокус",
    reward: "+120 XP",
    progress: "7 / 10",
    tone: "gold",
  },
  {
    title: "Новая вершина",
    description: "Достигни высокого уровня аккаунта",
    tag: "Уровень",
    reward: "+150 XP",
    progress: "Получено",
    tone: "pink",
  },
];

const rewardRibbonBottom = [
  {
    title: "Возвращение",
    description: "Вернись к повторению без пропусков",
    tag: "Ритм",
    reward: "+60 XP",
    progress: "В процессе",
    tone: "blue",
  },
  {
    title: "Сад растёт",
    description: "Открой несколько новых растений",
    tag: "Коллекция",
    reward: "+90 XP",
    progress: "4 / 6",
    tone: "purple",
  },
  {
    title: "Мастер темы",
    description: "Доведи одну тему до высокого уровня",
    tag: "Прогресс",
    reward: "+200 XP",
    progress: "Получено",
    tone: "pink",
  },
];

const topicCards = [
  {
    name: "Русский язык",
    level: 20,
    image: "/lily/lily_big.png",
    plant_name: "Лилия",
    rarity: "Эпическое",
    current_progress_xp: 1500,
    current_max_xp: 2000,
    progress_width: "75%",
    last_reviewed: "2026-05-17T00:00:00.000Z",
    className: "home-list-cards-preview__item--one",
  },
  {
    name: "Английский язык",
    level: 20,
    image: "/magnolia/magnolia_big.png",
    plant_name: "Магнолия",
    rarity: "Легендарная",
    current_progress_xp: 1300,
    current_max_xp: 2000,
    progress_width: "65%",
    last_reviewed: "2026-05-17T00:00:00.000Z",
    className: "home-list-cards-preview__item--two",
  },
  {
    name: "Ботаника",
    level: 12,
    image: "/orchids/orchids_big.png",
    plant_name: "Орхидея",
    rarity: "Редкое",
    current_progress_xp: 680,
    current_max_xp: 1200,
    progress_width: "57%",
    last_reviewed: "2026-05-17T00:00:00.000Z",
    className: "home-list-cards-preview__item--three",
  },
];

const friends = [
  {
    letter: "A",
    name: "Arina",
    level: 42,
  },
  {
    letter: "M",
    name: "Max",
    level: 38,
  },
  {
    letter: "K",
    name: "Kira",
    level: 35,
  },
];

const howSteps = [
  {
    number: "01",
    title: "Создай тему",
    body: "Задай название, выбери растение-символ и начни отслеживать прогресс в любом направлении — от изучения языков до спорта.",
  },
  {
    number: "02",
    title: "Занимайся",
    body: "Запусти таймер фокусировки, работай над темой. Каждая сессия даёт XP и продвигает растение к следующей стадии роста.",
  },
  {
    number: "03",
    title: "Наблюдай",
    body: "Смотри как сад наполняется, открывай достижения и редкие растения, соревнуйся с друзьями в рейтинге.",
  },
];

const goals = [
  {
    title: "Мотивация человека",
    body: "Когда результат не виден сразу, становится трудно сохранять регулярность и продолжать движение к цели.",
  },
  {
    title: "Достижения и друзья",
    body: "Система достижений помогает замечать успехи, а рейтинг среди друзей добавляет вовлечённость и здоровую мотивацию.",
  },
  {
    title: "Наглядный и живой прогресс",
    body: "Развивайте свои направления, получайте достижения, отслеживайте рост и видите, как маленькие действия складываются в результат.",
  },
  {
    title: "Удобство и комфорт",
    body: "Мы хотим сделать путь к цели понятным, визуальным и поддерживающим.",
  },
];

const FocusPlantAchievementNotification = () => (
  <article
    className="home-focus-preview__achievement-toast achievement-toast achievement-toast--legendary achievement-toast--has-plant"
    aria-label="Получено достижение"
  >
    <button
      className="achievement-toast__close"
      type="button"
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
          <h3 className="achievement-toast__title">Садовник фокуса</h3>
          <p className="achievement-toast__description">
            Заверши продуктивную сессию и открой новую награду
          </p>
        </div>
      </div>
    </div>

    <div
      className="achievement-toast__rewards achievement-toast__rewards--has-plant"
      aria-label="Награда за достижение"
    >
      <div className="achievement-toast__reward-card achievement-toast__reward-card--plant achievement-toast__reward-card--legendary">
        <div className="achievement-toast__plant-picture" aria-hidden="true">
          <img src="/rainbow_eucalyptus/rainbow_eucalyptus_medium.png" alt="" />
        </div>

        <div className="achievement-toast__reward-content">
          <span className="achievement-toast__reward-label">Открыто растение</span>
          <strong className="achievement-toast__reward-value">
            Радужный эвкалипт
          </strong>
          <span className="achievement-toast__rarity achievement-toast__rarity--legendary">
            Легендарная
          </span>
        </div>
      </div>

      <div className="achievement-toast__reward-card achievement-toast__reward-card--xp">
        <div className="achievement-toast__xp-icon" aria-hidden="true">
          XP
        </div>

        <div className="achievement-toast__reward-content">
          <span className="achievement-toast__reward-label">Начислено опыта</span>
          <strong className="achievement-toast__reward-value">+120 XP</strong>
        </div>
      </div>
    </div>
  </article>
);

const RewardCard = ({ item }) => {
  return (
    <article className={`home-reward-card home-reward-card--${item.tone}`}>
      <div className="home-reward-card__head">
        <span className="home-reward-card__tag">{item.tag}</span>
        <span className="home-reward-card__progress">{item.progress}</span>
      </div>

      <h3>{item.title}</h3>
      <p>{item.description}</p>

      <div className="home-reward-card__footer">
        <span>{item.reward}</span>
        <strong>Достижение</strong>
      </div>
    </article>
  );
};

const TopicCardPreview = ({ item }) => {
  return (
    <div className={`home-list-cards-preview__item ${item.className}`}>
      <ListCard
        name={item.name}
        level={item.level}
        image={item.image}
        plant_name={item.plant_name}
        rarity={item.rarity}
        current_progress_xp={item.current_progress_xp}
        current_max_xp={item.current_max_xp}
        progress_width={item.progress_width}
        last_reviewed={item.last_reviewed}
      />
    </div>
  );
};

const FeatureTitle = ({ accent, title }) => {
  return (
    <h2 className="feature-section__h2">
      <span>
        {accent}
        <br />
      </span>
      <span>
        {title}
        <br />
      </span>
    </h2>
  );
};

const FeatureButton = ({ onClick }) => {
  return (
    <button className="feature-section__cta" type="button" onClick={onClick}>
      Начать бесплатно
    </button>
  );
};

const FriendPreview = ({ friend }) => {
  return (
    <div className="home-friends-preview__friend">
      <div className="home-friends-preview__avatar">{friend.letter}</div>
      <div>
        <strong>{friend.name}</strong>
        <span>Уровень {friend.level}</span>
      </div>
      <em>Профиль</em>
    </div>
  );
};

const HowStep = ({ step }) => {
  return (
    <div className="how__step">
      <span className="how__num">{step.number}</span>
      <h3 className="how__title">{step.title}</h3>
      <p className="how__body">{step.body}</p>
    </div>
  );
};

const GoalCard = ({ goal }) => {
  return (
    <article className="goal-card">
      <h3>{goal.title}</h3>
      <p>{goal.body}</p>
    </article>
  );
};

const Home = () => {
  const navigate = useNavigate();
  const [showScrollDown, setShowScrollDown] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollDown(window.scrollY < 80);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleLoginClick = () => {
    navigate("/login");
  };

  const handleScrollDownClick = (event) => {
    event.preventDefault();
    setShowScrollDown(false);
    document.getElementById("features")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <Header />

      <section className="hero" id="hero">
        <div className="shell">
          <div className="hero__content">
            <div className="hero__text">
              <h1>
                Взращивай
                <br />
                свои знания
              </h1>

              <p className="hero__lead">
                Алгоритм интервального повторения и наглядная визуализация
                прогресса. Вы видите, какие темы закреплены, какие увядают и что
                требует внимания.
              </p>

              <p className="hero__subtext">
                Система обучения с интервальным повторением и визуализацией
                прогресса
              </p>

              <button
                className="hero__cta"
                type="button"
                onClick={handleLoginClick}
              >
                Попробовать прямо сейчас
              </button>
            </div>

            <div className="hero__plant-wrap" aria-hidden="true">
              <img className="hero__plant" src={img} alt="" />
            </div>
          </div>
        </div>

        <a
          className={`scroll-down${showScrollDown ? "" : " scroll-down--hidden"}`}
          href="#features"
          aria-label="Прокрутить ниже"
          onClick={handleScrollDownClick}
        >
          <span />
        </a>
      </section>

      <div className="stats-bar" id="features">
        <div className="shell stats-bar__inner">
          <div className="stats-bar__item">
            <span className="stats-bar__val">30+</span>
            <span className="stats-bar__label">видов растений</span>
          </div>

          <div className="stats-bar__item">
            <span className="stats-bar__val">50+</span>
            <span className="stats-bar__label">достижений</span>
          </div>

          <div className="stats-bar__item">
            <span className="stats-bar__val">∞</span>
            <span className="stats-bar__label">тем для роста</span>
          </div>

          <div className="stats-bar__item">
            <span className="stats-bar__val">1</span>
            <span className="stats-bar__label">сад — твой</span>
          </div>
        </div>
      </div>

      <section className="feature-section feature-section--ltr feature-section--garden">
        <div className="shell feature-section__inner">
          <div className="feature-section__copy">
            <FeatureTitle accent="Коллекционируй" title="растения" />

            <p className="feature-section__body">
              Коллекционируй, открывай редкие растения и собирай собственный сад
              прогресса. Каждая новая тема становится живым элементом коллекции,
              а обучение превращается в игру, где хочется возвращаться снова
            </p>

            <FeatureButton onClick={handleLoginClick} />
          </div>

          <div className="feature-section__media">
            <div
              className="home-list-cards-preview"
              aria-label="Примеры карточек тем"
            >
              {topicCards.map((item) => (
                <TopicCardPreview item={item} key={item.name} />
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="feature-section feature-section--rtl feature-section--rewards">
        <div className="shell feature-section__inner">
          <div className="feature-section__copy">
            <FeatureTitle accent="Получай" title="награды" />

            <p className="feature-section__body">
              Получай награды, закрывай цели и прокачивай свой аккаунт за
              реальные действия. Достижения, XP и новые растения помогают видеть
              результат и делают каждый шаг заметным и приятным
            </p>

            <FeatureButton onClick={handleLoginClick} />
          </div>

          <div className="feature-section__media">
            <div className="home-rewards-preview" aria-label="Пример наград">
              <div className="home-rewards-preview__ribbon home-rewards-preview__ribbon--top">
                {rewardRibbonTop.map((item) => (
                  <RewardCard item={item} key={item.title} />
                ))}
              </div>

              <div className="home-rewards-preview__ribbon home-rewards-preview__ribbon--bottom">
                {rewardRibbonBottom.map((item) => (
                  <RewardCard item={item} key={item.title} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="feature-section feature-section--ltr feature-section--focus">
        <div className="shell feature-section__inner">
          <div className="feature-section__copy">
            <FeatureTitle accent="Фокусируйся" title="и расти" />

            <p className="feature-section__body">
              Фокусируйся, отмечай победы и получай XP за каждый шаг вперёд.
              Таймер зафиксирует продуктивную сессию, а ИИ оценит твои успехи и
              превратит реальные дела в рост твоего растения
            </p>

            <FeatureButton onClick={handleLoginClick} />
          </div>

          <div className="feature-section__media">
            <div
              className="home-focus-preview"
              aria-label="Демонстрация фокус-сессии"
            >
              <div className="home-focus-preview__xp-card">
                <div className="home-focus-preview__xp-icon">✦</div>
                <div>
                  <span>Опыт зачислен</span>
                  <strong>+330 XP</strong>
                  <p>Выполнение задачи</p>
                </div>
              </div>

              <FocusPlantAchievementNotification />

              <div className="home-focus-preview__growth-modal">
                <div
                  className="home-focus-preview__growth-shine"
                  aria-hidden="true"
                />

                <h3 className="home-focus-preview__growth-title">
                  Рост завершён !
                </h3>

                <p className="home-focus-preview__growth-name">Мудрый дуб</p>

                <div className="home-focus-preview__growth-plant-wrap">
                  <div
                    className="home-focus-preview__growth-plant-glow"
                    aria-hidden="true"
                  />
                  <img
                    className="home-focus-preview__growth-plant"
                    src="/wise_oak/wise_oak_medium.png"
                    alt="Мудрый дуб"
                  />
                </div>

                <p className="home-focus-preview__growth-caption">
                  Новый этап роста
                </p>

                <h4 className="home-focus-preview__growth-stage">
                  Молодое растение
                </h4>

                <div className="home-focus-preview__growth-steps">
                  <div className="home-focus-preview__growth-step home-focus-preview__growth-step--done">
                    <div className="home-focus-preview__growth-circle">
                      <img
                        src="/card-icons/stage-seedling.svg"
                        alt=""
                        aria-hidden="true"
                      />
                    </div>
                    <span>Росток</span>
                  </div>

                  <img
                    className="home-focus-preview__growth-arrow"
                    src="/card-icons/stage-arrow.svg"
                    alt=""
                    aria-hidden="true"
                  />

                  <div className="home-focus-preview__growth-step home-focus-preview__growth-step--active">
                    <div className="home-focus-preview__growth-circle">
                      <img
                        src="/card-icons/stage-young.svg"
                        alt=""
                        aria-hidden="true"
                      />
                    </div>
                    <span>
                      Молодое
                      <br />
                      растение
                    </span>
                  </div>

                  <img
                    className="home-focus-preview__growth-arrow"
                    src="/card-icons/stage-arrow-2.svg"
                    alt=""
                    aria-hidden="true"
                  />

                  <div className="home-focus-preview__growth-step home-focus-preview__growth-step--next">
                    <div className="home-focus-preview__growth-circle">
                      <img
                        src="/card-icons/stage-adult.svg"
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

                <button className="home-focus-preview__growth-button" type="button">
                  Продолжить
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="feature-section feature-section--rtl feature-section--friends">
        <div className="shell feature-section__inner">
          <div className="feature-section__copy">
            <FeatureTitle accent="Соревнуйся" title="с друзьями" />

            <p className="feature-section__body">
              Добавляй друзей, сравнивай прогресс и поддерживай мотивацию
              вместе. Соревнуйся по уровню, следи за успехами других и превращай
              обучение в движение вперед
            </p>

            <FeatureButton onClick={handleLoginClick} />
          </div>

          <div className="feature-section__media">
            <div className="home-friends-preview" aria-label="Пример друзей">
              <div className="home-friends-preview__glow" aria-hidden="true" />

              <div className="home-friends-preview__panel home-friends-preview__panel--list">
                <div className="home-friends-preview__panel-head home-friends-preview__panel-head--green">
                  <h3>Мои друзья</h3>
                  <span>3</span>
                </div>

                {friends.map((friend) => (
                  <FriendPreview friend={friend} key={friend.name} />
                ))}
              </div>

              <div className="home-friends-preview__panel home-friends-preview__panel--requests">
                <div className="home-friends-preview__panel-head home-friends-preview__panel-head--purple">
                  <h3>Заявки</h3>
                  <span>2</span>
                </div>

                <div className="home-friends-preview__request">
                  <div className="home-friends-preview__avatar home-friends-preview__avatar--purple">
                    D
                  </div>
                  <div>
                    <strong>Dasha</strong>
                    <span>хочет добавить вас</span>
                  </div>
                  <em>Принять</em>
                </div>
              </div>

              <div className="home-friends-preview__score-card">
                <span>Твой прогресс</span>
                <strong>65 LVL</strong>
                <p>+7 уровней за неделю</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="how" id="how">
        <div className="shell">
          <h2 className="section-title">Три шага к живому саду знаний</h2>

          <div className="how__steps">
            {howSteps.map((step) => (
              <HowStep step={step} key={step.number} />
            ))}
          </div>
        </div>
      </section>

      <section className="about-goals" id="about-goals">
        <div className="shell">
          <h2 className="section-title">Наши цели и возможности</h2>

          <div className="goals-grid">
            {goals.map((goal) => (
              <GoalCard goal={goal} key={goal.title} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default Home;
