import "./achieve.css";
import Header from "../../components/header/Header";
import trophyImg from "./trphu.png";
import lockImg from "./lock.png";


export const achievements = [
  {
    id: 1,
    title: "Повторять тему 7 дней подряд",
    xp: "170xp",
    icon: trophyImg,
    unlocked: true,
  },
  { id: 2, title: "", xp: "", unlocked: false, lockedText: "Заблокировано" },
  { id: 3, title: "", xp: "", unlocked: false, lockedText: "Заблокировано" },
  { id: 4, title: "", xp: "", unlocked: false, lockedText: "Заблокировано" },
  { id: 5, title: "", xp: "", unlocked: false, lockedText: "Заблокировано" },
  { id: 6, title: "", xp: "", unlocked: false, lockedText: "Заблокировано" },
  { id: 7, title: "", xp: "", unlocked: false, lockedText: "Заблокировано" },
  { id: 8, title: "", xp: "", unlocked: false, lockedText: "Заблокировано" },
  { id: 9, title: "", xp: "", unlocked: false, lockedText: "Заблокировано" },
  { id: 10, title: "", xp: "", unlocked: false, lockedText: "Заблокировано" },
  { id: 11, title: "", xp: "", unlocked: false, lockedText: "Заблокировано" },
  { id: 12, title: "", xp: "", unlocked: false, lockedText: "Заблокировано" },
];

export default function AchievePage() {
  return (
    <div className="achieve-page">
      <div className="achieve-bg" />

      <Header />

      <main className="achieve-main">
        <h1 className="achieve-title">Достижения</h1>

        <section className="achieve-grid">
          {achievements.map((item) => (
            <article
              key={item.id}
              className={`achievement-card ${
                item.unlocked ? "achievement-card--active" : "achievement-card--locked"
              }`}
            >
              {item.unlocked ? (
                <>
                  <span className="achievement-card__xp">{item.xp}</span>
                  <h3 className="achievement-card__title">{item.title}</h3>
                  <img
                    className="achievement-card__icon"
                    src={item.icon}
                    alt={item.title}
                  />
                </>
              ) : (
                <div className="achievement-card__locked-content">
                  {item.icon && (
                    <img
                      className="achievement-card__lock-icon"
                      src={item.icon}
                      alt="Заблокировано"
                    />
                  )}
                  <p className="achievement-card__locked-text">
                    {item.lockedText || "Заблокировано"}
                  </p>
                </div>
              )}
              
            </article>
          ))}
        </section>
      </main>
    </div>
  );
}