import { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import api from "../api/axios";

export default function Activities() {
  const [search, setSearch] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [page, setPage] = useState(1);

  const [selectedActivity, setSelectedActivity] = useState(null);
  const [deleteTargetId, setDeleteTargetId] = useState(null);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [error, setError] = useState("");

  const queryClient = useQueryClient();

  // ── Single query — won't re-fire unless page/search/dateFilter actually change ──
  const { data, isLoading } = useQuery({
    queryKey: ["activities", page, search, dateFilter],
    queryFn: async () => {
      const params = { page, limit: 10 };
      if (search) params.search = search;
      if (dateFilter) params.date = dateFilter;
      const res = await api.get("/activities", { params });
      return res.data;
    },
    staleTime: 30_000, // treat data as fresh for 30s — won't refetch on re-focus
    keepPreviousData: true, // keep old rows visible while next page loads
  });

  const activities = data?.data ?? [];
  const total = data?.total ?? 0;
  const pages = data?.pages ?? 1;

  const refetch = () =>
    queryClient.invalidateQueries({ queryKey: ["activities"] });

  const handleDelete = async () => {
    if (!deleteTargetId) return;
    try {
      await api.delete(`/activities/${deleteTargetId}`);
      setDeleteTargetId(null);
      refetch();
    } catch {
      setError("Failed to delete activity");
    }
  };

  const startEdit = (activity) => {
    setSelectedActivity({
      id: activity.id,
      student_id: activity.student_id,
      student_name: activity.student_name,
      activity: activity.activity,
      hours: activity.hours,
      date: activity.date,
    });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setSubmitLoading(true);
    try {
      await api.put(`/activities/${selectedActivity.id}`, {
        ...selectedActivity,
        hours: parseFloat(selectedActivity.hours),
      });
      setSelectedActivity(null);
      refetch();
    } catch {
      setError("Failed to update activity");
    } finally {
      setSubmitLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Activities</h1>
          <p className="text-slate-500 mt-1">{total} total records logged</p>
        </div>
        <Link
          to="/add"
          className="w-full sm:w-auto text-center bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-5 py-3 rounded-xl shadow-sm hover:shadow transition-all"
        >
          + Add Activity
        </Link>
      </div>

      <div className="flex flex-wrap items-center gap-3 mb-6">
        <div className="relative flex-1 min-w-[280px] sm:flex-none sm:w-80">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.604 10.604Z" />
            </svg>
          </span>
          <input
            type="text"
            placeholder="Search student or activity..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="w-full pl-9 pr-4 py-2.5 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 shadow-sm transition-colors placeholder:text-slate-400"
          />
        </div>

        <input
          type="date"
          value={dateFilter}
          onChange={(e) => { setDateFilter(e.target.value); setPage(1); }}
          className="bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-700 focus:outline-none focus:border-blue-500 shadow-sm transition-colors"
        />

        {(search || dateFilter) && (
          <button
            onClick={() => { setSearch(""); setDateFilter(""); setPage(1); }}
            className="text-sm font-medium text-slate-500 hover:text-slate-800 px-3 py-2 bg-slate-200/60 hover:bg-slate-200 rounded-xl transition-colors"
          >
            Clear Filters
          </button>
        )}
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl mb-6 text-sm font-medium flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 shrink-0">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
          </svg>
          {error}
        </div>
      )}

      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden min-h-[400px]">
        {isLoading ? (
          <div className="flex items-center justify-center h-64 text-slate-400 font-medium">
            <div className="animate-pulse flex items-center gap-2">
              <span className="h-2 w-2 bg-blue-600 rounded-full animate-bounce"></span>
              Loading activities log...
            </div>
          </div>
        ) : activities.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-slate-400 p-6 text-center">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10 text-slate-300 mb-2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5.586a1 1 0 0 1 .707.293l5.414 5.414a1 1 0 0 1 .293.707V19a2 2 0 0 1-2 2Z" />
            </svg>
            <p className="text-sm font-medium">No records match your criteria</p>
            <Link to="/add" className="text-blue-600 text-xs font-semibold mt-2 hover:underline">Create a new entry</Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-400 text-xs font-semibold uppercase tracking-wider">
                  <th className="px-6 py-4">Student ID</th>
                  <th className="px-6 py-4">Student Name</th>
                  <th className="px-6 py-4">Activity</th>
                  <th className="px-6 py-4">Hours</th>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {activities.map((a) => (
                  <tr key={a.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 text-slate-500 font-mono text-xs">{a.student_id}</td>
                    <td className="px-6 py-4 text-slate-900 font-semibold">{a.student_name}</td>
                    <td className="px-6 py-4">
                      <span className="bg-blue-50 text-blue-700 px-2.5 py-1 rounded-lg text-xs font-medium border border-blue-100/50">{a.activity}</span>
                    </td>
                    <td className="px-6 py-4 font-bold text-slate-700">{a.hours}h</td>
                    <td className="px-6 py-4 text-slate-500">{a.date}</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-3.5">
                        <button onClick={() => startEdit(a)} className="text-xs font-semibold text-slate-400 hover:text-blue-600 transition-colors">Edit</button>
                        <button onClick={() => setDeleteTargetId(a.id)} className="text-xs font-semibold text-slate-400 hover:text-red-600 transition-colors">Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between mt-6 min-h-[44px]">
        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
          {pages > 1 ? `Page ${page} of ${pages}` : `${total} record${total !== 1 ? "s" : ""}`}
        </span>
        <div className="flex gap-2">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-4 py-2 text-xs font-bold bg-white border border-slate-200 text-slate-600 rounded-xl disabled:opacity-40 hover:bg-slate-50 transition-colors shadow-sm"
          >
            Previous
          </button>
          <button
            onClick={() => setPage((p) => Math.min(pages, p + 1))}
            disabled={page === pages}
            className="px-4 py-2 text-xs font-bold bg-white border border-slate-200 text-slate-600 rounded-xl disabled:opacity-40 hover:bg-slate-50 transition-colors shadow-sm"
          >
            Next
          </button>
        </div>
      </div>

      {/* Delete modal */}
      {deleteTargetId !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 border border-slate-100 shadow-2xl">
            <div className="h-12 w-12 bg-red-50 text-red-600 rounded-full flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.34 6.6m-3.6 0L10.3 9M14.74 3.75l-10.499 1h16.499l-1.004 15a2.25 2.25 0 0 1-2.247 2.112H7.46a2.25 2.25 0 0 1-2.247-2.112L4.17 4.75m6-2.25h3.5m-7.5 0h11.25" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-slate-900 tracking-tight">Delete Record?</h3>
            <p className="text-slate-500 text-sm mt-1">Are you sure you want to remove this activity? This action cannot be reversed.</p>
            <div className="flex items-center gap-3 mt-6">
              <button onClick={handleDelete} className="flex-1 bg-red-600 hover:bg-red-700 text-white text-sm font-bold py-3 rounded-xl transition-colors">Delete</button>
              <button onClick={() => setDeleteTargetId(null)} className="flex-1 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-sm font-bold py-3 rounded-xl transition-colors">Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Edit drawer */}
      <div className={`fixed inset-0 z-50 flex justify-end transition-visibility duration-300 ${selectedActivity ? "visible" : "invisible"}`}>
        <div
          className={`absolute inset-0 bg-slate-900/30 backdrop-blur-xs transition-opacity duration-300 ${selectedActivity ? "opacity-100" : "opacity-0"}`}
          onClick={() => setSelectedActivity(null)}
        />
        <div className={`relative w-full max-w-md bg-white h-full shadow-2xl border-l border-slate-200 flex flex-col justify-between transition-transform duration-300 ease-in-out p-6 transform ${selectedActivity ? "translate-x-0" : "translate-x-full"}`}>
          <div>
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-6">
              <div>
                <h3 className="text-xl font-bold text-slate-900 tracking-tight">Modify Activity</h3>
                <p className="text-slate-500 text-xs mt-0.5">Edit entry information saved inside this record.</p>
              </div>
              <button onClick={() => setSelectedActivity(null)} className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-lg">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {selectedActivity && (
              <form id="drawer-edit-form" onSubmit={handleUpdate} className="space-y-5">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Student ID</label>
                    <input type="text" value={selectedActivity.student_id} onChange={(e) => setSelectedActivity({ ...selectedActivity, student_id: e.target.value })} required className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 text-sm font-mono focus:outline-none focus:border-blue-500 focus:bg-white transition-all" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Student Name</label>
                    <input type="text" value={selectedActivity.student_name} onChange={(e) => setSelectedActivity({ ...selectedActivity, student_name: e.target.value })} required className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 text-sm font-medium focus:outline-none focus:border-blue-500 focus:bg-white transition-all" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Activity Description</label>
                  <input type="text" value={selectedActivity.activity} onChange={(e) => setSelectedActivity({ ...selectedActivity, activity: e.target.value })} required className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 text-sm focus:outline-none focus:border-blue-500 focus:bg-white transition-all" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Hours</label>
                    <input type="number" value={selectedActivity.hours} onChange={(e) => setSelectedActivity({ ...selectedActivity, hours: e.target.value })} step="0.5" min="0.5" required className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 text-sm font-bold focus:outline-none focus:border-blue-500 focus:bg-white transition-all" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Date</label>
                    <input type="date" value={selectedActivity.date} onChange={(e) => setSelectedActivity({ ...selectedActivity, date: e.target.value })} required className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 text-sm focus:outline-none focus:border-blue-500 focus:bg-white transition-all" />
                  </div>
                </div>
              </form>
            )}
          </div>

          <div className="flex gap-3 border-t border-slate-100 pt-4 bg-white">
            <button type="submit" form="drawer-edit-form" disabled={submitLoading} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold py-3.5 rounded-xl shadow-lg shadow-blue-100 transition-all disabled:opacity-50">
              {submitLoading ? "Saving Changes..." : "Save Changes"}
            </button>
            <button type="button" onClick={() => setSelectedActivity(null)} className="px-6 py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-bold rounded-xl transition-colors">
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}