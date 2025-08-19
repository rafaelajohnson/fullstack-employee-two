// app.js
import express from "express";
import employeesRouter from "#api/employees";

const app = express();
app.use(express.json());

app.get("/", (_req, res) => {
  res.status(200).send("Welcome to the Fullstack Employees API.");
});

app.use("/employees", employeesRouter);

// minimal error handler
app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ error: "Internal Server Error" });
});

export default app;
