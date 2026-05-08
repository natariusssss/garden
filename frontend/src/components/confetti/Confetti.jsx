import { useMemo } from "react";
import "./style.css";

const CONFETTI_COLORS = [
  "#b1ca7e",
  "#e75480",
  "#7851a9",
  "#538fea",
  "#ffd37a",
  "#ffffff",
];

const createConfetti = () => {
  return Array.from({ length: 55 }, (_, index) => ({
    id: index,
    left: `${Math.random() * 100}%`,

    top: `${-500 + Math.random() * 900}px`,

    delay: `${Math.random() * 2.2}s`,

    duration: `${7.5 + Math.random() * 3.5}s`,
    size: `${9 + Math.random() * 10}px`,
    rotate: `${Math.random() * 360}deg`,
    drift: `${-95 + Math.random() * 190}px`,
    color: CONFETTI_COLORS[index % CONFETTI_COLORS.length],
  }));
};

const Confetti = () => {
  const confetti = useMemo(() => createConfetti(), []);
  return (
    <div className="level-confetti" aria-hidden="true">
      {confetti.map((item) => (
        <span
          key={item.id}
          className="level-confetti__piece"
          style={{
            "--confetti-left": item.left,
            "--confetti-top": item.top,
            "--confetti-delay": item.delay,
            "--confetti-duration": item.duration,
            "--confetti-size": item.size,
            "--confetti-rotate": item.rotate,
            "--confetti-drift": item.drift,
            "--confetti-color": item.color,
          }}
        />
      ))}
    </div>
  );
};

export default Confetti;
