import { Navigate, Route, Routes } from "react-router-dom";
import AppShell from "./components/AppShell";
import { useAuth } from "./context/AuthContext";
import About from "./pages/About";
import Dashboard from "./pages/Dashboard";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Prediction from "./pages/Prediction";
import Probability from "./pages/Probability";
import Recommendations from "./pages/Recommendations";
import Register from "./pages/Register";
import Reports from "./pages/Reports";
import Risk from "./pages/Risk";
import Settings from "./pages/Settings";
import Statistics from "./pages/Statistics";
import StudentProfile from "./pages/StudentProfile";
import Students from "./pages/Students";
import { Spinner } from "./components/ui";

function Guard({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <Spinner />;
  if (!user) return <Navigate to="/login" replace />;
  return children;
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route
        path="/app"
        element={
          <Guard>
            <AppShell />
          </Guard>
        }
      >
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="students" element={<Students />} />
        <Route path="students/:id" element={<StudentProfile />} />
        <Route path="statistics" element={<Statistics />} />
        <Route path="probability" element={<Probability />} />
        <Route path="prediction" element={<Prediction />} />
        <Route path="risk" element={<Risk />} />
        <Route path="recommendations" element={<Recommendations />} />
        <Route path="reports" element={<Reports />} />
        <Route path="about" element={<About />} />
        <Route path="settings" element={<Settings />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
