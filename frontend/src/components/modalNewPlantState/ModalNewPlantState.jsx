import { createPortal } from "react-dom";
import "./style.css";
import Confetti from "../confetti/Confetti";
import StagesGrowth from "../stagesGrowth/StagesGrowth";

export default function ModalNewPlantState({ onClose, img, state, name }) {
  return createPortal(
    <div className="growth-modal-overlay">
      <Confetti />
      <div className="growth-modal">
        <h2 className="growth-modal__title">Рост завершён !</h2>

        <div className="growth-modal__plant-name">
          <span /> {name} <span />
        </div>

        <div className="growth-modal__plant-wrap">
          <div className="growth-modal__plant-glow" />
          <img className="growth-modal__plant-img" src={img} alt="Сакура" />
        </div>

        <div className="growth-modal__divider" />

        <div className="growth-modal__caption">Новый этап роста</div>

        <h3 className="growth-modal__stage-title">Взрослое растение</h3>

        <div className="growth-modal__stages">
          <StagesGrowth state={state} />
        </div>

        <button className="growth-modal__button" onClick={onClose}>
          Продолжить
        </button>
      </div>
    </div>,
    document.getElementById("modalGrowthUp"),
  );
}
