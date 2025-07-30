"use client";

import { useState } from "react";
import Link from "next/link";

function TabButton({ active, onClick, children }) {
  return (
    <button
      className={`px-4 py-2 rounded-t-md border-b-2 font-medium focus:outline-none ${
        active
          ? "border-blue-600 text-blue-600 bg-white"
          : "border-transparent text-gray-500 bg-gray-100 hover:text-blue-600"
      }`}
      onClick={onClick}
      type="button"
    >
      {children}
    </button>
  );
}

export default function AdminDashboard() {
  const [tab, setTab] = useState("users");

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-gray-900">Admin Dashboard</h1>
        <div className="flex space-x-2 border-b mb-8 bg-white rounded-t-md">
          <TabButton active={tab === "users"} onClick={() => setTab("users")}>Users</TabButton>
          <TabButton active={tab === "polls"} onClick={() => setTab("polls")}>Polls</TabButton>
          <TabButton active={tab === "responses"} onClick={() => setTab("responses")}>Poll Responses</TabButton>
          <TabButton active={tab === "packages"} onClick={() => setTab("packages")}>Meal Packages</TabButton>
        </div>
        <div className="bg-white rounded-b-md shadow p-6 min-h-[400px]">
          {tab === "users" && <AdminUsers />}
          {tab === "polls" && <AdminPolls />}
          {tab === "responses" && <AdminPollResponses />}
          {tab === "packages" && <AdminPackages />}
        </div>
      </div>
    </div>
  );
}

// --- Users Management ---
import { useEffect, useRef } from "react";
function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ username: "", password: "", role: "user", mealPackage: "", totalPaid: 0 });
  const [editingId, setEditingId] = useState(null);
  const [packages, setPackages] = useState([]);
  const [error, setError] = useState("");
  const formRef = useRef();

  useEffect(() => {
    fetchUsers();
    fetchPackages();
  }, []);

  async function fetchUsers() {
    setLoading(true);
    const res = await fetch("/api/admin/users");
    const data = await res.json();
    setUsers(data.users || []);
    setLoading(false);
  }
  async function fetchPackages() {
    const res = await fetch("/api/admin/packages");
    const data = await res.json();
    setPackages(data.packages || []);
  }
  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    const url = editingId ? `/api/admin/users/${editingId}` : "/api/auth/register";
    const method = editingId ? "PUT" : "POST";
    const body = JSON.stringify(form);
    const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body });
    const data = await res.json();
    if (!data.success) {
      setError(data.message || "Error");
      return;
    }
    setForm({ username: "", password: "", role: "user", mealPackage: "", totalPaid: 0 });
    setEditingId(null);
    fetchUsers();
    if (formRef.current) formRef.current.reset();
  }
  async function handleEdit(user) {
    setEditingId(user._id);
    setForm({
      username: user.username,
      password: "",
      role: user.role,
      mealPackage: user.mealPackage,
      totalPaid: user.totalPaid,
    });
  }
  async function handleDelete(id) {
    if (!confirm("Delete this user?")) return;
    await fetch(`/api/admin/users/${id}`, { method: "DELETE" });
    fetchUsers();
  }
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4 border-b pb-2">Manage Users</h2>
      <form ref={formRef} onSubmit={handleSubmit} className="mb-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4 items-end">
        <div>
          <label className="block text-sm font-medium mb-1">Username</label>
          <input className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" required value={form.username} onChange={e => setForm(f => ({ ...f, username: e.target.value }))} disabled={!!editingId} />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Password{editingId ? " (leave blank to keep)" : ""}</label>
          <input className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" type="password" value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} required={!editingId} />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Role</label>
          <select className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" value={form.role} onChange={e => setForm(f => ({ ...f, role: e.target.value }))} required>
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Meal Package</label>
          <select className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" value={form.mealPackage} onChange={e => setForm(f => ({ ...f, mealPackage: e.target.value }))}>
            <option value="">Select</option>
            {packages.map(pkg => (
              <option key={pkg._id} value={pkg._id}>{pkg.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Total Paid</label>
          <input className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" type="number" min="0" value={form.totalPaid} onChange={e => setForm(f => ({ ...f, totalPaid: Number(e.target.value) }))} required />
        </div>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition" type="submit">{editingId ? "Update" : "Add"} User</button>
        {editingId && <button type="button" className="ml-2 text-sm text-gray-500 underline" onClick={() => { setEditingId(null); setForm({ username: "", password: "", role: "user", mealPackage: "", totalPaid: 0 }); }}>Cancel</button>}
      </form>
      {error && <div className="text-red-600 mb-2">{error}</div>}
      {loading ? <div>Loading users...</div> : (
        <div className="overflow-x-auto">
          <table className="w-full border mt-2 text-sm min-w-[600px]">
            <thead>
              <tr className="bg-gray-100">
                <th className="border px-2 py-2">Username</th>
                <th className="border px-2 py-2">Role</th>
                <th className="border px-2 py-2">Meal Package</th>
                <th className="border px-2 py-2">Total Paid</th>
                <th className="border px-2 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user._id} className="even:bg-gray-50">
                  <td className="border px-2 py-2 font-medium">{user.username}</td>
                  <td className="border px-2 py-2">
                    <span className={`px-2 py-1 text-xs rounded-full ${user.role === 'admin' ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'}`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="border px-2 py-2">{packages.find(p => p._id === user.mealPackage)?.name || "-"}</td>
                  <td className="border px-2 py-2 text-right">${user.totalPaid?.toFixed(2)}</td>
                  <td className="border px-2 py-2 whitespace-nowrap">
                    <button className="text-blue-600 hover:underline mr-2" onClick={() => handleEdit(user)}>Edit</button>
                    <button className="text-red-600 hover:underline" onClick={() => handleDelete(user._id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// --- Polls Management ---
function AdminPolls() {
  // Placeholder: implement similar CRUD UI for polls
  return <div>Poll management coming soon...</div>;
}

// --- Poll Responses ---
function AdminPollResponses() {
  // Placeholder: implement poll responses viewing UI
  return <div>Poll responses coming soon...</div>;
}

// --- Meal Packages Management ---
function AdminPackages() {
  // Placeholder: implement CRUD UI for meal packages
  return <div>Meal package management coming soon...</div>;
} 