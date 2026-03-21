import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getTopics, createTopic } from "../api/auth";

export default function DashboardPage() {
  const [topics, setTopics] = useState([]);
  const [message, setMessage] = useState("Загрузка тем...");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [formMessage, setFormMessage] = useState("");
  const navigate = useNavigate();

  async function loadTopics() {
    try {
      const data = await getTopics();
      setTopics(data);
      setMessage("");
    } catch (error) {
      setMessage(error.message || "Ошибка загрузки тем");
    }
  }

  useEffect(() => {
    loadTopics();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const handleCreateTopic = async (e) => {
    e.preventDefault();
    setFormMessage("");

    try {
      const newTopic = await createTopic({ name, description });
      setTopics((prev) => [newTopic, ...prev]);
      setName("");
      setDescription("");
    } catch (error) {
      setFormMessage(error.message || "Ошибка создания темы");
    }
  };

  return (
    <div className="page">
      <div className="card">

        <h1 className="title">Mind Garden</h1>

      

        <div style={{ marginTop: "24px" }}>
          <h2>Добавить новую тему</h2>

          <form onSubmit={handleCreateTopic}>
            <div className="field">
              <input
                className="input"
                type="text"
                placeholder="Название темы"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="field">
              <input
                className="input"
                type="text"
                placeholder="Описание"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            <button className="primary-button" type="submit">
              Добавить тему
            </button>
          </form>

          {formMessage && <p className="message">{formMessage}</p>}
        </div>

        <div style={{ marginTop: "24px" }}>
          <h2>Мои темы</h2>

          {message && <p>{message}</p>}

          {!message && topics.length === 0 && (
            <p>У тебя пока нет тем. Добавь первую.</p>
          )}

          {!message &&
            topics.map((topic) => (
              <div
                key={topic.id}
                style={{
                  border: "1px solid #334155",
                  borderRadius: "10px",
                  padding: "12px",
                  marginBottom: "12px",
                }}
              >
                <Link to={`/topics/${topic.id}`}>
                  <button>{topic.name}</button>
                </Link>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}