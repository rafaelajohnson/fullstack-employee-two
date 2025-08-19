import express from "express";
import db from "#db/client"; // mocked in server.api.test.js

const router = express.Router();

// helpers
const isPosInt = (value) => /^\d+$/.test(String(value)) && Number(value) > 0;
const requiredFieldsPresent = (body) =>
  body &&
  typeof body.name === "string" &&
  typeof body.birthday === "string" &&
  (typeof body.salary === "number" || /^\d+$/.test(String(body.salary)));

router.get("/", async (_req, res, next) => {
  try {
    const { rows } = await db.query("SELECT * FROM employees");
    res.status(200).json(rows);
  } catch (err) {
    next(err);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const body = req.body;
    if (!body) return res.sendStatus(400);
    if (!requiredFieldsPresent(body)) return res.sendStatus(400);

    const { name, birthday, salary } = body;
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

router.get("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!isPosInt(id)) return res.sendStatus(400);

    const { rows } = await db.query("SELECT * FROM employees WHERE id = $1", [id]);
    if (rows.length === 0) return res.sendStatus(404);
    res.status(200).json(rows[0]);
  } catch (err) {
    next(err);
  }
});

router.delete("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!isPosInt(id)) return res.sendStatus(400);

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

router.put("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const body = req.body;

    if (!body) return res.sendStatus(400);
    if (!requiredFieldsPresent(body)) return res.sendStatus(400);
    if (!isPosInt(id)) return res.sendStatus(400);

    // Ensure the record exists first (so we can send 404)
    const check = await db.query("SELECT id FROM employees WHERE id = $1", [id]);
    if (check.rows.length === 0) return res.sendStatus(404);

    const { name, birthday, salary } = body;
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
