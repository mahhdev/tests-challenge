import { CreateUserUseCase } from "./CreateUserUseCase";
import { AppError } from "../../../../shared/errors/AppError";
import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";

let createUserUseCase: CreateUserUseCase;
let usersInMemoryRepository: InMemoryUsersRepository;

let user = {
  name: "John Doe",
  email: "john@doe.com.br",
  password: "123456",
};

describe("Create User Use Case", () => {
  beforeEach(() => {
    usersInMemoryRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(usersInMemoryRepository);
  });

  beforeAll(() => {
    if (global.gc) global.gc();
  });

  it("should be able to create a new user", async () => {
    const newUser = await createUserUseCase.execute(user);
    expect(newUser).toHaveProperty("id");
    expect(newUser).toHaveProperty("name");
    expect(newUser).toHaveProperty("email");
    expect(newUser).toHaveProperty("password");
  });

  it("should not be able to create a new user with the same email", () => {
    expect(async () => {
      await createUserUseCase.execute(user);
      await createUserUseCase.execute(user);
    }).rejects.toBeInstanceOf(AppError);
  });
});
