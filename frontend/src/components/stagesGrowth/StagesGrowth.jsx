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

const StagesGrowth = ({ state }) => {
  return (
    <div className="topic-stage__steps">
      <div
        className={`${state === "seed" ? "topic-stage__step topic-stage__step--active" : "topic-stage__step topic-stage__step--done"} `}
      >
        <div className="topic-stage__circle">
          <img
            className="topic-icon topic-icon--stage-seedling"
            src={ICONS.stageSeedling}
            alt=""
            aria-hidden="true"
          />
        </div>
        <span className="topic-stage__label">Росток</span>
      </div>

      <img
        className="topic-icon topic-stage__arrow"
        src={ICONS.stageArrow}
        alt=""
        aria-hidden="true"
      />

      <div
        className={`${state === "young" ? "topic-stage__step topic-stage__step--active" : state === "seed" ? "topic-stage__step topic-stage__step--next" : "topic-stage__step topic-stage__step--done"} `}
      >
        <div className="topic-stage__circle">
          <img
            className="topic-icon topic-icon--stage-young"
            src={ICONS.stageYoung}
            alt=""
            aria-hidden="true"
          />
        </div>
        <span className="topic-stage__label">
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
        className={`${state === "adult" ? "topic-stage__step topic-stage__step--active" : "topic-stage__step topic-stage__step--next"} `}
      >
        <div className="topic-stage__circle">
          <img
            className="topic-icon topic-icon--stage-adult"
            src={ICONS.stageAdult}
            alt=""
            aria-hidden="true"
          />
        </div>
        <span className="topic-stage__label">
          Взрослое
          <br />
          растение
        </span>
      </div>
    </div>
  );
};

export default StagesGrowth;
