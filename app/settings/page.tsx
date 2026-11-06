"use client";

import React, { useState, useEffect } from "react";
import { Sidebar } from "@/components/Sidebar";
import { Header } from "@/components/Header";
import { BottomNav } from "@/components/BottomNav";
import { CheckCircleIcon } from "@/components/Icons";
import { SettingsData } from "@/lib/db";

export default function SettingsPage() {
  const [settings, setSettings] = useState<SettingsData | null>(null);
  const [activeTab, setActiveTab] = useState("profile");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState("Environmental Officer");
  const [campus, setCampus] = useState("Campus A");
  const [department, setDepartment] = useState("Waste Management");
  const [theme, setTheme] = useState("Light");
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/settings");
        const json = await res.json();
        if (json.success && json.data) {
          setSettings(json.data);
          setFullName(json.data.profile?.fullName || "Aarav Mehta");
          setEmail(json.data.profile?.email || "aarav.mehta@verdanova.in");
          setPhone(json.data.profile?.phone || "+91 98765 43210");
          setRole(json.data.profile?.role || "Environmental Officer");
          setCampus(json.data.profile?.campus || "Campus A");
          setDepartment(json.data.profile?.department || "Waste Management");
          setTheme(json.data.preferences?.theme || "Light");
        }
      } catch (err) {
        console.error(err);
      }
    }
    load();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          profile: { fullName, email, phone, role, campus, department },
          preferences: { theme },
        }),
      });
      const data = await res.json();
      if (data.success) {
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="flex min-h-screen bg-[#f3f7fa] font-sans pb-16 md:pb-0">
      <Sidebar />

      <main className="flex-1 flex flex-col min-w-0">
        <Header
          title="Settings"
          subtitle="Manage your account, preferences and system settings."
        />

        <div className="p-4 sm:p-8 space-y-6 max-w-7xl">
          {/* Sub Navigation Tabs matching Image 6 */}
          <div className="flex overflow-x-auto border-b border-slate-200 gap-6 text-xs sm:text-sm font-semibold text-slate-500">
            {[
              { id: "profile", label: "Profile & Account" },
              { id: "notifications", label: "Notifications" },
              { id: "locations", label: "Locations" },
              { id: "permissions", label: "Users & Permissions" },
              { id: "preferences", label: "System Preferences" },
              { id: "privacy", label: "Data & Privacy" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`pb-3 whitespace-nowrap transition-all border-b-2 ${
                  activeTab === tab.id
                    ? "border-cyan-500 text-cyan-600 font-bold"
                    : "border-transparent hover:text-slate-800"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {saveSuccess && (
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2">
              <CheckCircleIcon className="w-5 h-5 text-emerald-600" />
              Settings updated directly in `db/settings.json`!
            </div>
          )}

          {/* Form and Info Cards Grid */}
          <form onSubmit={handleSave} className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Profile & Account Details (7 cols) */}
              <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-6">
                <div className="flex items-center justify-between border-b pb-4">
                  <div>
                    <h3 className="text-base font-bold text-slate-800">
                      Profile & Account
                    </h3>
                    <p className="text-xs text-slate-500">
                      View and update your personal information.
                    </p>
                  </div>
                  <button
                    type="button"
                    className="px-3.5 py-1.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50"
                  >
                    Change Photo
                  </button>
                </div>

                {/* Avatar Display */}
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-cyan-600 to-teal-400 text-white font-extrabold text-xl flex items-center justify-center shadow">
                    AM
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-slate-900">{fullName}</h4>
                    <p className="text-xs text-slate-400">{role} • {campus}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-cyan-500 bg-slate-50/50"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-cyan-500 bg-slate-50/50"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Role
                    </label>
                    <select
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-cyan-500 bg-slate-50/50"
                    >
                      <option value="Environmental Officer">Environmental Officer</option>
                      <option value="Lab Safety Officer">Lab Safety Officer</option>
                      <option value="Hostel Supervisor">Hostel Supervisor</option>
                      <option value="Operations Associate">Operations Associate</option>
                      <option value="Facility Manager">Facility Manager</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Phone Number
                    </label>
                    <input
                      type="text"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-cyan-500 bg-slate-50/50"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Campus / Location
                    </label>
                    <select
                      value={campus}
                      onChange={(e) => setCampus(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-cyan-500 bg-slate-50/50"
                    >
                      <option value="Campus A">Campus A</option>
                      <option value="Campus B">Campus B</option>
                      <option value="Campus C">Campus C</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Department
                    </label>
                    <input
                      type="text"
                      value={department}
                      onChange={(e) => setDepartment(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-cyan-500 bg-slate-50/50"
                    />
                  </div>
                </div>
              </div>

              {/* Account Information Card (5 cols) matching Image 6 */}
              <div className="lg:col-span-5 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-4">
                <div>
                  <h3 className="text-base font-bold text-slate-800">
                    Account Information
                  </h3>
                  <p className="text-xs text-slate-500">
                    Your account details and access level.
                  </p>
                </div>

                <div className="space-y-3 pt-2 text-xs">
                  <div className="flex justify-between py-2 border-b border-slate-100">
                    <span className="text-slate-500">Account ID</span>
                    <span className="font-mono font-bold text-slate-800">VDN-2026-001</span>
                  </div>

                  <div className="flex justify-between py-2 border-b border-slate-100 items-center">
                    <span className="text-slate-500">User Role</span>
                    <span className="px-2.5 py-0.5 rounded-full bg-cyan-100 text-cyan-800 font-bold text-[11px]">
                      {role}
                    </span>
                  </div>

                  <div className="flex justify-between py-2 border-b border-slate-100">
                    <span className="text-slate-500">Campus</span>
                    <span className="font-semibold text-slate-800">{campus}</span>
                  </div>

                  <div className="flex justify-between py-2 border-b border-slate-100">
                    <span className="text-slate-500">Department</span>
                    <span className="font-semibold text-slate-800">{department}</span>
                  </div>

                  <div className="flex justify-between py-2 border-b border-slate-100">
                    <span className="text-slate-500">Account Created</span>
                    <span className="text-slate-600">12 Aug 2026</span>
                  </div>

                  <div className="flex justify-between py-2 border-b border-slate-100">
                    <span className="text-slate-500">Last Login</span>
                    <span className="text-slate-600">28 Oct 2026, 10:24 AM</span>
                  </div>

                  <div className="flex justify-between py-2 items-center">
                    <span className="text-slate-500">Account Status</span>
                    <span className="flex items-center gap-1.5 font-bold text-emerald-600">
                      <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Active
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Row: Preferences & Change Password */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Preferences (7 cols) */}
              <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-5">
                <h3 className="text-base font-bold text-slate-800">
                  Preferences & Display Options
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Theme</label>
                    <select
                      value={theme}
                      onChange={(e) => setTheme(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold"
                    >
                      <option value="Light">Light (Default)</option>
                      <option value="Dark">Dark Mode</option>
                      <option value="System">System Default</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Date Format</label>
                    <select className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold">
                      <option>DD MMM YYYY (28 Oct 2026)</option>
                      <option>MM/DD/YYYY</option>
                      <option>YYYY-MM-DD</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-2 pt-2 border-t border-slate-100 text-xs">
                  <span className="font-bold text-slate-700">Display Options</span>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" defaultChecked className="rounded text-cyan-600" />
                    <span className="text-slate-600">Show quick stats on login</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" defaultChecked className="rounded text-cyan-600" />
                    <span className="text-slate-600">Show risk heatmap by default</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" defaultChecked className="rounded text-cyan-600" />
                    <span className="text-slate-600">Show recent audit activity</span>
                  </label>
                </div>
              </div>

              {/* Password & Danger Zone (5 cols) */}
              <div className="lg:col-span-5 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-4">
                <h3 className="text-base font-bold text-slate-800">
                  Security & Support
                </h3>
                <div className="space-y-3 text-xs">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">New Password</label>
                    <input
                      type="password"
                      placeholder="••••••••"
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
                    />
                  </div>
                  <button
                    type="button"
                    className="w-full py-2 rounded-xl bg-slate-900 text-white font-bold text-xs hover:bg-slate-800"
                  >
                    Update Password
                  </button>
                </div>

                <div className="pt-4 border-t border-slate-100">
                  <span className="text-[11px] font-bold text-red-600 uppercase tracking-wider">
                    Danger Zone
                  </span>
                  <div className="mt-2 p-3 bg-red-50 rounded-xl border border-red-100 flex items-center justify-between text-xs">
                    <div>
                      <p className="font-bold text-red-800">Delete Account</p>
                      <p className="text-[10px] text-red-500">Permanently remove user credentials</p>
                    </div>
                    <button
                      type="button"
                      className="px-3 py-1.5 rounded-lg bg-red-100 hover:bg-red-200 text-red-700 font-bold text-[11px]"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Save Button */}
            <div className="flex justify-end pt-2">
              <button
                type="submit"
                className="px-8 py-3 rounded-2xl bg-cyan-500 hover:bg-cyan-600 text-white font-bold text-sm shadow-lg shadow-cyan-500/25 transition-all"
              >
                Save Settings
              </button>
            </div>
          </form>
        </div>
      </main>

      <BottomNav />
    </div>
  );
}
