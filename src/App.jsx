import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from  './pages/Login';
import Dashboard from "./pages/Dashboard";
import Reporting from "./pages/Reporting";
import Admin from "./pages/Admin";
import DomainUser from "./pages/DomainUser";
import Navbar from "./pages/Navbar";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        
        <Route
          path="/dashboard"
          element={
            <>
              <Navbar />
              <Dashboard />
            </>
          }
        />
        <Route
          path="/reporting"
          element={
            <>
              <Navbar />
              <Reporting />
            </>
          }
        />
        <Route
          path="/admin"
          element={
            <>
              <Navbar />
              <Admin />
            </>
          }
        />
        <Route
          path="/domain-user"
          element={
            <>
              <Navbar />
              <DomainUser />
            </>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}