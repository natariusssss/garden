import { useState } from "react";
import "./editProfileModal.css";

export default function EditProfileModal({ user, onClose, onSave }) {
  const [username, setUsername] = useState(user?.username || "");

  const handleSubmit = async (event) => {
    event.preventDefault();

    const trimmedUsername = username.trim();

    if (!trimmedUsername) {
      alert("Никнейм не может быть пустым");
      return;
    }

    if (trimmedUsername === user?.username) {
      onClose();
      return;
    }

    const confirmed = window.confirm("Вы действительно хотите поменять ник?");
    if (!confirmed) return;

    await onSave({
      username: trimmedUsername,
    });
  };

  return (
    <div className="edit-profile-overlay" onClick={onClose}>
      <form
        className="edit-profile-modal"
        onClick={(event) => event.stopPropagation()}
        onSubmit={handleSubmit}
      >
        <h2>Редактировать профиль</h2>

        <label>
          Никнейм
          <input
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            placeholder="Введите никнейм"
          />
        </label>

        <div className="edit-profile-actions">
          <button type="submit">Сохранить</button>
          <button type="button" onClick={onClose}>
            Отмена
          </button>
        </div>
      </form>
    </div>
  );
}