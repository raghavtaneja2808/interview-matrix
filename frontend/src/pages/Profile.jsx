import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/dashboard/Sidebar";
import TopBar from "../components/dashboard/TopBar";
import { useAuth } from "../context/AuthContext";
import api, { apiError } from "../lib/api";

const EyeIcon = ({ open }) =>
  open ? (
    <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  ) : (
    <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  );

const Profile = () => {
  const navigate = useNavigate();
  const { user, updateUser, signOut } = useAuth();

  const [name, setName] = useState(user?.name || "");
  const [targetRole, setTargetRole] = useState(user?.targetRole || "Frontend Developer");
  const [profileMsg, setProfileMsg] = useState("");
  const [profileLoading, setProfileLoading] = useState(false);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [pwMsg, setPwMsg] = useState("");
  const [pwLoading, setPwLoading] = useState(false);

  const handleProfileSave = async (e) => {
    e.preventDefault();
    setProfileMsg("");
    setProfileLoading(true);
    try {
      if (name.trim() !== user.name) {
        const { data } = await api.put("/auth/update-name", { name: name.trim() });
        updateUser(data.user);
      }
      if (targetRole.trim() !== user.targetRole) {
        const { data } = await api.put("/auth/update-target-role", { targetRole: targetRole.trim() });
        updateUser(data.user);
      }
      setProfileMsg("Profile updated successfully.");
    } catch (err) {
      setProfileMsg(apiError(err, "Failed to update profile."));
    }
    setProfileLoading(false);
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setPwMsg("");
    if (newPassword.length < 8) {
      setPwMsg("New password must be at least 8 characters.");
      return;
    }
    setPwLoading(true);
    try {
      await api.put("/auth/change-password", { currentPassword, newPassword });
      setPwMsg("Password changed successfully.");
      setCurrentPassword("");
      setNewPassword("");
    } catch (err) {
      setPwMsg(apiError(err, "Failed to change password."));
    }
    setPwLoading(false);
  };

  const [loggingOut, setLoggingOut] = useState(false);
  const handleLogout = () => {
    setLoggingOut(true);
    setTimeout(() => {
      signOut();
      navigate("/");
    }, 600);
  };

  if (!user) return null;

  const initials = user.name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="min-h-screen bg-surface-muted">
      {loggingOut && (
        <div className="fixed inset-0 z-[9999] bg-white flex items-center justify-center animate-[fadeIn_0.2s_ease-out]">
          <div className="flex flex-col items-center gap-3">
            <div className="w-8 h-8 border-[3px] border-[#e5e5e5] border-t-[#e8621a] rounded-full animate-spin" />
            <p className="text-sm text-ink-muted font-medium">Signing out...</p>
          </div>
        </div>
      )}
      <Sidebar />
      <TopBar hideStartButton />

      <main className="ml-[280px] pt-[58px] min-h-screen flex flex-col">
        <div className="flex-1 px-7 py-7 w-full max-w-3xl">
          <h1 className="text-[28px] font-black text-ink tracking-tight mb-8">Profile</h1>

          <div className="flex items-center gap-5 mb-8">
            <div className="w-16 h-16 rounded-full bg-accent/10 text-accent text-xl font-black flex items-center justify-center">
              {initials}
            </div>
            <div>
              <p className="text-lg font-bold text-ink">{user.name}</p>
              <p className="text-sm text-ink-muted">{user.email}</p>
            </div>
          </div>

          <div className="bg-surface rounded-xl border border-border p-6 mb-5">
            <h2 className="text-[16px] font-bold text-ink mb-4">Account Details</h2>
            <form onSubmit={handleProfileSave} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-ink-secondary">Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full h-11 px-4 rounded-lg border border-border bg-surface text-sm text-ink focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-all"
                  required
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-ink-secondary">Target Role</label>
                <input
                  type="text"
                  value={targetRole}
                  onChange={(e) => setTargetRole(e.target.value)}
                  className="w-full h-11 px-4 rounded-lg border border-border bg-surface text-sm text-ink focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-all"
                  required
                />
              </div>
              {profileMsg && (
                <p className={`text-sm ${profileMsg.includes("success") ? "text-green-600" : "text-red-600"}`}>
                  {profileMsg}
                </p>
              )}
              <button
                type="submit"
                disabled={profileLoading}
                className="self-start h-10 px-6 rounded-lg bg-ink hover:bg-black text-white text-sm font-semibold transition-colors disabled:opacity-50"
              >
                {profileLoading ? "Saving..." : "Save Changes"}
              </button>
            </form>
          </div>

          <div className="bg-surface rounded-xl border border-border p-6 mb-5">
            <h2 className="text-[16px] font-bold text-ink mb-4">Change Password</h2>
            <form onSubmit={handlePasswordChange} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-ink-secondary">Current Password</label>
                <div className="relative">
                  <input
                    type={showCurrent ? "text" : "password"}
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full h-11 px-4 pr-11 rounded-lg border border-border bg-surface text-sm text-ink placeholder:text-ink-placeholder focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-all"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrent(!showCurrent)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-ink-placeholder hover:text-ink-muted transition-colors"
                  >
                    <EyeIcon open={showCurrent} />
                  </button>
                </div>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-ink-secondary">New Password</label>
                <div className="relative">
                  <input
                    type={showNew ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="At least 8 characters"
                    className="w-full h-11 px-4 pr-11 rounded-lg border border-border bg-surface text-sm text-ink placeholder:text-ink-placeholder focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-all"
                    required
                    minLength={8}
                  />
                  <button
                    type="button"
                    onClick={() => setShowNew(!showNew)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-ink-placeholder hover:text-ink-muted transition-colors"
                  >
                    <EyeIcon open={showNew} />
                  </button>
                </div>
              </div>
              {pwMsg && (
                <p className={`text-sm ${pwMsg.includes("success") ? "text-green-600" : "text-red-600"}`}>
                  {pwMsg}
                </p>
              )}
              <button
                type="submit"
                disabled={pwLoading}
                className="self-start h-10 px-6 rounded-lg bg-ink hover:bg-black text-white text-sm font-semibold transition-colors disabled:opacity-50"
              >
                {pwLoading ? "Changing..." : "Change Password"}
              </button>
            </form>
          </div>

          <div className="bg-surface rounded-xl border border-border p-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-[16px] font-bold text-ink">Sign Out</h2>
                <p className="text-sm text-ink-muted mt-1">Sign out of your account on this device.</p>
              </div>
              <button
                onClick={handleLogout}
                className="h-10 px-6 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 text-sm font-semibold border border-red-200 transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Profile;
