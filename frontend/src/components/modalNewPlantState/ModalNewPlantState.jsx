import { createPortal } from "react-dom";
import "./style.css";
import Confetti from "../confetti/Confetti";
import StagesGrowth from "../stagesGrowth/StagesGrowth";

const stage_title = {
  seed: "Саженец",
  young: "Молодое растение",
  adult: "Взрослое растение",
};

export default function ModalNewPlantState({ onClose, img, state, name }) {
  const stageTitle = stage_title[state] || "Новый этап роста";

  return createPortal(
    <div className="growth-modal-overlay">
      <div className="growth-modal-confetti">
        <Confetti />
      </div>

      <div className="growth-modal">
        <h2 className="growth-modal__title">Рост завершён !</h2>

        <div className="growth-modal__plant-name">
          <span />
          {name}
          <span />
        </div>

        <div className="growth-modal__plant-wrap">
          <div className="growth-modal__plant-glow" />
          <img
            className="growth-modal__plant-img"
            src={img}
            alt={name || "Растение"}
          />
        </div>

        <div className="growth-modal__divider" />

        <div className="growth-modal__caption">Новый этап роста</div>
        <h3 className="growth-modal__stage-title">{stageTitle}</h3>

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
