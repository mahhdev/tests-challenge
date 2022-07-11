import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase";
import { CreateStatementUseCase } from "../createStatement/CreateStatementUseCase";
import { GetBalanceUseCase } from "./GetBalanceUseCase";

let createUserUseCase: CreateUserUseCase;
let getBalanceUseCase: GetBalanceUseCase;
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

describe("Cet Balance", () => {
  beforeEach(() => {
    usersInMemoryRepository = new InMemoryUsersRepository();
    statementsInMemoryRepository = new InMemoryStatementsRepository();
    createUserUseCase = new CreateUserUseCase(usersInMemoryRepository);
    createStatementUseCase = new CreateStatementUseCase(
      usersInMemoryRepository,
      statementsInMemoryRepository
    );
    getBalanceUseCase = new GetBalanceUseCase(
      statementsInMemoryRepository,
      usersInMemoryRepository
    );
    createStatementUseCase = new CreateStatementUseCase(
      usersInMemoryRepository,
      statementsInMemoryRepository
    );
  });

  it("should be able to get balance user", async () => {
    const newUser = await createUserUseCase.execute(user);
    await createStatementUseCase.execute({
      user_id: newUser.id as string,
      type: OperationType.DEPOSIT,
      amount: 100,
      description: "deposit",
    });
    const balance = await getBalanceUseCase.execute({
      user_id: newUser.id as string,
    });

    expect(balance).toHaveProperty("statement");
    expect(balance).toHaveProperty("balance");
  });
});
