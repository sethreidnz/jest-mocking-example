import { useEffect, useState } from "react";
import { getAll, User } from "./api/users";
type UserState = {
  value: User[];
  status: Status;
  error?: string;
};

enum Status {
  Idle,
  Loading,
  Complete,
  Failed,
}

function App() {
  const [userState, setUserState] = useState<UserState>({
    value: [],
    status: Status.Idle,
  });

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        // could do ...userState
        setUserState({ value: [], status: Status.Loading });
        const users = await getAll();
        setUserState({ value: users, status: Status.Complete });
      } catch (error) {
        setUserState({
          value: [],
          status: Status.Failed,
          error: (error as Error).message,
        });
      }
    };

    if (userState.status === Status.Idle) {
      fetchUsers();
    }
  }, [userState]);

  const renderContent = () => {
    if (userState.status === Status.Failed) {
      return <p>it's fucked</p>;
    }

    return (
      <ul>
        {userState.value.map((user) => (
          <li key={user.id}>{user.name}</li>
        ))}
      </ul>
    );
  };

  if (userState.status === Status.Idle || userState.status === Status.Loading) {
    return <p>Loading</p>;
  }

  return (
    <div className="App">
      <h1>Users</h1>

      {renderContent()}
    </div>
  );
}

export default App;
