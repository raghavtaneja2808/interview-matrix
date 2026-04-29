import { Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import StartInterview from "./pages/StartInterview";
import InterviewSession from "./pages/InterviewSession";
import Profile from "./pages/Profile";
import Review from "./pages/Review";
import { RequireAuth } from "./context/AuthContext";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/auth" element={<Auth />} />
      <Route path="/dashboard" element={<RequireAuth><Dashboard /></RequireAuth>} />
      <Route path="/dashboard/interview" element={<RequireAuth><StartInterview /></RequireAuth>} />
      <Route path="/dashboard/session/:id" element={<RequireAuth><InterviewSession /></RequireAuth>} />
      <Route path="/dashboard/profile" element={<RequireAuth><Profile /></RequireAuth>} />
      <Route path="/review/:id" element={<RequireAuth><Review /></RequireAuth>} />
    </Routes>
  );
}

export default App;
