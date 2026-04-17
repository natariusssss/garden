import { useState } from "react";
import "./style.css";
import { createPortal } from "react-dom";
import { createTopic, getCategories, createCategory } from "../../api/auth";

const ModalAddTopic = ({ onClose }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage("");

    try {
      let categories = await getCategories();
      let categoryId;

      if (categories.length > 0) {
        categoryId = categories[0].id;
      } else {
        const newCategory = await createCategory({
          name: "Мои темы",
          description: "Категория по умолчанию",
        });
        categoryId = newCategory.id;
      }

      await createTopic({
        name: title,
        description,
        category_id: categoryId,
      });

      onClose();
    } catch (error) {
      setMessage(error.message || "Ошибка добавления темы");
    }
  };

  return createPortal(
    <div open className="dialog">
      <div className="dialog-content">
        <button
          type="button"
          onClick={onClose}
          className="modal-close"
          aria-label="Закрыть модальное окно"
        >
          ⤫
        </button>

        <h2 className="title-modal">Создание темы</h2>

        <form className="field-text-input" onSubmit={handleSubmit}>
          <h3 className="text-modal">Название темы</h3>
          <input
            className="input-modal"
            type="text"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
          />

          <h3 className="text-modal">Описание темы</h3>
          <textarea
            className="input-modal input-modal-description"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
          />

          <button className="button-create" type="submit">
            Создать
          </button>
        </form>

        {message && <p>{message}</p>}
      </div>
    </div>,
    document.getElementById("modal"),
  );
};

export default ModalAddTopic;
