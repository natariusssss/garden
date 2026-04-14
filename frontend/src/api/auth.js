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
  const response = await fetch(`${API_URL}/users/me`, {
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

  const response = await fetch(`${API_URL}/topics`, {
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

export async function createTopic({ name, description, category_id }) {
  const token = localStorage.getItem("token");

  const payload = { name, description };
  if (category_id !== undefined && category_id !== null) {
    payload.category_id = category_id;
  }

  const response = await fetch(`${API_URL}/topics`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.detail || "Failed to create topic");
  }

  return data;
}


export async function addXpToTopic(topicId) {
  const token = localStorage.getItem("token");

  const response = await fetch(`${API_URL}/topics/${topicId}/add-xp`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.detail || "Failed to add xp");
  }

  return data;
}
export async function getTopicById(topicId) {
  const token = localStorage.getItem("token");

  const response = await fetch(`${API_URL}/topics/${topicId}`, {
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