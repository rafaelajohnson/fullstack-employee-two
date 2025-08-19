import db from "#db/client";

/** @returns the employee created according to the provided details */
export async function createEmployee({ name, birthday, salary }) {
  const sql = `
    INSERT INTO employees (name, birthday, salary)
    VALUES ($1, $2, $3)
    RETURNING *;
  `;
  const params = [name, birthday, salary];
  const { rows } = await db.query(sql, params);
  const employee = rows[0];

  // Vitest expects birthday to be a Date for create/update
  if (employee) employee.birthday = new Date(employee.birthday);
  return employee;
}

// === Part 2 ===

/** @returns all employees */
export async function getEmployees() {
  const { rows } = await db.query("SELECT * FROM employees");
  return rows; // do NOT coerce birthday here (tests compare raw rows)
}

/**
 * @returns the employee with the given id
 * @returns undefined if employee with the given id does not exist
 */
export async function getEmployee(id) {
  const { rows } = await db.query("SELECT * FROM employees WHERE id = $1", [id]);
  return rows[0]; // undefined if not found (as test expects)
}

/**
 * @returns the updated employee with the given id
 * @returns undefined if employee with the given id does not exist
 */
export async function updateEmployee({ id, name, birthday, salary }) {
  const sql = `
    UPDATE employees
       SET name = $1, birthday = $2, salary = $3
     WHERE id = $4
     RETURNING *;
  `;
  const params = [name, birthday, salary, id];
  const { rows } = await db.query(sql, params);
  const employee = rows[0];
  if (employee) employee.birthday = new Date(employee.birthday);
  return employee; // undefined if not found
}

/**
 * @returns the deleted employee with the given id
 * @returns undefined if employee with the given id does not exist
 */
export async function deleteEmployee(id) {
  const { rows } = await db.query(
    "DELETE FROM employees WHERE id = $1 RETURNING *",
    [id]
  );
  return rows[0]; // undefined if not found
}
