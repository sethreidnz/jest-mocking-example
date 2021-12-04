import {
  render,
  screen,
  waitForElementToBeRemoved,
} from "@testing-library/react";
import App from "./App";
import { getAll } from "./api/users";

jest.mock("./api/users", () => {
  return {
    getAll: jest.fn(),
  };
});

describe("<App />", () => {
  // TODO: figure how to use new jest.mocked https://github.com/facebook/jest/pull/12089
  const mockGetAllUsers = getAll as jest.MockedFunction<typeof getAll>;
  beforeEach(() => {
    mockGetAllUsers.mockReset();
  });

  it("should show title and list of users", async () => {
    // arrange
    const users = [
      {
        id: "1",
        name: "chuck norris",
        email: "email@chucknorris.com",
      },
    ];
    mockGetAllUsers.mockResolvedValue(users);

    // act
    render(<App />);

    // assert
    await waitForElementToBeRemoved(screen.getByText("Loading"));
    expect(screen.getByRole("heading", { name: "Users" })).toBeInTheDocument();

    for (let index = 0; index < users.length; index++) {
      const user = users[index];
      expect(screen.getByText(user.name)).toBeInTheDocument();
    }
  });

  it("should show error when user api request fails", async () => {
    // arrange
    const errorMessage = "it's fucked";
    mockGetAllUsers.mockRejectedValue(errorMessage);

    // act
    render(<App />);

    // assert
    await waitForElementToBeRemoved(screen.getByText("Loading"));
    expect(screen.getByRole("heading", { name: "Users" })).toBeInTheDocument();

    expect(screen.getByText(errorMessage)).toBeInTheDocument();
  });
});
