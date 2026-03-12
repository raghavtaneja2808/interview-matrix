import { Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import StartInterview from "./pages/StartInterview";
import InterviewSession from "./pages/InterviewSession";
import Profile from "./pages/Profile";
import Review from "./pages/Review";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/auth" element={<Auth />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/review" element={<Review />} />
      <Route path="/dashboard/interview" element={<StartInterview />} />
      <Route path="/dashboard/session" element={<InterviewSession />} />
      <Route path="/dashboard/profile" element={<Profile />} />
    </Routes>
  );
}

export default App;
