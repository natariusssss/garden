const API_URL = "http://127.0.0.1:8001";

export async function registerUser(payload) {
  const response = await fetch(`${API_URL}/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(getErrorMessage(data, "Registration failed"));
  }

  return data;
}

export async function loginUser({ username, password }) {
  const formData = new URLSearchParams();
  formData.append("username", username);
  formData.append("password", password);

  const response = await fetch(`${API_URL}/token`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: formData,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.detail || "Login failed");
  }

  return data;
}

export async function getMe(token) {
  const response = await fetch(`${API_URL}/my_profile`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.detail || "Failed to fetch user");
  }

  return data;
}

export async function getTopics() {
  const token = localStorage.getItem("token");

  const response = await fetch(`${API_URL}/topics/list`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.detail || "Failed to fetch topics");
  }

  return data;
}

export async function createTopic({
  name,
  description,
  tree_type = "default",
  rarity = "common",
  image_url = "",
}) {
  const token = localStorage.getItem("token");

  const response = await fetch(`${API_URL}/topics/create`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      name,
      description,
      tree_type,
      rarity,
      image_url,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.detail || "Failed to create topic");
  }

  return data;
}

export async function getTopicById(topicId) {
  const token = localStorage.getItem("token");

  const response = await fetch(`${API_URL}/topics/item/${topicId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.detail || "Failed to fetch topic");
  }

  return data;
}

function getErrorMessage(data, fallback) {
  if (!data) return fallback;

  if (typeof data.detail === "string") return data.detail;

  if (Array.isArray(data.detail)) {
    return data.detail.map((item) => item.msg || JSON.stringify(item)).join(", ");
  }

  if (typeof data.detail === "object") {
    return JSON.stringify(data.detail);
  }

  return fallback;
}


export async function getFriends(token) {
  const response = await fetch(`${API_URL}/friends`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.detail || "Ошибка загрузки друзей");
  }

  return data;
}



export async function getPendingRequests(token) {
  const response = await fetch(`${API_URL}/friendships/pending`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.detail || "Ошибка загрузки заявок");
  }

  return data;
}

export async function acceptFriendRequest(requestId, token) {
  const response = await fetch(`${API_URL}/friendships/accept/${requestId}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.detail || "Ошибка принятия заявки");
  }

  return data;
}

export async function rejectFriendRequest(requestId, token) {
  const response = await fetch(`${API_URL}/friendships/reject/${requestId}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.detail || "Ошибка отклонения заявки");
  }

  return data;
}

export async function deleteFriend(token, friendId) {
  const response = await fetch(`${API_URL}/friends/${friendId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.detail || "Ошибка удаления друга");
  }

  return data;
}

export async function getUserStats(token) {
  const response = await fetch(`${API_URL}/users/me/stats`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.detail || "Ошибка загрузки статистики");
  }

  return data;
}