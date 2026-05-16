import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axios";

export default function ActivityForm() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    student_id: "",
    student_name: "",
    activity: "",
    hours: "",
    date: new Date().toISOString().split("T")[0],
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await api.post("/activities", { ...form, hours: parseFloat(form.hours) });
      navigate("/activities");
    } catch (err) {
      const detail = err.response?.data?.detail;
      setError(Array.isArray(detail) ? detail[0]?.msg : detail || "Failed to add activity");
    } finally {
      setLoading(false);
    }
  };

  const set = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  return (
    <div className="max-w-xl mx-auto py-4">
      
      <div className="mb-8">
        <Link 
          to="/activities" 
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-400 hover:text-blue-600 transition-colors group"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4 transition-transform group-hover:-translate-x-1">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7M3 12h18" />
          </svg>
          Back to Activities
        </Link>
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight mt-4">Add Activity</h1>
        <p className="text-slate-500 mt-1">Log a new student activity record to the system.</p>
      </div>

      <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl mb-6 text-sm font-medium flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 shrink-0">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
            </svg>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 ml-1">Student ID</label>
              <input
                type="text"
                value={form.student_id}
                onChange={set("student_id")}
                placeholder="e.g. STU001"
                required
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 text-sm font-mono focus:outline-none focus:border-blue-500 focus:bg-white transition-all placeholder:text-slate-400"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 ml-1">Student Name</label>
              <input
                type="text"
                value={form.student_name}
                onChange={set("student_name")}
                placeholder="Full name"
                required
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 text-sm font-medium focus:outline-none focus:border-blue-500 focus:bg-white transition-all placeholder:text-slate-400"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 ml-1">Activity Description</label>
            <input
              type="text"
              value={form.activity}
              onChange={set("activity")}
              placeholder="e.g. Math tutoring, Sports practice"
              required
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 text-sm focus:outline-none focus:border-blue-500 focus:bg-white transition-all placeholder:text-slate-400"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 ml-1">Hours</label>
              <input
                type="number"
                value={form.hours}
                onChange={set("hours")}
                placeholder="0.0"
                min="0.1"
                max="24"
                step="0.1"
                required
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 text-sm font-bold focus:outline-none focus:border-blue-500 focus:bg-white transition-all placeholder:text-slate-400"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 ml-1">Date</label>
              <input
                type="date"
                value={form.date}
                onChange={set("date")}
                required
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 text-sm focus:outline-none focus:border-blue-500 focus:bg-white transition-all"
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="w-full sm:flex-1 order-2 sm:order-1 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold py-3.5 rounded-xl shadow-lg shadow-blue-100 transition-all active:scale-[0.98] disabled:opacity-50"
            >
              {loading ? "Saving Record..." : "Save Activity"}
            </button>
            <Link
              to="/activities"
              className="w-full sm:w-auto order-1 sm:order-2 px-8 py-3.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-sm font-bold rounded-xl text-center transition-colors"
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}