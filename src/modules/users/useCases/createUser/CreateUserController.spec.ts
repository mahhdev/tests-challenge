import request from "supertest";
import { Connection, createConnection } from "typeorm";
import { app } from "../../../../app";

let connection: Connection;

describe("Create User Controller", () => {
  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
    if (global.gc) global.gc();
  });

  it("should be able to create a new user", async () => {
    const response = await request(app).post("/api/v1/users").send({
      name: "John John",
      email: "John@John.com.br",
      password: "123456",
    });

    expect(response.status).toBe(201);
  });

  it("should not be able to create a new user to same email", async () => {
    const response = await request(app).post("/api/v1/users").send({
      name: "John John",
      email: "John@John.com.br",
      password: "123456",
    });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("message");
    expect(response.body.message).toBe("User already exists");
  });
});
