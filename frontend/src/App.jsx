import { Route, Routes } from "react-router-dom";
import "./App.css";

import MainNavigation from "./components/MainNavigation/MainNavigation";
import Dashboard from "./pages/Dashboard/Dashboard";
import Managers from "./pages/Managers/Managers";
import Donors from "./pages/Donors/Donors";
import Trade from "./pages/Trade/Trade";

function App() {
  return (
    <>
      <MainNavigation />
      <Routes>
        <Route path="/" element={<Donors />} />
        <Route path="/managers" element={<Managers />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/trade" element={<Trade />} />
      </Routes>
    </>
  );
}

export default App;
