const BASE_URL =
  import.meta.env.VITE_BASE_URL || "http://localhost:8082/notify/v1";

class ApiService {
  // Test endpoint
  async testConnection() {
    const response = await fetch(`${BASE_URL}/test`);
    if (!response.ok) throw new Error(`Test failed: ${response.status}`);
    return response.text();
  }

  // Get alert by ID
  async getAlertById(id) {
    const response = await fetch(`${BASE_URL}/id/${id}`);
    if (!response.ok) throw new Error(`Alert not found: ${response.status}`);
    return response.json();
  }

  // Get all alerts
  async getAllAlerts() {
    const response = await fetch(`${BASE_URL}/all`);
    if (!response.ok)
      throw new Error(`Failed to fetch alerts: ${response.status}`);
    return response.json();
  }

  // Create a new alert
  async createAlert({ userId, type, description }) {
    const response = await fetch(`${BASE_URL}/create`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, type, description }),
    });
    if (!response.ok)
      throw new Error(`Failed to create alert: ${response.status}`);
    return response.json();
  }

  // Delete an alert
  async deleteAlert(id) {
    const response = await fetch(`${BASE_URL}/${id}`, {
      method: "DELETE",
    });
    if (!response.ok)
      throw new Error(`Failed to delete alert: ${response.status}`);
    return true;
  }

  // Send simple MQTT message
  async sendMessage(topic, message) {
    const params = new URLSearchParams({
      topic: topic.trim(),
      message: message.trim(),
    });
    const response = await fetch(
      `${BASE_URL}/send/message?${params.toString()}`,
      {
        method: "POST",
      }
    );
    if (!response.ok)
      throw new Error(`Failed to send message: ${response.status}`);
    return response.text();
  }

  // Send alert notification (publishes + saves it)
  async sendAlertNotification({ userId, type, description }) {
    const response = await fetch(`${BASE_URL}/send/alert`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, type, description }),
    });
    if (!response.ok)
      throw new Error(`Failed to send alert: ${response.status}`);
    return response.json();
  }
}

export const apiService = new ApiService();
