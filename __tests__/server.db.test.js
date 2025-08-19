import { afterAll, beforeAll, describe, expect, test } from "vitest";

import db from "#db/client";
import {
  createEmployee,
  deleteEmployee,
  getEmployee,
  getEmployees,
  updateEmployee,
} from "#db/queries/employees";

beforeAll(async () => {
  await db.connect();
  await db.query("BEGIN");
});
afterAll(async () => {
  await db.query("ROLLBACK");
  await db.end();
});

describe('"employees" queries', () => {
  test("getEmployees() returns the array of employees", async () => {
    const { rows: expected } = await db.query("SELECT * FROM employees");
    const result = await getEmployees();
    expect(result).toEqual(expected);
  });

  test("getEmployee() returns the employee with the given id", async () => {
    const {
      rows: [expected],
    } = await db.query("SELECT * FROM employees WHERE id = 1");
    const result = await getEmployee(1);
    expect(result).toEqual(expected);
  });

  test("createEmployee() creates and returns a new employee", async () => {
    const employee = {
      name: "New employee",
      birthday: "1001-10-01",
      salary: 100001,
    };
    const result = await createEmployee(employee);
    expect(result).toEqual(
      expect.objectContaining({
        name: employee.name,
        birthday: expect.any(Date),
        salary: employee.salary,
      }),
    );
  });

  test("updateEmployee() updates and returns the employee", async () => {
    const employee = {
      id: 1,
      name: "updated employee",
      birthday: "1001-10-01",
      salary: 100001,
    };
    const result = await updateEmployee(employee);
    expect(result).toEqual(
      expect.objectContaining({
        name: employee.name,
        birthday: expect.any(Date),
        salary: employee.salary,
      }),
    );
  });

  test("deleteEmployee() deletes the employee", async () => {
    await deleteEmployee(1);
    const { rows } = await db.query("SELECT * FROM employees WHERE id = 1");
    expect(rows.length).toBe(0);
  });
});
