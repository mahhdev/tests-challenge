import request from "supertest";
import { Connection, createConnection } from "typeorm";
import { app } from "../../../../app";

let connection: Connection;

describe("Create Statement Controller", () => {
  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it("should be able to create statement deposit", async () => {
    await request(app).post("/api/v1/users").send({
      name: "vanny maravilha",
      email: "vanny@maravilha.com.br",
      password: "123456",
    });

    const responseToken = await request(app).post("/api/v1/sessions").send({
      email: "vanny@maravilha.com.br",
      password: "123456",
    });

    const { token } = responseToken.body;

    const response = await request(app)
      .post("/api/v1/statements/deposit")
      .send({
        amount: 100,
        description: "Test Deposit",
      })
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(201);
  });

  it("should be able to create statement withdraw", async () => {
    await request(app).post("/api/v1/users").send({
      name: "Licon Bayers",
      email: "lincon@bayers.com.br",
      password: "123456",
    });

    const responseToken = await request(app).post("/api/v1/sessions").send({
      email: "lincon@bayers.com.br",
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

    const response = await request(app)
      .post("/api/v1/statements/withdraw")
      .send({
        amount: 50,
        description: "Test Withdraw",
      })
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(201);
  });

  it("should not be able to create statement withdraw", async () => {
    await request(app).post("/api/v1/users").send({
      name: "Licon Bayers",
      email: "lincon@bayers.com.br",
      password: "123456",
    });

    const responseToken = await request(app).post("/api/v1/sessions").send({
      email: "lincon@bayers.com.br",
      password: "123456",
    });

    const { token } = responseToken.body;

    const response = await request(app)
      .post("/api/v1/statements/withdraw")
      .send({
        amount: 50,
        description: "Test Withdraw",
      })
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(201);
  });

  it("should not be able to create statement deposit", async () => {
    const responseDeposit = await request(app)
      .post("/api/v1/statements/deposit")
      .send({
        amount: 100,
        descripition: "Deposit",
      })
      .set(
        "Authorization",
        `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE2NTcxMzc2MDYsImV4cCI6MTY1NzIyNDAwNiwic3ViIjoiM2E1MjYwMDctNDZhZi00NDBhLThjMDEtNDRiYjBiYzdhNTY1In0.7YwQAEPIHFfWgbYnF8wFGFdflUvqZYZuncp6pHyWfUU`
      );

    const responseWithdraw = await request(app)
      .post("/api/v1/statements/deposit")
      .send({
        amount: 100,
        descripition: "Withdraw",
      })
      .set(
        "Authorization",
        `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE2NTcxMzc2MDYsImV4cCI6MTY1NzIyNDAwNiwic3ViIjoiM2E1MjYwMDctNDZhZi00NDBhLThjMDEtNDRiYjBiYzdhNTY1In0.7YwQAEPIHFfWgbYnF8wFGFdflUvqZYZuncp6pHyWfUU`
      );

    expect(responseDeposit.status).toBe(401);
    expect(responseWithdraw.status).toBe(401);
  });
});
