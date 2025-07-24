# MQTT-Protocol

A **full-stack application** implementing the MQTT protocol for a **real-time, efficient, and light-weight messaging/notification** system.

## Tech Stack

This application is built on -

- A robust **Spring Boot** server
- Minimal **ReactJS** user (client) dashboard
- Minimal **ReactJS** admin dashboard
- Dockerized **PostgreSQL** database
- **MQTT protocol** for pub/sub messaging
- **Docker Compose** for container orchestration

---

## How to run

Follow three simple steps to set up and run the application:

### 1. Clone the repository

```bash
git clone https://github.com/your-username/mttq-protocol.git
```

Or, you can download the zip and extract the files.

### 2. Move into project directory

### 3. Start the full stack application

Run the following command to build and start all services:

```bash
docker compose up --build -d
```

This command:

- Builds all services
- Starts them in detached mode

**Since this is a tutorial-level repository and users are responsible for their own running instances, all required secrets to run this project are provided in the project files.**

---

## How to use

### Server

It may take some time (2-3 minutes) for the server to be fully up and running.  
You can check server status by -

**1. Viewing service logs**

```bash
docker compose logs -f alert-service
```

and check for any errors, or,

**2. Testing endpoints**

Test responses for either of the following endpoints -

- `GET http://localhost:8082/user/v1/test`
- `GET http://localhost:8082/notify/v1/test`

---

### User Dashboard

- Open: [http://localhost:5173](http://localhost:5173)
- Register or log in with a username
- You should be redirected to a notification dashboard

---

### Admin Dashboard

- Open: [http://localhost:5174](http://localhost:5174)
- Log in without any credentials (for simplicity)
- Enter the username you used to login/register and send a message
- The message should appear on the respective user's dashboard via MQTT in real-time

---

## How MQTT Works in This App

This app uses MQTT (Message Queuing Telemetry Transport), a lightweight publish-subscribe messaging protocol, for real-time messaging/notifications between services and dashboards.

How it works:

1. **Admin Dashboard** publishes messages to an MQTT topic corresponding to the `username` (e.g., `alerts/username`).
2. **User Dashboard** subscribes to this topic (`alerts/username`) via MQTT client.
3. **When a message is published**, the MQTT broker (such as Mosquitto or EMQX) **instantly pushes** the message to all subscribers of that topic.
4. **No polling is required**, making this extremely efficient for real-time systems with many users.
