import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase";
import { CreateStatementUseCase } from "../createStatement/CreateStatementUseCase";
import { GetStatementOperationUseCase } from "./GetStatementOperationUseCase";

let createUserUseCase: CreateUserUseCase;
let getStatementOperationUseCase: GetStatementOperationUseCase;
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
    getStatementOperationUseCase = new GetStatementOperationUseCase(
      usersInMemoryRepository,
      statementsInMemoryRepository
    );
    createStatementUseCase = new CreateStatementUseCase(
      usersInMemoryRepository,
      statementsInMemoryRepository
    );
  });

  it("should be able to get balance user", async () => {
    const newUser = await createUserUseCase.execute(user);
    const newStatement = await createStatementUseCase.execute({
      user_id: newUser.id as string,
      type: OperationType.DEPOSIT,
      amount: 100,
      description: "deposit",
    });
    const statement = await getStatementOperationUseCase.execute({
      user_id: newUser.id as string,
      statement_id: newStatement.id as string,
    });

    expect(statement).toHaveProperty("id");
    expect(statement).toHaveProperty("user_id");
    expect(statement).toHaveProperty("type");
    expect(statement).toHaveProperty("amount");
    expect(statement).toHaveProperty("description");
  });
});
