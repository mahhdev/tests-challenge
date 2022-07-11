import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase";
import { CreateStatementUseCase } from "../createStatement/CreateStatementUseCase";

let createUserUseCase: CreateUserUseCase;
let createStatementUseCase: CreateStatementUseCase;
let usersInMemoryRepository: InMemoryUsersRepository;
let statementsInMemoryRepository: InMemoryStatementsRepository;

let user = {
  name: "John Doe",
  email: "john@doe.com.br",
  password: "123456",
};

enum OperationType {
  DEPOSIT = "deposit",
  WITHDRAW = "withdraw",
}

describe("Create Statement", () => {
  beforeEach(() => {
    usersInMemoryRepository = new InMemoryUsersRepository();
    statementsInMemoryRepository = new InMemoryStatementsRepository();
    createUserUseCase = new CreateUserUseCase(usersInMemoryRepository);
    createStatementUseCase = new CreateStatementUseCase(
      usersInMemoryRepository,
      statementsInMemoryRepository
    );
    createStatementUseCase = new CreateStatementUseCase(
      usersInMemoryRepository,
      statementsInMemoryRepository
    );
  });

  it("should be able to create statement", async () => {
    const newUser = await createUserUseCase.execute(user);
    const statement = await createStatementUseCase.execute({
      user_id: newUser.id as string,
      type: OperationType.DEPOSIT,
      amount: 100,
      description: "deposit",
    });

    expect(statement).toHaveProperty("id");
    expect(statement).toHaveProperty("user_id");
    expect(statement).toHaveProperty("type");
    expect(statement).toHaveProperty("amount");
    expect(statement).toHaveProperty("description");
  });
});
