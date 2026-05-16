import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from "recharts";

export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/summary")
      .then((res) => setSummary(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 antialiased">
      

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">Welcome back, {user?.username} </h1>
          <p className="text-slate-500 mt-1 sm:mt-2 text-sm sm:text-base">Here's what's happening with your students.</p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-64 text-slate-400 font-medium">
            <div className="animate-pulse flex items-center gap-2">
              <span className="h-2 w-2 bg-blue-600 rounded-full animate-bounce"></span>
              Loading your overview...
            </div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">
              <StatCard 
                label="Total Entries" 
                value={summary?.total_entries ?? 0} 
                bgColor="bg-blue-50 text-blue-600"
                icon={
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5.586a1 1 0 0 1 .707.293l5.414 5.414a1 1 0 0 1 .293.707V19a2 2 0 0 1-2 2Z" />
                  </svg>
                } 
              />
              <StatCard 
                label="Total Hours" 
                value={`${summary?.total_hours ?? 0}h`} 
                bgColor="bg-emerald-50 text-emerald-600"
                icon={
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                  </svg>
                } 
              />
              <StatCard
                label="Top Student"
                value={summary?.top_student?.student_name ?? "—"}
                sub={summary?.top_student ? `${summary.top_student.total_hours}h logged` : "No data yet"}
                bgColor="bg-amber-50 text-amber-600"
                icon={
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 18.75h-9m9 0a3 3 0 0 0 3-3V13.5a3 3 0 0 0-3-3h-9a3 3 0 0 0-3 3v2.25a3 3 0 0 0 3 3m9 0v1.5a.75.75 0 0 1-.75.75h-7.5a.75.75 0 0 1-.75-.75v-1.5m6-9V4.5a.75.75 0 0 0-.75-.75h-3a.75.75 0 0 0-.75.75v4.5m0 0h5.25" />
                  </svg>
                }
              />
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 mb-8 shadow-sm">
              <h2 className="text-base font-bold text-slate-900 mb-6">Hours Over Time</h2>
              {summary?.hours_by_date?.length > 0 ? (
                <ResponsiveContainer width="100%" height={260}>
                  <AreaChart data={summary.hours_by_date} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#2563eb" stopOpacity={0.15} />
                        <stop offset="95%" stopColor="#2563eb" stopOpacity={0.01} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                    <XAxis dataKey="date" tick={{ fill: "#64748b", fontSize: 12 }} axisLine={false} tickLine={false} dy={10} />
                    <YAxis tick={{ fill: "#64748b", fontSize: 12 }} axisLine={false} tickLine={false} dx={-5} />
                    <Tooltip
                      contentStyle={{ background: "#ffffff", border: "1px solid #e2e8f0", borderRadius: 12, boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.05)" }}
                      labelStyle={{ color: "#1e293b", fontWeight: 600 }}
                      itemStyle={{ color: "#2563eb" }}
                    />
                    <Area type="monotone" dataKey="total_hours" stroke="#2563eb" fill="url(#grad)" strokeWidth={2.5} />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-48 text-slate-400 text-sm font-medium">No activity data yet</div>
              )}
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Link to="/add" className="w-full sm:w-auto text-center bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-5 py-3 rounded-xl shadow-sm hover:shadow transition-all">
                + Add Activity
              </Link>
              <Link to="/activities" className="w-full sm:w-auto text-center bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-sm font-semibold px-5 py-3 rounded-xl transition-colors">
                View All Activities
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function StatCard({ label, value, sub, icon, bgColor }) {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex items-start gap-4">
      <div className={`p-3 rounded-xl shrink-0 ${bgColor}`}>
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{label}</p>
        <p className="text-2xl font-bold text-slate-900 mt-1 truncate">{value}</p>
        {sub && <p className="text-xs font-medium text-blue-600 mt-1 truncate">{sub}</p>}
      </div>
    </div>
  );
}