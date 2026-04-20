import { useState } from "react";
import { createPortal } from "react-dom";
import "./style.css";
import { createTopic } from "../../api/auth";
import sakuraBig from "../../assets/sakura/sakura_big.png";
import plants from "../../assets/characteristics_tree/characteristics_tree.jsx";
import CarouselCard from "../carouselCard/CarouselCard.jsx";

const ModalAddTopic = ({ onClose, onCreated }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [message, setMessage] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [selectedPlant, setSelectedPlant] = useState(plants[0].id);

  const currentPlant = plants.find((plant) => plant.id === selectedPlant);
  const image_url = plants.find((plant) => plant.id === selectedPlant).imgBig;
  const rarity = plants.find((plant) => plant.id === selectedPlant).rarity;
  const tree_type = plants.find((plant) => plant.id === selectedPlant).name;

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage("");

    try {
      const newTopic = await createTopic({
        name: title,
        description,
        image_url,
        rarity,
        tree_type
      });

      if (onCreated) {
        onCreated(newTopic);
      }

      onClose();
    } catch (error) {
      setMessage(error.message || "Ошибка добавления темы");
    }
  };

  return createPortal(
    <div className="dialog">
      <div className="dialog-content">
        <div className="topic-modal">
          <div className="topic-modal__divider" aria-hidden="true"></div>

          <form className="topic-modal__left" onSubmit={handleSubmit}>
            <h2 className="topic-modal__title">Создание темы</h2>

            <div className="topic-modal__field topic-modal__field--title">
              <div className="topic-modal__field-head">
                <h3 className="topic-modal__field-title">Название темы</h3>
                <span className="topic-modal__counter">
                  {title.length} / 15
                </span>
              </div>

              <input
                className="topic-modal__input"
                type="text"
                placeholder="Введите название темы"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
              />
            </div>

            <div className="topic-modal__field topic-modal__field--description">
              <div className="topic-modal__field-head">
                <h3 className="topic-modal__field-title">Описание для темы</h3>
                <span className="topic-modal__counter">
                  {description.length} / 100
                </span>
              </div>

              <textarea
                className="topic-modal__textarea"
                placeholder="Введите описание темы"
                value={description}
                onChange={(event) => setDescription(event.target.value)}
              />
            </div>

            <div className="topic-modal__tips">
              <div className="topic-modal__tips-head">
                <span className="topic-modal__tips-icon" aria-hidden="true">
                  ⌘
                </span>
                <span className="topic-modal__tips-title">Советы</span>
              </div>

              <ul className="topic-modal__tips-list">
                <li>
                  Название может отражать настроение, идею или особенность
                  вашего сада
                </li>
                <li>Описание поможет вам и другим лучше понять вашу тему</li>
                <li>Вы можете отредактировать тему позже</li>
              </ul>
            </div>

            <div className="topic-modal__actions">
              <button className="topic-modal__submit" type="submit">
                Создать тему
              </button>

              <button
                className="topic-modal__cancel"
                type="button"
                onClick={onClose}
              >
                Отмена
              </button>
            </div>

            {message && <p className="topic-modal__message">{message}</p>}
          </form>

          <section className="topic-modal__right">
            <h2 className="topic-modal__title topic-modal__title--right">
              Выбор растения
            </h2>

            <h3 className="topic-modal__selected-title">Выбранное растение</h3>

            <article className="topic-modal__selected-card">
              <div className="topic-modal__selected-visual">
                <div className="topic-modal__selected-glow"></div>
                <img
                  src={currentPlant?.imgBig}
                  alt="Растение"
                  className="topic-modal__selected-image"
                />
              </div>

              <div className="topic-modal__selected-info">
                <div className="topic-modal__selected-topline">
                  <h4 className="topic-modal__selected-name">
                    {currentPlant?.name}
                  </h4>
                  <span
                    className={`topic-modal__badge topic-modal__badge--featured 
                      ${
                        currentPlant.rarityClass == "common"
                          ? "topic-modal__badge topic-modal__badge--featured-common"
                          : currentPlant.rarityClass == "rare"
                            ? "topic-modal__badge topic-modal__badge--featured-rare"
                            : currentPlant.rarityClass == "epic"
                              ? "topic-modal__badge topic-modal__badge--featured-epic"
                              : "topic-modal__badge topic-modal__badge--featured-ledendary"
                      }`}
                  >
                    {currentPlant?.rarity}
                  </span>
                </div>

                <p className="topic-modal__selected-description">
                  Нежное дерево с розовыми цветами, символ весны и обновления.
                  Наполняет сад гармонией и умиротворением.
                </p>

                <p className="topic-modal__selected-type">Вид: дерево</p>

                <div className="topic-modal__chosen">
                  <span
                    className="topic-modal__chosen-check"
                    aria-hidden="true"
                  >
                    ✓
                  </span>
                  <span>Выбрано</span>
                </div>
              </div>
            </article>

            <section className="topic-modal__plants">
              <h3 className="topic-modal__plants-title">Доступные растения</h3>
              <p className="topic-modal__plants-subtitle">
                Выберите растение для вашей темы
              </p>
              <span className="topic-modal__plants-count">
                {plants.length} растений
              </span>

              <div className="topic-modal__filters" aria-hidden="true">
                <span
                  className={`topic-modal__filter topic-modal__filter--all ${selectedFilter === "all" ? "topic-modal__filter--active" : ""} `}
                  onClick={() => setSelectedFilter("all")}
                >
                  Все
                </span>
                <span
                  className={`topic-modal__filter topic-modal__filter--common ${selectedFilter === "common" ? "topic-modal__filter--active" : ""}`}
                  onClick={() => setSelectedFilter("common")}
                >
                  Обычное
                </span>
                <span
                  className={`topic-modal__filter topic-modal__filter--rare ${selectedFilter === "rare" ? "topic-modal__filter--active" : ""}`}
                  onClick={() => setSelectedFilter("rare")}
                >
                  Редкое
                </span>
                <span
                  className={`topic-modal__filter topic-modal__filter--epic ${selectedFilter === "epic" ? "topic-modal__filter--active" : ""}`}
                  onClick={() => setSelectedFilter("epic")}
                >
                  Эпическое
                </span>
                <span
                  className={`topic-modal__filter topic-modal__filter--legendary ${selectedFilter === "legendary" ? "topic-modal__filter--active" : ""}`}
                  onClick={() => setSelectedFilter("legendary")}
                >
                  Легендарное
                </span>
              </div>

              <div className="topic-modal__carousel">
                <button
                  type="button"
                  className="topic-modal__arrow topic-modal__arrow--left"
                >
                  ‹
                </button>

                <div className="topic-modal__cards">
                  {plants.map((plant) => {
                    return plant.rarityClass === selectedFilter ||
                      selectedFilter === "all" ? (
                      <CarouselCard
                        key={plant.id}
                        onClick={() => setSelectedPlant(plant.id)}
                        id={plant.id}
                        selected={selectedPlant == plant.id ? true : false}
                        name={plant.name}
                        rarity={plant.rarity}
                        rarityClass={plant.rarityClass}
                      />
                    ) : null;
                  })}
                </div>

                <button
                  type="button"
                  className="topic-modal__arrow topic-modal__arrow--right"
                >
                  ›
                </button>
              </div>
            </section>
          </section>
        </div>
      </div>
    </div>,
    document.getElementById("modal"),
  );
};

export default ModalAddTopic;
