import { useState } from "react";
import { api } from "../api";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { PageHeader } from "../components/ui";

export default function Settings() {
  const { user, setUser } = useAuth();
  const { push } = useToast();
  const [name, setName] = useState(user?.name || "");
  const [password, setPassword] = useState("");

  async function save(e) {
    e.preventDefault();
    try {
      const body = { name };
      if (password) body.password = password;
      const updated = await api("/api/auth/profile", { method: "POST", body });
      setUser(updated);
      setPassword("");
      push("Profile updated");
    } catch (err) {
      push(err.message, "error");
    }
  }

  return (
    <div>
      <PageHeader title="Profile & Settings" />
      <form onSubmit={save} className="card max-w-lg space-y-3 p-6">
        <label className="text-sm">
          Name
          <input className="input mt-1" value={name} onChange={(e) => setName(e.target.value)} />
        </label>
        <label className="text-sm">
          Email
          <input className="input mt-1 bg-slate-50" value={user?.email || ""} disabled />
        </label>
        <label className="text-sm">
          Role
          <input className="input mt-1 bg-slate-50" value={user?.role || ""} disabled />
        </label>
        <label className="text-sm">
          New password
          <input className="input mt-1" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </label>
        <button className="btn-primary">Save</button>
      </form>
    </div>
  );
}
