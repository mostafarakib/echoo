import "./App.css";
import { Outlet } from "react-router";
import { Toaster } from "./components/ui/toaster";

function App() {
  return (
    <div className="App">
      <Toaster />
      <main>
        <Outlet />
      </main>
    </div>
  );
}

export default App;
