process.env.NODE_ENV = "test";

const request = require("supertest");
const app = require("../app");
const db = require("../db");

let company;
beforeEach(async () => {
  const result = await db.query(
    `INSERT INTO companies (code, name, description) VALUES ('tykan', 'TYKAN', 'I AM TYKAN') RETURNING code, name, description`
  );
  company = result.rows[0];
});

afterEach(async () => {
  await db.query(`DELETE FROM companies`);
});

afterAll(async () => {
  await db.end();
});

describe("GET /companies", () => {
  test("Get a list of companies", async () => {
    const res = await request(app).get("/companies");
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ companies: [company] });
  });
});

describe("GET /companies/:code", () => {
  test("Get company based off of code", async () => {
    const res = await request(app).get(`/companies/${company.code}`);
    expect(res.statusCode).toBe(200);
  });
});

describe("POST /companies", () => {
  test("Adding a company into the table companies", async () => {
    const res = await request(app)
      .post("/companies")
      .send({ code: "golf", name: "tiger", description: "I am the goat" });
    expect(res.statusCode).toBe(201);
    expect(res.body).toEqual({
      company: { code: "golf", name: "tiger", description: "I am the goat" },
    });
  });
});

describe("PUT /companies/:code", () => {
  test("Update a company", async () => {
    const res = await request(app)
      .put(`/companies/${company.code}`)
      .send({ name: "DEEK", description: "I AM DEEK" });
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({
      company: { code: "tykan", name: "DEEK", description: "I AM DEEK" },
    });
  });
});
