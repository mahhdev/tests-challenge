import { AppError } from "../../../../shared/errors/AppError";
import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { AuthenticateUserUseCase } from "./AuthenticateUserUseCase";

let createUserUseCase: CreateUserUseCase;
let authenticateUserUseCase: AuthenticateUserUseCase;
let usersInMemoryRepository: InMemoryUsersRepository;

let user = {
  name: "John Doe",
  email: "john@doe.com.br",
  password: "123456",
};

describe("Authenticate User Use Case", () => {
  beforeEach(() => {
    usersInMemoryRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(usersInMemoryRepository);
    authenticateUserUseCase = new AuthenticateUserUseCase(
      usersInMemoryRepository
    );
  });

  it("should be able to login", async () => {
    await createUserUseCase.execute(user);
    const login = await authenticateUserUseCase.execute({
      email: "john@doe.com.br",
      password: "123456",
    });
    expect(login).toHaveProperty("token");
  });

  it("should not be able to login", async () => {
    expect(async () => {
      await createUserUseCase.execute(user);
      await authenticateUserUseCase.execute({
        email: "john@do.com.br",
        password: "1234",
      });
    }).rejects.toBeInstanceOf(AppError);
  });
});
