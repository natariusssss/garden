import { createPortal } from "react-dom";
import "./style.css";
import Confetti from "../confetti/Confetti";

const ICONS = {
  stageArrow: "/card-icons/stage-arrow.svg",
};

export default function ModalsLevelUp({
  onClose,
  newLevel,
  oldLevel,
  currentMaxXp,
  currentProgress,
}) {
  return createPortal(
    <div className="level-modal-overlay">
      <div className="level-modal-confetti">
        <Confetti />
      </div>

      <div className="level-modal">
        <h2 className="level-modal__title">Новый уровень !</h2>

        <div className="level-modal__number">{newLevel}</div>
        <div className="level-modal__label">LVL</div>

        <div className="level-modal__change">
          <span>{oldLevel}</span>
          <img className="level-modal__arrow" src={ICONS.stageArrow} alt="" />
          <span className="level-modal__green">{newLevel}</span>
        </div>

        <div className="level-modal__divider" />

        <p className="level-modal__text">Ваши знания ближе к совершенству</p>

        <div className="level-modal__xp">
          <span className="level-modal__green">{currentProgress}</span>
          <span>/ {currentMaxXp} XP</span>
        </div>

        <button className="level-modal__button" onClick={onClose}>
          Продолжить
        </button>
      </div>
    </div>,
    document.getElementById("modalLevelUp"),
  );
}
