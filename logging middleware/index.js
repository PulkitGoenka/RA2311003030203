const express = require("express");
const app = express();

app.use(express.json());

function loggingMiddleware(req, res, next) {
  const start = Date.now();
  const timestamp = new Date().toISOString();

  console.log(`[${timestamp}] --> ${req.method} ${req.url}`);
  if (Object.keys(req.body).length > 0) {
    console.log("Request Body:", JSON.stringify(req.body, null, 2));
  }

  const originalSend = res.send.bind(res);
  res.send = function (body) {
    const duration = Date.now() - start;
    console.log(`[${new Date().toISOString()}] <-- ${req.method} ${req.url} | Status: ${res.statusCode} | ${duration}ms`);
    return originalSend(body);
  };

  next();
}

app.use(loggingMiddleware);

app.get("/", (req, res) => {
  res.json({ message: "Logging Middleware is running!" });
});

app.get("/health", (req, res) => {
  res.json({ status: "ok", uptime: process.uptime() });
});

app.post("/test", (req, res) => {
  res.json({ received: req.body, status: "success" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
