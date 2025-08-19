import express from "express";
import employeesRouter from "#api/employees";

const app = express();

// Body parsing
app.use(express.json());

// Welcome route (exact string required by tests)
app.get("/", (_req, res) => {
  res.status(200).send("Welcome to the Fullstack Employees API.");
});

// Employees routes
app.use("/employees", employeesRouter);

// Minimal error handler to keep API tests happy
app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ error: "Internal Server Error" });
});

export default app;
