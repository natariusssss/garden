import Header from "../../components/header/Header";
import ModalAddTopic from "../../components/modalsAddCard/ModalAddTopic";
import "./style.css";
import { useEffect, useState } from "react";
import { getTopics } from "../../api/auth";
import ListCard from "../../components/card/ListCard";

const TopicsPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [topics, setTopics] = useState([]);
  const [message, setMessage] = useState("Загрузка...");

  useEffect(() => {
    async function loadTopics() {
      try {
        const data = await getTopics();
        setTopics(data);
        setMessage("");
      } catch (error) {
        setMessage(error.message);
      }
    }
    loadTopics();
  }, [topics]);

  return (
    <>
      <Header />
      <main className="topics-page">
        <section className="topics-section">
          <div className="topics-section__container">
            <h1 className="topics-section__title">Ваши темы и связи</h1>

            <div className="topics-grid">
              <button
                onClick={() => setIsModalOpen(true)}
                className="add-topic-card"
                type="button"
                aria-label="Добавить тему"
              >
                <span className="add-topic-card__plus"></span>
                <span className="add-topic-card__text">
                  Нажмите, чтобы добавить тему
                </span>
              </button>
              {topics.map((topic, index) => {
              return (
                <ListCard
                  key={topic.id}
                  name={topic.name}
                  description={topic.description}
                  index={topic.id}
                />
              );
            })}
            </div>
            
          </div>
        </section>
      </main>
      {isModalOpen && <ModalAddTopic onClose={() => setIsModalOpen(false)} />}
    </>
  );
};

export default TopicsPage;
