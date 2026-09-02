const express = require("express");
const client = require("prom-client");

const app = express();
const PORT = 3001;

// Registry
const register = new client.Registry();
client.collectDefaultMetrics({ register });

// Custom metric: total requests counter
const httpRequestCount = new client.Counter({
    name: "http_request_count",
    help: "Total number of HTTP requests",
});
register.registerMetric(httpRequestCount);

// Middleware: increase counter on each request
app.use((req, res, next) => {
    httpRequestCount.inc();
    next();
});

// Example route
app.get("/", (req, res) => {
    res.send("Hello Prometheus + Grafana!");
});

// Metrics endpoint for Prometheus
app.get("/metrics", async (req, res) => {
    res.set("Content-Type", register.contentType);
    res.end(await register.metrics());
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});