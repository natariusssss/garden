import Header from "../../components/header/Header";
import "./friends.css";
import { useEffect, useState } from "react";
import {
  getMe,
  getFriends,
  getPendingRequests,
  acceptFriendRequest,
  rejectFriendRequest,
} from "../../api/auth";
import lockImg from "../achievements/lock.png";

const FriendsPage = () => {
  const [user, setUser] = useState(null);
  const [friends, setFriends] = useState([]);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [message, setMessage] = useState("Загрузка...");

  useEffect(() => {
    const token = localStorage.getItem("token");

    async function fetchData() {
      try {
        const me = await getMe(token);
        setUser(me);

        const friendsData = await getFriends(token);
        setFriends(friendsData);

        const pendingData = await getPendingRequests(token);
        setPendingRequests(pendingData);

        setMessage("");
      } catch (error) {
        setMessage(error.message || "Ошибка загрузки страницы");
      }
    }

    fetchData();
  }, []);

  const handleAcceptRequest = async (requestId) => {
    const token = localStorage.getItem("token");

    try {
      await acceptFriendRequest(requestId, token);

      setPendingRequests((prev) =>
        prev.filter((request) => request.id !== requestId)
      );

      const updatedFriends = await getFriends(token);
      setFriends(updatedFriends);
    } catch (error) {
      console.error("Ошибка принятия заявки:", error);
    }
  };

  const handleRejectRequest = async (requestId) => {
    const token = localStorage.getItem("token");

    try {
      await rejectFriendRequest(requestId, token);

      setPendingRequests((prev) =>
        prev.filter((request) => request.id !== requestId)
      );
    } catch (error) {
      console.error("Ошибка отклонения заявки:", error);
    }
  };

  return (
    <div className="friends-page">
      <Header />

      <div className="friends-container">
        {message && !user ? (
          <p className="friends-message">{message}</p>
        ) : (
          <section className="friends-layout">
            <div className="friends-list">
              <h1 className="list-notifications-header">Друзья</h1>

              <div className="friends-list-items">
                {friends.length > 0 ? (
                  friends.map((friend, index) => (
                    <div
                      key={friend.id || friend.username}
                      className="friends-item"
                    >
                      <span className="friends-rank">{index + 1}</span>

                      <img
                        src={lockImg}
                        alt={friend.username}
                        className="friends-item-icon"
                      />

                      <div className="friends-item-info">
                        <p className="friends-item-username">
                          {friend.username}
                        </p>
                        <p className="friends-item-meta">
                          Уровень: {friend.level} · XP: {friend.total_xp}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="friends-empty">Друзей нет</p>
                )}
              </div>
            </div>

            <div className="friends-notifications">
              <h1 className="list-notifications-header">Заявки в друзья</h1>

              <div className="friends-notifications-items">
                {pendingRequests.length > 0 ? (
                  pendingRequests.map((request) => (
                    <div key={request.id} className="friends-request-item">
                      <img
                        src={lockImg}
                        alt={request.username}
                        className="friends-request-icon"
                      />

                      <div className="friends-request-info">
                        <p className="friends-request-username">
                          {request.username}
                        </p>
                        <p className="friends-request-email">
                          {request.email}
                        </p>
                      </div>

                      <div className="friends-request-actions">
                        <button
                          className="friends-request-accept"
                          onClick={() => handleAcceptRequest(request.id)}
                        >
                          Принять
                        </button>

                        <button
                          className="friends-request-reject"
                          onClick={() => handleRejectRequest(request.id)}
                        >
                          Отклонить
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="friends-empty">Заявок нет</p>
                )}
              </div>
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default FriendsPage;