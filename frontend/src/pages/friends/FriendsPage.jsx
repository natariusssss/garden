import { useEffect, useState } from "react";
import Header from "../../components/header/Header";
import {
  getFriends,
  getPendingRequests,
  acceptFriendRequest,
  rejectFriendRequest,
  deleteFriend,
  searchUsers,
  sendFriendRequest,
} from "../../api/auth";
import "./friends.css";

const UsersIcon = ({ className = "" }) => (
  <svg
    className={className}
    width="48"
    height="48"
    viewBox="0 0 48 48"
    fill="none"
    aria-hidden="true"
  >
    <path
      d="M18.5 24.5c5.247 0 9.5-4.253 9.5-9.5s-4.253-9.5-9.5-9.5S9 9.753 9 15s4.253 9.5 9.5 9.5Z"
      stroke="currentColor"
      strokeWidth="3.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M4.5 42c1.91-8.01 6.85-12.5 14-12.5S30.59 33.99 32.5 42"
      stroke="currentColor"
      strokeWidth="3.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M31.5 23.5c3.83-.33 7-3.82 7-8 0-4.42-3.36-8-7.5-8"
      stroke="currentColor"
      strokeWidth="3.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M34.5 30.5c5.02 1.28 8.02 5.15 9 11.5"
      stroke="currentColor"
      strokeWidth="3.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const SearchIcon = ({ className = "" }) => (
  <svg
    className={className}
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    aria-hidden="true"
  >
    <path
      d="M10.75 18.5a7.75 7.75 0 1 0 0-15.5 7.75 7.75 0 0 0 0 15.5ZM16.5 16.5 21 21"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const MoreIcon = ({ className = "" }) => (
  <svg
    className={className}
    width="22"
    height="22"
    viewBox="0 0 22 22"
    fill="none"
    aria-hidden="true"
  >
    <path
      d="M11 5.2h.01M11 11h.01M11 16.8h.01"
      stroke="currentColor"
      strokeWidth="3.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default function FriendsPage() {
  const [friends, setFriends] = useState([]);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [users, setUsers] = useState([]);
  const [sentRequests, setSentRequests] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");

    async function fetchFriendsPageData() {
      const friendsData = await getFriends(token);
      const requestsData = await getPendingRequests(token);

      setFriends(friendsData);
      setPendingRequests(requestsData);
    }

    fetchFriendsPageData();
  }, []);

  const getInitial = (username) => {
    return username ? username[0].toUpperCase() : "?";
  };

  const handleAcceptRequest = async (requestId) => {
    const token = localStorage.getItem("token");

    await acceptFriendRequest(requestId, token);

    setPendingRequests((prev) =>
      prev.filter((request) => request.id !== requestId),
    );

    const updatedFriends = await getFriends(token);
    setFriends(updatedFriends);
  };

  const handleRejectRequest = async (requestId) => {
    const isConfirmed = window.confirm(`Вы хотите отклонить заявку?`);

    if (!isConfirmed) return;

    const token = localStorage.getItem("token");

    await rejectFriendRequest(requestId, token);

    setPendingRequests((prev) =>
      prev.filter((request) => request.id !== requestId),
    );
  };

  const handleDeleteFriend = async (friend) => {
    const isConfirmed = window.confirm(`Удалить ${friend.username} из друзей?`);

    if (!isConfirmed) return;

    const token = localStorage.getItem("token");

    await deleteFriend(token, friend.id);

    setFriends((prev) => prev.filter((item) => item.id !== friend.id));
  };

  const handleSearchUsers = async (value) => {
    setSearchQuery(value);

    if (!value.trim()) {
      setUsers([]);
      return;
    }

    const token = localStorage.getItem("token");
    const result = await searchUsers(token, value);
    setUsers(result);
  };
  const handleSendFriendRequest = async (username) => {
    const token = localStorage.getItem("token");

    try {
      await sendFriendRequest(username, token);

      setSentRequests((prev) => [...prev, username]);
    } catch (error) {
      if (error.message === "Request already pending") {
        setSentRequests((prev) => [...prev, username]);
        return;
      }

      alert(error.message || "заявка уже была отправлена");
    }
  };

  const isFriend = (username) => {
    return friends.some((friend) => friend.username === username);
  };

  const isRequestSent = (username) => {
    return sentRequests.includes(username);
  };

  return (
    <div className="friends-page">
      <Header />

      <main className="friends-container">
        <section className="friends-hero">
          <h1 className="friends-title">Друзья</h1>
          <p className="friends-subtitle">
            Находите друзей и управляйте заявками
          </p>
        </section>

        <section className="friends-top-grid">
          <div className="friends-search-card">
            <h2 className="friends-search-title">Найти пользователя</h2>

            <div className="friends-search-wrapper">
              <label className="friends-search-field">
                <SearchIcon className="friends-search-icon" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(event) => handleSearchUsers(event.target.value)}
                  placeholder="Введите имя пользователя..."
                />
              </label>

              {searchQuery.trim() && (
                <div className="friends-search-dropdown">
                  {users.length > 0 ? (
                    users.map((user) => (
                      <div key={user.id} className="friends-search-result">
                        <div className="friends-search-result-avatar">
                          {getInitial(user.username)}
                        </div>

                        <div>
                          <p className="friends-search-result-name">
                            {user.username}
                          </p>
                          <p className="friends-search-result-email">
                            {user.xp}
                          </p>
                        </div>
                        <button
                          className={`friends-send-request ${
                            isFriend(user.username) ||
                            isRequestSent(user.username)
                              ? "friends-send-request-disabled"
                              : "friends-send-request-enabled"
                          }`}
                          type="button"
                          disabled={
                            isFriend(user.username) ||
                            isRequestSent(user.username)
                          }
                          onClick={() => handleSendFriendRequest(user.username)}
                        >
                          {isFriend(user.username)
                            ? "Уже в друзьях"
                            : isRequestSent(user.username)
                              ? "Заявка отправлена"
                              : "Добавить"}
                        </button>
                      </div>
                    ))
                  ) : (
                    <p className="friends-search-empty">
                      Пользователи не найдены
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="friends-stat-card friends-stat-card-green">
            <UsersIcon className="friends-stat-icon" />
            <div>
              <p className="friends-stat-label">Друзей</p>
              <p className="friends-stat-value">{friends.length}</p>
            </div>
          </div>
        </section>

        <section className="friends-content-grid">
          <div className="friends-panel friends-list-panel">
            <div className="friends-panel-header friends-panel-header-green">
              <h2>Мои друзья</h2>
            </div>

            {friends.length > 0 ? (
              friends.map((friend) => (
                <article key={friend.id} className="friends-item">
                  <div className="friends-item-icon" aria-hidden="true">
                    <span>{getInitial(friend.username)}</span>
                  </div>

                  <div className="friends-item-info">
                    <p className="friends-item-username">{friend.username}</p>
                    <p className="friends-item-meta">
                      Уровень {friend.level ?? 1}
                    </p>
                  </div>

                  <button
                    className="friends-profile-button"
                    type="button"
                    onClick={() => handleDeleteFriend(friend)}
                  >
                    Удалить
                  </button>

                  <button
                    className="friends-more-button"
                    type="button"
                    aria-label="Дополнительно"
                  >
                    <MoreIcon />
                  </button>
                </article>
              ))
            ) : (
              <p className="friends-empty">Друзей нет</p>
            )}
          </div>

          <div className="friends-panel friends-requests-panel">
            <div className="friends-panel-header friends-panel-header-purple">
              <h2>Заявки в друзья</h2>
              <span>{pendingRequests.length}</span>
            </div>

            {pendingRequests.length > 0 ? (
              pendingRequests.map((request) => (
                <article key={request.id} className="friends-request-item">
                  <div className="friends-request-icon" aria-hidden="true">
                    <span>{getInitial(request.username)}</span>
                  </div>

                  <div className="friends-request-info">
                    <p className="friends-request-username">
                      {request.username}
                    </p>
                    <p className="friends-request-email">{request.email}</p>
                  </div>

                  <div className="friends-request-actions">
                    <button
                      className="friends-request-accept"
                      type="button"
                      onClick={() => handleAcceptRequest(request.id)}
                    >
                      Принять
                    </button>

                    <button
                      className="friends-request-reject"
                      type="button"
                      onClick={() => handleRejectRequest(request.id)}
                    >
                      Отклонить
                    </button>

                    <button
                      className="friends-more-button"
                      type="button"
                      aria-label="Дополнительно"
                    >
                      <MoreIcon />
                    </button>
                  </div>
                </article>
              ))
            ) : (
              <p className="friends-empty">Заявок нет</p>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
