import "./App.css";
import { Outlet } from "react-router";

function App() {
  return (
    <div className="App">
      <main>
        <Outlet />
      </main>
    </div>
  );
}

export default App;
