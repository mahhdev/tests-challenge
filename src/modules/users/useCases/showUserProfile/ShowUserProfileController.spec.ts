import request from "supertest";
import { Connection, createConnection } from "typeorm";
import { app } from "../../../../app";

let connection: Connection;

describe("Show User Profile Controller", () => {
  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
    if (global.gc) global.gc();
  });

  it("should be able show profile user", async () => {
    await request(app).post("/api/v1/users").send({
      name: "John John",
      email: "John@John.com.br",
      password: "123456",
    });

    const responseToken = await request(app).post("/api/v1/sessions").send({
      email: "John@John.com.br",
      password: "123456",
    });

    const { token } = responseToken.body;

    const response = await request(app)
      .get("/api/v1/profile")
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(200);
  });

  it("should not be able to create a new user to same email", async () => {
    const response = await request(app)
      .get("/api/v1/profile")
      .set(
        "Authorization",
        `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE2NTcxMzc2MDYsImV4cCI6MTY1NzIyNDAwNiwic3ViIjoiM2E1MjYwMDctNDZhZi00NDBhLThjMDEtNDRiYjBiYzdhNTY1In0.7YwQAEPIHFfWgbYnF8wFGFdflUvqZYZuncp6pHyWfUU`
      );

    expect(response.status).toBe(401);
  });
});
