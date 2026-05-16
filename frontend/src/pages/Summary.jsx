import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";

export default function Summary() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get("/summary")
      .then((res) => setSummary(res.data))
      .catch(() => setError("Failed to load summary"))
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
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            Summary
          </h1>
          <p className="text-slate-500 mt-1 text-sm sm:text-base">
            Comprehensive overview of all student activity data metrics.
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl mb-6 text-sm font-medium flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-5 h-5 shrink-0"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z"
              />
            </svg>
            {error}
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center h-64 text-slate-400 font-medium">
            <div className="animate-pulse flex items-center gap-2">
              <span className="h-2 w-2 bg-blue-600 rounded-full animate-bounce"></span>
              Loading metrics overview...
            </div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">
              <SummaryStatCard
                label="Total Entries"
                value={summary?.total_entries ?? 0}
                bgColor="bg-blue-50 text-blue-600"
                icon={
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                    className="w-6 h-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5.586a1 1 0 0 1 .707.293l5.414 5.414a1 1 0 0 1 .293.707V19a2 2 0 0 1-2 2Z"
                    />
                  </svg>
                }
              />
              <SummaryStatCard
                label="Total Hours Logged"
                value={`${summary?.total_hours ?? 0}h`}
                bgColor="bg-emerald-50 text-emerald-600"
                icon={
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                    className="w-6 h-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                    />
                  </svg>
                }
              />
              <SummaryStatCard
                label="Top Student"
                value={summary?.top_student?.student_name ?? "—"}
                sub={
                  summary?.top_student
                    ? `${summary.top_student.total_hours}h total logged`
                    : "No analytics captured"
                }
                bgColor="bg-amber-50 text-amber-600"
                icon={
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                    className="w-6 h-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M16.5 18.75h-9m9 0a3 3 0 0 0 3-3V13.5a3 3 0 0 0-3-3h-9a3 3 0 0 0-3 3v2.25a3 3 0 0 0 3 3m9 0v1.5a.75.75 0 0 1-.75.75h-7.5a.75.75 0 0 1-.75-.75v-1.5m6-9V4.5a.75.75 0 0 0-.75-.75h-3a.75.75 0 0 0-.75.75v4.5m0 0h5.25"
                    />
                  </svg>
                }
              />
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 mb-8 shadow-sm">
              <div className="mb-6">
                <h2 className="text-base font-bold text-slate-900">
                  Hours Logged Over Time
                </h2>
                <p className="text-xs font-medium text-slate-400 mt-0.5">
                  Daily total hours mapped across all tracked students
                </p>
              </div>
              {summary?.hours_by_date?.length > 0 ? (
                <ResponsiveContainer width="100%" height={260}>
                  <LineChart
                    data={summary.hours_by_date}
                    margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="#f1f5f9"
                      vertical={false}
                    />
                    <XAxis
                      dataKey="date"
                      tick={{ fill: "#64748b", fontSize: 12 }}
                      axisLine={false}
                      tickLine={false}
                      dy={10}
                    />
                    <YAxis
                      tick={{ fill: "#64748b", fontSize: 12 }}
                      axisLine={false}
                      tickLine={false}
                      dx={-5}
                    />
                    <Tooltip
                      contentStyle={{
                        background: "#ffffff",
                        border: "1px solid #e2e8f0",
                        borderRadius: 12,
                        boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.05)",
                      }}
                      labelStyle={{ color: "#1e293b", fontWeight: 600 }}
                      itemStyle={{ color: "#2563eb" }}
                    />
                    <Line
                      type="monotone"
                      dataKey="total_hours"
                      stroke="#2563eb"
                      strokeWidth={2.5}
                      dot={{
                        fill: "#2563eb",
                        stroke: "#ffffff",
                        strokeWidth: 2,
                        r: 4,
                      }}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-48 text-slate-400 text-sm font-medium">
                  No system metrics recorded yet
                </div>
              )}
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-sm">
              <div className="mb-6">
                <h2 className="text-base font-bold text-slate-900">
                  Daily Hours Volume
                </h2>
                <p className="text-xs font-medium text-slate-400 mt-0.5">
                  Compare activity volume distributed across operational
                  calendar days
                </p>
              </div>
              {summary?.hours_by_date?.length > 0 ? (
                <ResponsiveContainer width="100%" height={260}>
                  <BarChart
                    data={summary.hours_by_date}
                    margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="#f1f5f9"
                      vertical={false}
                    />
                    <XAxis
                      dataKey="date"
                      tick={{ fill: "#64748b", fontSize: 12 }}
                      axisLine={false}
                      tickLine={false}
                      dy={10}
                    />
                    <YAxis
                      tick={{ fill: "#64748b", fontSize: 12 }}
                      axisLine={false}
                      tickLine={false}
                      dx={-5}
                    />
                    <Tooltip
                      contentStyle={{
                        background: "#ffffff",
                        border: "1px solid #e2e8f0",
                        borderRadius: 12,
                        boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.05)",
                      }}
                      labelStyle={{ color: "#1e293b", fontWeight: 600 }}
                      itemStyle={{ color: "#3b82f6" }}
                    />
                    <Bar
                      dataKey="total_hours"
                      fill="#2563eb"
                      radius={[6, 6, 0, 0]}
                      maxBarSize={45}
                    />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-48 text-slate-400 text-sm font-medium">
                  No chart records generated yet
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function SummaryStatCard({ label, value, sub, icon, bgColor }) {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex items-start gap-4">
      <div className={`p-3 rounded-xl shrink-0 ${bgColor}`}>{icon}</div>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
          {label}
        </p>
        <p className="text-2xl font-bold text-slate-900 mt-1 truncate">
          {value}
        </p>
        {sub && (
          <p className="text-xs font-medium text-blue-600 mt-1 truncate">
            {sub}
          </p>
        )}
      </div>
    </div>
  );
}
