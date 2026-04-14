import Header from "../../components/header/Header";
import ModalAddTopic from "../../components/modalsAddCard/ModalAddTopic";
import "./style.css";
import img from "./tree.png";
import { useState } from "react";

const TopicsPage = () => {
   const [isModalOpen, setIsModalOpen] = useState(false);
  return (
        <>
        <Header/>
        <main className="topics-page">
    <section className="topics-section">
      <div className="topics-section__container">
        <h1 className="topics-section__title">Ваши темы и связи</h1>

        <div className="topics-grid">
          <button onClick={()=>setIsModalOpen(true)} className="add-topic-card" type="button" aria-label="Добавить тему">
            <span className="add-topic-card__plus"></span>
            <span className="add-topic-card__text">Нажмите, чтобы добавить тему</span>
          </button>
        </div>
      </div>
    </section>
  </main>
  {isModalOpen && <ModalAddTopic onClose={() => setIsModalOpen(false)} />}
    
    </>
  );
};

export default TopicsPage;