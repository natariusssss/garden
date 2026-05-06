import { createPortal } from "react-dom";
import "./style.css";
import { createTopic, updateTopicById } from "../../api/auth";
import { useEffect, useRef, useState } from "react";
import sakuraBig from "../../assets/sakura/sakura_big.png";
import plants from "../../data/plants.js";
import CarouselCard from "../carouselCard/CarouselCard.jsx";

const ModalAddTopic = ({
  onClose,
  onCreated,
  mode,
  name,
  title,
  descriptionEdit,
  id,
}) => {
  const [topicName, setTopicName] = useState("");
  const [description, setDescription] = useState("");
  const [message, setMessage] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [selectedPlant, setSelectedPlant] = useState(plants[0].id);
  const [currentPage, setCurrentPage] = useState(0);
  const [buttonModeName, setButtonModeName] = useState("Создать тему");
  const [editTitle, setEditTitle] = useState("Создать тему");

  useEffect(() => {
    if (mode === "edit") {
      setTopicName(name || "");
      setDescription(descriptionEdit || "");
      setButtonModeName("Сохранить");
      setEditTitle(title || "");
    }
  }, [mode, name, descriptionEdit, title]);

  const currentPlant = plants.find((plant) => plant.id === selectedPlant);
  const image_url = plants.find((plant) => plant.id === selectedPlant).imgSmall;
  const rarity = plants.find((plant) => plant.id === selectedPlant).rarity;
  const tree_type = plants.find((plant) => plant.id === selectedPlant).name;

  const slideDirectionRef = useRef("");

  const filtredPlants =
    selectedFilter === "all"
      ? plants
      : plants.filter((plant) => plant.rarityClass === selectedFilter);

  const sliceArray = filtredPlants.slice(currentPage * 4, currentPage * 4 + 4);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage("");
    if (mode === "edit") {
      try {
        await updateTopicById(id, {
          name: topicName,
          description,
          image_url,
          rarity,
          tree_type,
        });
        await onCreated();
        onClose();
      } catch (error) {
        setMessage(error.message || "Ошибка добавления темы");
      }
    } else {
      try {
        await createTopic({
          name: topicName,
          description,
          image_url,
          rarity,
          tree_type,
        });
        await onCreated();

        onClose();
      } catch (error) {
        setMessage(error.message || "Ошибка добавления темы");
      }
    }
  };

  return createPortal(
    <div className="dialog">
      <div className="dialog-content">
        <div className="topic-modal">
          <button
            type="button"
            className="topic-modal__close"
            onClick={onClose}
            aria-label="Закрыть"
          >
            <svg
              className="topic-modal__close-icon"
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden="true"
            >
              <path d="M18 6L6 18" />
              <path d="M6 6L18 18" />
            </svg>
          </button>
          <div className="topic-modal__divider" aria-hidden="true"></div>

          <form className="topic-modal__left" onSubmit={handleSubmit}>
            <h2 className="topic-modal__title">{editTitle}</h2>

            <div className="topic-modal__field topic-modal__field--title">
              <div className="topic-modal__field-head">
                <h3 className="topic-modal__field-title">Название темы</h3>
                <span className="topic-modal__counter">
                  {topicName.length} / 15
                </span>
              </div>

              <input
                className="topic-modal__input"
                type="text"
                placeholder="Введите название темы"
                value={topicName}
                onChange={(event) => setTopicName(event.target.value)}
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
                {buttonModeName}
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

            <article className="topic-modal__selected-card" key={selectedPlant}>
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
                    className={`topic-modal__badge topic-modal__badge--featured topic-modal__badge--featured-${currentPlant?.rarityClass}`}
                  >
                    {currentPlant?.rarity}
                  </span>
                </div>

                <p className="topic-modal__selected-description">
                  {currentPlant?.description}
                </p>

                <p className="topic-modal__selected-type">
                  Вид: {currentPlant?.type}
                </p>

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
                {filtredPlants.length} растений
              </span>

              <div className="topic-modal__filters" aria-hidden="true">
                <span
                  className={`topic-modal__filter topic-modal__filter--all ${selectedFilter === "all" ? "topic-modal__filter--active" : ""} `}
                  onClick={() => {
                    setSelectedFilter("all");
                    setCurrentPage(0);
                  }}
                >
                  Все
                </span>
                <span
                  className={`topic-modal__filter topic-modal__filter--common ${selectedFilter === "common" ? "topic-modal__filter--active" : ""}`}
                  onClick={() => {
                    setSelectedFilter("common");
                    setCurrentPage(0);
                  }}
                >
                  Обычное
                </span>
                <span
                  className={`topic-modal__filter topic-modal__filter--rare ${selectedFilter === "rare" ? "topic-modal__filter--active" : ""}`}
                  onClick={() => {
                    setSelectedFilter("rare");
                    setCurrentPage(0);
                  }}
                >
                  Редкое
                </span>
                <span
                  className={`topic-modal__filter topic-modal__filter--epic ${selectedFilter === "epic" ? "topic-modal__filter--active" : ""}`}
                  onClick={() => {
                    setSelectedFilter("epic");
                    setCurrentPage(0);
                  }}
                >
                  Эпическое
                </span>
                <span
                  className={`topic-modal__filter topic-modal__filter--legendary ${selectedFilter === "legendary" ? "topic-modal__filter--active" : ""}`}
                  onClick={() => {
                    setSelectedFilter("legendary");
                    setCurrentPage(0);
                  }}
                >
                  Легендарное
                </span>
              </div>

              <div className="topic-modal__carousel">
                <button
                  type="button"
                  className="topic-modal__arrow topic-modal__arrow--left"
                  aria-label="Назад"
                  onClick={() => {
                    slideDirectionRef.current = "left";
                    setCurrentPage((prev) => (prev > 0 ? prev - 1 : prev));
                  }}
                >
                  <svg
                    viewBox="0 0 12 12"
                    className="topic-modal__arrow-icon"
                    aria-hidden="true"
                  >
                    <path d="M7.5 2.5L4 6l3.5 3.5" />
                  </svg>
                </button>

                <div
                  className={`topic-modal__cards topic-modal__cards--${slideDirectionRef.current}`}
                  key={`${currentPage}`}
                >
                  {sliceArray.map((plant, index) => {
                    return (
                      <div
                        key={plant.id}
                        className="topic-modal__card-appear"
                        style={{ animationDelay: `${index * 0.08}s` }}
                      >
                        <CarouselCard
                          onClick={() => setSelectedPlant(plant.id)}
                          id={plant.id}
                          selected={selectedPlant == plant.id}
                          name={plant.name}
                          rarity={plant.rarity}
                          rarityClass={plant.rarityClass}
                          img_small={plant.imgBig}
                        />
                      </div>
                    );
                  })}
                </div>

                <button
                  type="button"
                  className="topic-modal__arrow topic-modal__arrow--right"
                  aria-label="Вперед"
                  onClick={() => {
                    slideDirectionRef.current = "right";
                    setCurrentPage((prev) =>
                      (prev + 1) * 4 < filtredPlants.length ? prev + 1 : prev,
                    );
                  }}
                >
                  <svg
                    viewBox="0 0 12 12"
                    className="topic-modal__arrow-icon"
                    aria-hidden="true"
                  >
                    <path d="M4.5 2.5L8 6l-3.5 3.5" />
                  </svg>
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
