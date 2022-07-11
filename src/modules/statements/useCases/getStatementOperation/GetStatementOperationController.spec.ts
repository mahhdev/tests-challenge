import request from "supertest";
import { Connection, createConnection } from "typeorm";
import { app } from "../../../../app";

let connection: Connection;

describe("Get Statement Controller", () => {
  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it("should be able to get statement", async () => {
    await request(app).post("/api/v1/users").send({
      name: "Michael Scofield",
      email: "michael@scofield.com.br",
      password: "123456",
    });

    const responseToken = await request(app).post("/api/v1/sessions").send({
      email: "michael@scofield.com.br",
      password: "123456",
    });

    const { token } = responseToken.body;

    const statement = await request(app)
      .post("/api/v1/statements/deposit")
      .send({
        amount: 100,
        description: "Deposit",
      })
      .set("Authorization", `Bearer ${token}`);

    const response = await request(app)
      .get(`/api/v1/statements/${statement.body.id}`)
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(200);
  });
});
