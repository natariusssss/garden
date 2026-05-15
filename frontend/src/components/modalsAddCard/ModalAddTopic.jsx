import { createPortal } from "react-dom";
import "./style.css";
import { createTopic, getPlantsCatalog, updateTopicById } from "../../api/auth";
import { useEffect, useMemo, useRef, useState } from "react";
import CarouselCard from "../carouselCard/CarouselCard.jsx";

const getPlantUnlockText = (plant) => {
  if (!plant || plant.is_unlocked) return "";

  if (plant.unlock_text) return plant.unlock_text;

  if (plant.unlock_type === "level") {
    return `${plant.required_level} уровень`;
  }

  if (plant.unlock_type === "achievement") {
    return plant.achievement_title
      ? `Достижение: ${plant.achievement_title}`
      : "Достижение";
  }

  if (plant.unlock_type === "mixed") {
    return "за уровень / достижение";
  }

  return "заблокировано";
};

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
  const [plants, setPlants] = useState([]);
  const [selectedPlant, setSelectedPlant] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [buttonModeName, setButtonModeName] = useState("Создать тему");
  const [editTitle, setEditTitle] = useState("Создать тему");
  const [isPlantsLoading, setIsPlantsLoading] = useState(true);

  const slideDirectionRef = useRef("");

  useEffect(() => {
    if (mode === "edit") {
      setTopicName(name || "");
      setDescription(descriptionEdit || "");
      setButtonModeName("Сохранить");
      setEditTitle(title || "Редактировать тему");
    }
  }, [mode, name, descriptionEdit, title]);

  useEffect(() => {
    const loadPlants = async () => {
      try {
        setIsPlantsLoading(true);
        const data = await getPlantsCatalog();
        const catalog = Array.isArray(data) ? data : [];

        setPlants(catalog);

        const firstUnlockedPlant = catalog.find((plant) => plant.is_unlocked);
        setSelectedPlant(firstUnlockedPlant?.id || catalog[0]?.id || null);
      } catch (error) {
        setMessage(error.message || "Ошибка загрузки растений");
      } finally {
        setIsPlantsLoading(false);
      }
    };

    loadPlants();
  }, []);

  const currentPlant = useMemo(() => {
    return plants.find((plant) => plant.id === selectedPlant) || null;
  }, [plants, selectedPlant]);

  const filtredPlants = useMemo(() => {
    const filtered =
      selectedFilter === "all"
        ? plants
        : plants.filter((plant) => plant.rarityClass === selectedFilter);

    return [...filtered].sort((firstPlant, secondPlant) => {
      if (firstPlant.is_unlocked === secondPlant.is_unlocked) return 0;
      return firstPlant.is_unlocked ? -1 : 1;
    });
  }, [plants, selectedFilter]);

  const sliceArray = filtredPlants.slice(currentPage * 4, currentPage * 4 + 4);

  const handleFilterClick = (filter) => {
    setSelectedFilter(filter);
    setCurrentPage(0);
  };

  const handlePlantClick = (plant) => {
    if (!plant.is_unlocked) return;

    setMessage("");
    setSelectedPlant(plant.id);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage("");

    if (!currentPlant) {
      setMessage("Сначала выберите растение");
      return;
    }

    if (!currentPlant.is_unlocked) {
      setMessage("Нельзя выбрать заблокированное растение");
      return;
    }

    const payload = {
      name: topicName,
      description,
      plant_code: currentPlant.code || currentPlant.id,
      image_url: currentPlant.imgSmall || currentPlant.image_url || "",
      rarity: currentPlant.rarity,
      tree_type: currentPlant.name,
    };

    if (mode === "edit") {
      try {
        await updateTopicById(id, payload);
        await onCreated();
        onClose();
      } catch (error) {
        setMessage(error.message || "Ошибка сохранения темы");
      }
    } else {
      try {
        await createTopic(payload);
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
              <button
                className="topic-modal__submit"
                type="submit"
                disabled={isPlantsLoading || !currentPlant?.is_unlocked}
              >
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
                {currentPlant?.imgBig ? (
                  <img
                    src={currentPlant.imgBig}
                    alt="Растение"
                    className="topic-modal__selected-image"
                  />
                ) : (
                  <div className="topic-modal__plant-image-placeholder"></div>
                )}
              </div>

              <div className="topic-modal__selected-info">
                <div className="topic-modal__selected-topline">
                  <h4 className="topic-modal__selected-name">
                    {currentPlant?.name || "Растение"}
                  </h4>
                  <span
                    className={`topic-modal__badge topic-modal__badge--featured topic-modal__badge--featured-${currentPlant?.rarityClass || "common"}`}
                  >
                    {currentPlant?.rarity || "Обычное"}
                  </span>
                </div>

                <p className="topic-modal__selected-description">
                  {currentPlant?.description || "Загрузка растений..."}
                </p>

                <p className="topic-modal__selected-type">
                  Вид: {currentPlant?.type || "—"}
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
              <h3 className="topic-modal__plants-title">Растения</h3>
              <p className="topic-modal__plants-subtitle">
                Открытые можно выбрать, закрытые показаны с замком
              </p>
              <span className="topic-modal__plants-count">
                {filtredPlants.length} растений
              </span>

              <div className="topic-modal__filters" aria-hidden="true">
                <span
                  className={`topic-modal__filter topic-modal__filter--all ${selectedFilter === "all" ? "topic-modal__filter--active" : ""} `}
                  onClick={() => handleFilterClick("all")}
                >
                  Все
                </span>
                <span
                  className={`topic-modal__filter topic-modal__filter--common ${selectedFilter === "common" ? "topic-modal__filter--active" : ""}`}
                  onClick={() => handleFilterClick("common")}
                >
                  Обычное
                </span>
                <span
                  className={`topic-modal__filter topic-modal__filter--rare ${selectedFilter === "rare" ? "topic-modal__filter--active" : ""}`}
                  onClick={() => handleFilterClick("rare")}
                >
                  Редкое
                </span>
                <span
                  className={`topic-modal__filter topic-modal__filter--epic ${selectedFilter === "epic" ? "topic-modal__filter--active" : ""}`}
                  onClick={() => handleFilterClick("epic")}
                >
                  Эпическое
                </span>
                <span
                  className={`topic-modal__filter topic-modal__filter--legendary ${selectedFilter === "legendary" ? "topic-modal__filter--active" : ""}`}
                  onClick={() => handleFilterClick("legendary")}
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
                  key={`${currentPage}-${selectedFilter}`}
                >
                  {sliceArray.map((plant, index) => (
                    <div
                      key={plant.id}
                      className="topic-modal__card-appear"
                      style={{ animationDelay: `${index * 0.08}s` }}
                    >
                      <CarouselCard
                        onClick={() => handlePlantClick(plant)}
                        id={plant.id}
                        selected={selectedPlant === plant.id}
                        name={plant.name}
                        rarity={plant.rarity}
                        rarityClass={plant.rarityClass}
                        img_small={plant.imgBig}
                        locked={!plant.is_unlocked}
                        unlockText={getPlantUnlockText(plant)}
                      />
                    </div>
                  ))}
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
    document.getElementById("modalTopic"),
  );
};

export default ModalAddTopic;
