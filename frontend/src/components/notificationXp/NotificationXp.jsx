import { useEffect, useState } from "react";
import "./style.css";

const NotificationXp = ({ xp, text, onClose }) => {
  const [isClosing, setIsClosing] = useState(false);

  const closeWithAnimation = () => {
    setIsClosing(true);

    setTimeout(() => {
      onClose();
    }, 420);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      closeWithAnimation();
    }, 7000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <article
      className={`xp-toast ${isClosing ? "xp-toast--closing" : ""}`}
      aria-label="Начислен опыт"
    >
      <button
        className="xp-toast__close"
        type="button"
        onClick={closeWithAnimation}
        aria-label="Закрыть уведомление"
      >
        ×
      </button>

      <div className="xp-toast__icon" aria-hidden="true">
        <span className="xp-toast__icon-star">✦</span>
      </div>

      <div className="xp-toast__content">
        <span className="xp-toast__label">Опыт зачислен</span>
        <strong className="xp-toast__value">+{xp} XP</strong>
        <p className="xp-toast__text">{text}</p>
      </div>
    </article>
  );
};

export default NotificationXp;
