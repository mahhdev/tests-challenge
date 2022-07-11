import request from "supertest";
import { Connection, createConnection } from "typeorm";
import { app } from "../../../../app";

let connection: Connection;

describe("Get Balance Controller", () => {
  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it("should be able to get balance", async () => {
    await request(app).post("/api/v1/users").send({
      name: "Lulu Zinha",
      email: "lulu@zinha.com.br",
      password: "123456",
    });

    const responseToken = await request(app).post("/api/v1/sessions").send({
      email: "lulu@zinha.com.br",
      password: "123456",
    });

    const { token } = responseToken.body;

    await request(app)
      .post("/api/v1/statements/deposit")
      .send({
        amount: 100,
        description: "Test Deposit",
      })
      .set("Authorization", `Bearer ${token}`);

    await request(app)
      .post("/api/v1/statements/withdraw")
      .send({
        amount: 50,
        description: "Test Withdraw",
      })
      .set("Authorization", `Bearer ${token}`);

    const response = await request(app)
      .get("/api/v1/statements/balance")
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(200);
  });

  it("should not be able to get balance", async () => {
    const response = await request(app)
      .get("/api/v1/statements/balance")
      .set(
        "Authorization",
        `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE2NTcxMzc2MDYsImV4cCI6MTY1NzIyNDAwNiwic3ViIjoiM2E1MjYwMDctNDZhZi00NDBhLThjMDEtNDRiYjBiYzdhNTY1In0.7YwQAEPIHFfWgbYnF8wFGFdflUvqZYZuncp6pHyWfUU`
      );

    expect(response.status).toBe(401);
  });
});
