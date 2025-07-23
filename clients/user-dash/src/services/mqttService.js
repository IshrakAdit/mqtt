// mqttService.js
import mqtt from "mqtt";

const options = {
  clean: true,
  connectTimeout: 4000,
  clientId: "react-client-" + Math.random().toString(16).substr(2, 8),
};

const connectUrl = "ws://localhost:9001";

const mqttClient = mqtt.connect(connectUrl, options);

console.log("MQTT client created with ID:", options.clientId);

export default mqttClient;
