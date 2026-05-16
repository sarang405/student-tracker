import { useState, useEffect } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const links = [
  { to: "/dashboard", label: "Dashboard", icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M7.5 14.25v2.25m3-4.5v4.5m3-6.75v6.75m3-9v9M6 20.25h12A2.25 2.25 0 0 0 20.25 18V6A2.25 2.25 0 0 0 18 3.75H6A2.25 2.25 0 0 0 3.75 6v12A2.25 2.25 0 0 0 6 20.25Z" /></svg> },
  { to: "/activities", label: "Activities", icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5.586a1 1 0 0 1 .707.293l5.414 5.414a1 1 0 0 1 .293.707V19a2 2 0 0 1-2 2Z" /></svg> },
  { to: "/add", label: "Add Activity", icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg> },
  { to: "/summary", label: "Summary", icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6a7.5 7.5 0 1 0 7.5 7.5h-7.5V6Z" /><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 10.5H21A7.5 7.5 0 0 0 13.5 3v7.5Z" /></svg> },
];

export default function Navigation({ children }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  useEffect(() => {
    setIsMobileOpen(false);
  }, [location]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="flex h-screen w-screen bg-slate-50 text-slate-800 antialiased overflow-hidden">
      
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-slate-200 flex flex-col transition-transform duration-300 ease-in-out
        lg:translate-x-0 lg:static lg:h-screen shrink-0
        ${isMobileOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full"}
      `}>
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div>
            <span className="text-xl font-extrabold text-blue-600 tracking-tight">StudentTracker</span>
            <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-widest leading-none">Workspace</p>
          </div>
          <button 
            onClick={() => setIsMobileOpen(false)} 
            className="lg:hidden p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
            aria-label="Close sidebar"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                  isActive ? "bg-blue-600 text-white shadow-md shadow-blue-100" : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                }`
              }
            >
              {link.icon}
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-100">
          <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-semibold text-red-500 hover:bg-red-50 rounded-xl transition-colors group">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 text-red-400 group-hover:text-red-500 transition-colors">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9" />
            </svg>
            Logout
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        
        <header className="bg-white border-b border-slate-200 px-4 lg:px-8 py-3.5 flex items-center justify-between sticky top-0 z-30 shrink-0 width-full">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsMobileOpen(true)}
              className="lg:hidden p-2 text-slate-500 hover:bg-slate-50 rounded-lg"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
              </svg>
            </button>
            <h2 className="hidden lg:block text-xs font-bold text-slate-400 uppercase tracking-widest leading-none">System Overview</h2>
            <span className="lg:hidden font-extrabold text-blue-600 tracking-tight">StudentTracker</span>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <p className="text-[10px] font-bold text-slate-400 uppercase leading-none">Logged in</p>
              <p className="text-sm font-bold text-slate-700 mt-0.5">{user?.username}</p>
            </div>
            <div className="h-9 w-9 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-sm shadow-sm ring-4 ring-blue-50">
              {user?.username?.charAt(0).toUpperCase() || "U"}
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 lg:p-8">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}