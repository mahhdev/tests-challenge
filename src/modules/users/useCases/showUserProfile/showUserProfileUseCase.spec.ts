import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { ShowUserProfileUseCase } from "./ShowUserProfileUseCase";

let createUserUseCase: CreateUserUseCase;
let showUserProfileUseCase: ShowUserProfileUseCase;
let usersInMemoryRepository: InMemoryUsersRepository;

let user = {
  name: "John Doe",
  email: "john@doe.com.br",
  password: "123456",
};

describe("Show user profile", () => {
  beforeEach(() => {
    usersInMemoryRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(usersInMemoryRepository);
    showUserProfileUseCase = new ShowUserProfileUseCase(
      usersInMemoryRepository
    );
  });

  beforeAll(() => {
    if (global.gc) global.gc();
  });

  it("should be able to show user profile", async () => {
    const newUser = await createUserUseCase.execute(user);
    const userProfile = await showUserProfileUseCase.execute(
      newUser.id as string
    );
    expect(userProfile).toHaveProperty("id");
    expect(userProfile).toHaveProperty("name");
    expect(userProfile).toHaveProperty("email");
    expect(userProfile).toHaveProperty("password");
  });
});
