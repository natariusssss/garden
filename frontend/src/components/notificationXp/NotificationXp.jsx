import { useEffect, useState } from "react";
import "./style.css";

export default function NotificationXp({
  xp,
  text = "Опыт зачислен",
  onClose,
}) {
  const [isClosing, setIsClosing] = useState(false);

  const closeWithAnimation = () => {
    setIsClosing(true);

    setTimeout(() => {
      onClose();
    }, 450);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      closeWithAnimation();
    }, 7000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={`xp-toast ${isClosing ? "xp-toast--closing" : ""}`}>
      <button className="xp-toast__close" onClick={closeWithAnimation}>
        ×
      </button>

      <div className="xp-toast__icon">
        <span>✦</span>
      </div>

      <div className="xp-toast__content">
        <div className="xp-toast__label">Опыт зачислен</div>
        <div className="xp-toast__xp">+{xp} XP</div>
        <div className="xp-toast__text">{text}</div>
      </div>

      <div className="xp-toast__sparkles">✦</div>
    </div>
  );
}