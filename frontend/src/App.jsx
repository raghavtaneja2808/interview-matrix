import { Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import StartInterview from "./pages/StartInterview";
import InterviewSession from "./pages/InterviewSession";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/auth" element={<Auth />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/dashboard/interview" element={<StartInterview />} />
      <Route path="/dashboard/session" element={<InterviewSession />} />
    </Routes>
  );
}

export default App;
