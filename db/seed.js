import db from "#db/client";

await db.connect();
await seedEmployees();
await db.end();
console.log("🌱 Database seeded.");

async function seedEmployees() {
  // Create table if it doesn't exist
  await db.query(`
    CREATE TABLE IF NOT EXISTS employees (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      birthday DATE NOT NULL,
      salary INTEGER NOT NULL
    );
  `);

  // Clear existing rows so we have a predictable state
  await db.query(`DELETE FROM employees;`);

  // I10 employees to seed
  const employees = [
    ["Ada Lovelace",      "1815-12-10", 150000],
    ["Alan Turing",       "1912-06-23", 160000],
    ["Grace Hopper",      "1906-12-09", 155000],
    ["Katherine Johnson", "1918-08-26", 140000],
    ["Edsger Dijkstra",   "1930-05-11", 145000],
    ["Donald Knuth",      "1938-01-10", 170000],
    ["Barbara Liskov",    "1939-11-07", 152000],
    ["Linus Torvalds",    "1969-12-28", 165000],
    ["Margaret Hamilton", "1936-08-17", 158000],
    ["Radia Perlman",     "1951-12-18", 149000],
  ];

  // Bulk insert
  const valuesSql = employees
    .map(
      (_e, i) =>
        `($${i * 3 + 1}, $${i * 3 + 2}, $${i * 3 + 3})`
    )
    .join(", ");

  const params = employees.flat();
  await db.query(
    `
      INSERT INTO employees (name, birthday, salary)
      VALUES ${valuesSql};
    `,
    params
  );
}
