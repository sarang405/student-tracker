import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import api from "../api/axios";

export default function ActivityForm() {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      student_id: "",
      student_name: "",
      activity: "",
      hours: "",
      date: new Date().toISOString().split("T")[0],
    },
  });

  const onSubmit = async (data) => {
    try {
      await api.post("/activities", { ...data, hours: parseFloat(data.hours) });
      navigate("/activities");
    } catch (err) {
      const detail = err.response?.data?.detail;
      const message = Array.isArray(detail) ? detail[0]?.msg : detail || "Failed to add activity";
      setError("root", { message });
    }
  };

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
        {errors.root && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl mb-6 text-sm font-medium flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 shrink-0">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
            </svg>
            {errors.root.message}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 ml-1">Student ID</label>
              <input
                type="text"
                placeholder="e.g. STU001"
                {...register("student_id", { required: "Student ID is required" })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 text-sm font-mono focus:outline-none focus:border-blue-500 focus:bg-white transition-all placeholder:text-slate-400"
              />
              {errors.student_id && <p className="text-red-500 text-xs mt-1 ml-1">{errors.student_id.message}</p>}
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 ml-1">Student Name</label>
              <input
                type="text"
                placeholder="Full name"
                {...register("student_name", { required: "Student name is required" })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 text-sm font-medium focus:outline-none focus:border-blue-500 focus:bg-white transition-all placeholder:text-slate-400"
              />
              {errors.student_name && <p className="text-red-500 text-xs mt-1 ml-1">{errors.student_name.message}</p>}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 ml-1">Activity Description</label>
            <input
              type="text"
              placeholder="e.g. Math tutoring, Sports practice"
              {...register("activity", { required: "Activity is required" })}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 text-sm focus:outline-none focus:border-blue-500 focus:bg-white transition-all placeholder:text-slate-400"
            />
            {errors.activity && <p className="text-red-500 text-xs mt-1 ml-1">{errors.activity.message}</p>}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 ml-1">Hours</label>
              <input
                type="number"
                placeholder="0.0"
                step="0.1"
                {...register("hours", {
                  required: "Hours is required",
                  min: { value: 0.1, message: "Must be at least 0.1" },
                  max: { value: 24, message: "Cannot exceed 24" },
                })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 text-sm font-bold focus:outline-none focus:border-blue-500 focus:bg-white transition-all placeholder:text-slate-400"
              />
              {errors.hours && <p className="text-red-500 text-xs mt-1 ml-1">{errors.hours.message}</p>}
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 ml-1">Date</label>
              <input
                type="date"
                {...register("date", { required: "Date is required" })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 text-sm focus:outline-none focus:border-blue-500 focus:bg-white transition-all"
              />
              {errors.date && <p className="text-red-500 text-xs mt-1 ml-1">{errors.date.message}</p>}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full sm:flex-1 order-2 sm:order-1 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold py-3.5 rounded-xl shadow-lg shadow-blue-100 transition-all active:scale-[0.98] disabled:opacity-50"
            >
              {isSubmitting ? "Saving Record..." : "Save Activity"}
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