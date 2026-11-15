
const API_URL = "http://localhost:5000/api/reports";

// Common headers for authenticated requests
const getHeaders = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${localStorage.getItem("token")}`,
});

// Get daily report
export const getDailyReport = async (date) => {
  const response = await fetch(
    `${API_URL}/daily?date=${date}`,
    {
      method: "GET",
      headers: getHeaders(),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to fetch daily report");
  }

  return data;
};

// Get month-to-date report
export const getMonthToDateReport = async (date) => {
  const response = await fetch(
    `${API_URL}/month-to-date?date=${date}`,
    {
      method: "GET",
      headers: getHeaders(),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to fetch month-to-date report");
  }

  return data;
};

// Get previous month report
export const getPreviousMonthReport = async (date) => {
  const response = await fetch(
    `${API_URL}/previous-month?date=${date}`,
    {
      method: "GET",
      headers: getHeaders(),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to fetch previous month report");
  }

  return data;
};
