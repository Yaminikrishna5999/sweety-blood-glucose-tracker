
const API_URL = "http://localhost:5000/api/readings";

// Common headers for authenticated API requests
const getHeaders = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${localStorage.getItem("token")}`,
});

// Get all readings for the logged-in patient
export const getReadings = async () => {
  const response = await fetch(API_URL, {
    method: "GET",
    headers: getHeaders(),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to fetch readings");
  }

  return data;
};

// Add a new glucose reading
export const addReading = async (readingData) => {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(readingData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to add reading");
  }

  return data;
};

// Update an existing glucose reading
export const updateReading = async (id, readingData) => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: getHeaders(),
    body: JSON.stringify(readingData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to update reading");
  }

  return data;
};

// Delete a glucose reading
export const deleteReading = async (id) => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
    headers: getHeaders(),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to delete reading");
  }

  return data;
};
