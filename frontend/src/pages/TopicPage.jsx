import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { addXpToTopic, getTopicById } from "../api/auth";

function getTreeByLevel(level) {
  if (level === 1) return "🌱";
  if (level === 2) return "🌿";
  if (level === 3) return "🪴";
  if (level === 4) return "🌳";
  return "🌲";
}

export default function TopicPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [topic, setTopic] = useState(null);
  const [message, setMessage] = useState("Загрузка темы...");
  const [actionMessage, setActionMessage] = useState("");

  useEffect(() => {
    async function loadTopic() {
      try {
        const data = await getTopicById(id);
        setTopic(data);
        setMessage("");
      } catch (error) {
        setMessage(error.message || "Ошибка загрузки темы");
      }
    }

    loadTopic();
  }, [id]);

  const handleAddXp = async () => {
    try {
      const updatedTopic = await addXpToTopic(id);
      setTopic(updatedTopic);
      setActionMessage("Опыт добавлен");
    } catch (error) {
      setActionMessage(error.message || "Ошибка при добавлении опыта");
    }
  };

  if (message) {
    return (
      <div className="page">
        <div className="card">
          <p>{message}</p>
        </div>
      </div>
    );
  }

  if (!topic) {
    return (
      <div className="page">
        <div className="card">
          <p>Тема не найдена</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="card topic-card">
        <div className="tabs">
          <Link to="/dashboard">
            <button>Dashboard</button>
          </Link>
          <Link to="/profile">
            <button>Профиль</button>
          </Link>
        </div>

        <h1 className="title">{topic.name}</h1>

        <div className="topic-stats">
          <p>XP: {topic.xp}</p>
          <p>Level: {topic.level}</p>
        </div>

        <div className="tree-container">
          <div className="tree-emoji">{getTreeByLevel(topic.level)}</div>
        </div>

        <div className="topic-actions">
          <button className="primary-button" onClick={handleAddXp}>
            Добавить опыта
          </button>

          <button
            className="secondary-button"
            onClick={() => navigate("/dashboard")}
          >
            Назад
          </button>
        </div>

        {actionMessage && <p className="message">{actionMessage}</p>}

        <div className="topic-description">
          <p>{topic.description || "Без описания"}</p>
        </div>
      </div>
    </div>
  );
}