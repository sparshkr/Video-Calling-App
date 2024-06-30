import "./App.css";
import "./index.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Lobby } from "./components/Lobby";
import { Room } from "./components/Room";
import Signup from "./components/Signup";
import Login from "./components/Login";
import { useAuthContext } from "./hooks/useAuthContext";

function App() {
  const { user } = useAuthContext();

  return (
    <div className="app">
      <Router>
        <Routes>
          <Route
            path="/"
            element={user ? <Lobby /> : <Navigate to="/login" />}
          />
          <Route
            path="/room/:roomId"
            element={user ? <Room /> : <Navigate to="/login" />}
          />
          <Route
            path="/signup"
            element={!user ? <Signup /> : <Navigate to="/" />}
          ></Route>
          <Route
            path="/login"
            element={!user ? <Login /> : <Navigate to="/" />}
          ></Route>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
