# MQTT-Protocol

A full-stack, multi-client web application using MQTT for fast, lightweight, real-time, full-duplex messaging.

## Tech Stack

- Spring Boot backend
- ReactJS user and admin dashboards
- PostgreSQL (Dockerized)
- Mosquitto MQTT broker
- Docker Compose for orchestration

---

## Getting Started

Follow these steps to set up and run the application:

### 1. Clone the repository

```bash
git clone https://github.com/IshrakAdit/mqtt.git
```

Or, you can download the ZIP and extract it.

### 2. Move into project directory

```bash
cd mqtt
```

### 3. Start the full stack

```bash
docker compose up --build -d
```

This command:

- Builds all services
- Starts them in detached mode

> **Note:** Since this is a tutorial-level repository and users are responsible for their own running instances, all required secrets to run this project are provided in the project files.

---

## How to Use

### Backend Server

After the build, wait 4-5 minutes for the Spring Boot server to initialize.
Then, you can test the connection using:

```bash
docker compose logs -f alert-service
```

Or access the following health-check endpoints:

- `GET http://localhost:8082/user/v1/test`
- `GET http://localhost:8082/notify/v1/test`

---

### User Dashboard

- Open: [http://localhost:5173](http://localhost:5173)
- Register or log in with a **username**
- You’ll be redirected to a **real-time notification dashboard**
- You should be connected to the server via **MQTT**
- You can open multiple portals with different usernames for simulating **multiple clients**
- You should be able to send messages to other clients with **username**
- For Admin, use username **admin**

---

### Admin Dashboard

- Visit: [http://localhost:5174](http://localhost:5174)
- No login needed
- Enter a username and send a message
- The target user should see the message instantly via MQTT
- You can open multiple admin portals, that is not checked here (not the purpose of this application)

---

## How It Works

### Components Overview

| Component          | Role                                       |
| ------------------ | ------------------------------------------ |
| Backend (Spring)   | Publishes alerts to MQTT topics            |
| Broker (Mosquitto) | Handles pub/sub routing                    |
| Frontend (React)   | Subscribes to topics and displays messages |
| MQTT JS Client     | Handles WebSocket connection in browser    |
| MQTT Java Client   | Connects backend to MQTT broker via TCP    |

---

### End-to-End Flow

1. **User Dashboard** connects to broker via WebSocket and subscribes to their topic
2. **Admin Dashboard** sends HTTP POST to backend with message
3. **Backend** publishes message to MQTT broker over TCP
4. **Mosquitto Broker** forwards message to all clients on the topic
5. **User Dashboard** receives message instantly — no polling needed

- Works in reverse as User sends message to Admin
- Works in similar way as User sends message to another user

---

## Why MQTT?

### MQTT vs Raw WebSockets

| Feature     | MQTT over WebSocket                 | Raw WebSocket                      |
| ----------- | ----------------------------------- | ---------------------------------- |
| Model       | Pub/Sub                             | Point-to-point                     |
| Overhead    | Minimal (lightweight headers)       | Variable                           |
| Scalability | Supports many subscribers per topic | Needs manual connection management |
| Reliability | Built-in QoS (0, 1, 2)              | No delivery guarantees             |

MQTT gives you structure, reliability, and efficiency out of the box — great for real-time messaging systems.

---

## Forward Strategy

- Currently working on native **MQTT over TCP** for mobile — even lower overhead and battery usage.
- **Persistent alert history** with read/unread states

---

### For any queries, feel free to email me at [ishrak.adit07@gmail.com](mailto:ishrak.adit07@gmail.com) or contact me via [ishrakadit.netlify.app](https://ishrakadit.netlify.app)
