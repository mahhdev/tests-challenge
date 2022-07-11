import { hash } from "bcryptjs";
import request from "supertest";
import { Connection, createConnection } from "typeorm";
import { v4 as uuid } from "uuid";
import { app } from "../../../../app";

let connection: Connection;

describe("Authenticate User Controller", () => {
  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();

    await request(app).post("/api/v1/users").send({
      name: "Maria Adm",
      email: "maria@adm.com.br",
      password: "123456",
    });

    // const id = uuid();
    // const password = await hash("123456", 8);

    // await connection.query(
    //   `INSERT INTO users (id, name, email, password, created_at, updated_at) VALUES('${id}', 'Admin', 'admin@maria.com.br', '${password}', NOW(), NOW())`
    // );
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it("should be able to login a session", async () => {
    const response = await request(app).post("/api/v1/sessions").send({
      email: "maria@adm.com.br",
      password: "123456",
    });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("token");
  });

  it("should not be able to login a session with incorrect user", async () => {
    const response = await request(app).post("/api/v1/sessions").send({
      email: "adm@adm.com.br",
      password: "123456",
    });

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty("message");
    expect(response.body.message).toBe("Incorrect email or password");
  });

  it("should not be able to login a session with incorrect password", async () => {
    const response = await request(app).post("/api/v1/sessions").send({
      email: "maria@adm.com.br",
      password: "123",
    });

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty("message");
    expect(response.body.message).toBe("Incorrect email or password");
  });
});
