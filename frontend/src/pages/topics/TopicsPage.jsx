import Header from "../../components/header/Header";
import ModalAddTopic from "../../components/modalsAddCard/ModalAddTopic";
import "./style.css";
import { useEffect, useState } from "react";
import { getTopics } from "../../api/auth";
import ListCard from "../../components/card/ListCard";
import { useNavigate } from "react-router-dom";

const TopicsPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [topics, setTopics] = useState([]);
  const [message, setMessage] = useState("Загрузка...");
  const navigate = useNavigate();

  useEffect(() => {
    loadTopics();
  }, []);

  const loadTopics = async () => {
    try {
      const data = await getTopics();

      const sortedTopics = [...data].sort((a, b) => b.id - a.id);

      setTopics(sortedTopics);
      setMessage("");
    } catch (error) {
      setMessage(error.message || "Неизвестная ошибка загрузки тем");
    }
  };

  return (
    <>
      <Header />

      <main className="topics-page">
        <section className="topics-section">
          <div className="topics-section__container">
            <h1 className="topics-section__title">Ваши темы</h1>

            {message && <p className="topics-section__message">{message}</p>}

            <div className="topics-grid">
              {topics.map((topic) => {
                return (
                  <ListCard
                    key={topic.id}
                    name={topic.name}
                    description={topic.description}
                    level={topic.level}
                    xp={topic.xp}
                    onClick={() => navigate(`/topics/${topic.id}`)}
                    image={topic.image_url}
                    plant_name={topic.tree_type}
                    rarity={topic.rarity}
                    current_progress_xp={topic.current_progress_xp}
                    current_max_xp={topic.current_max_xp}
                    last_reviewed={topic.last_reviewed}
                  />
                );
              })}

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
            </div>
          </div>
        </section>
      </main>

      {isModalOpen && (
        <ModalAddTopic
          onClose={() => setIsModalOpen(false)}
          onCreated={loadTopics}
        />
      )}
    </>
  );
};

export default TopicsPage;
