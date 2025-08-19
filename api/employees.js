// api/employees.js
import express from "express";
import db from "#db/client"; // mocked in server.api.test.js

const router = express.Router();

// helpers
const isIntString = (v) => /^\d+$/.test(String(v));
const requiredFieldsPresent = (b) =>
  b &&
  typeof b.name === "string" &&
  typeof b.birthday === "string" &&
  (typeof b.salary === "number" || /^\d+$/.test(String(b.salary)));

// GET /employees – all
router.get("/", async (_req, res, next) => {
  try {
    const { rows } = await db.query("SELECT * FROM employees");
    res.status(200).json(rows);
  } catch (err) {
    next(err);
  }
});

// POST /employees – create
router.post("/", async (req, res, next) => {
  try {
    if (!req.body) return res.sendStatus(400);
    if (!requiredFieldsPresent(req.body)) return res.sendStatus(400);

    const { name, birthday, salary } = req.body;
    const { rows } = await db.query(
      `INSERT INTO employees (name, birthday, salary)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [name, birthday, salary]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    next(err);
  }
});

// GET /employees/:id – one
router.get("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!isIntString(id)) return res.sendStatus(400);

    const { rows } = await db.query("SELECT * FROM employees WHERE id = $1", [id]);
    if (rows.length === 0) return res.sendStatus(404);
    res.status(200).json(rows[0]);
  } catch (err) {
    next(err);
  }
});

// DELETE /employees/:id – delete
router.delete("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!isIntString(id)) return res.sendStatus(400);

    const { rows } = await db.query(
      "DELETE FROM employees WHERE id = $1 RETURNING *",
      [id]
    );
    if (rows.length === 0) return res.sendStatus(404);
    res.sendStatus(204);
  } catch (err) {
    next(err);
  }
});

// PUT /employees/:id – update
router.put("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!req.body) return res.sendStatus(400);
    if (!requiredFieldsPresent(req.body)) return res.sendStatus(400);
    if (!isIntString(id)) return res.sendStatus(400);

    // existence check to produce 404 for non-existent ids (including "0")
    const check = await db.query("SELECT id FROM employees WHERE id = $1", [id]);
    if (check.rows.length === 0) return res.sendStatus(404);

    const { name, birthday, salary } = req.body;
    const { rows } = await db.query(
      `UPDATE employees
         SET name = $1, birthday = $2, salary = $3
       WHERE id = $4
       RETURNING *`,
      [name, birthday, salary, id]
    );
    res.status(200).json(rows[0]);
  } catch (err) {
    next(err);
  }
});

export default router;
