import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import {
  Briefcase,
  Layers,
  FileText,
  Compass,
  FileSearch,
  LogOut,
  User as UserIcon,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  Sliders,
  Menu,
  X,
  Cpu,
  Bell,
  Search,
  BookOpen,
  Calendar,
  Bookmark
} from 'lucide-react';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const { state, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const user = state.user;
  const isRecruiter = user?.role === 'RECRUITER';

  const seekerLinks = [
    { name: 'Overview', path: '/seeker/dashboard', icon: Layers },
    { name: 'My Profile', path: '/seeker/profile', icon: UserIcon },
    { name: 'Find Jobs', path: '/seeker/jobs', icon: Briefcase },
    { name: 'Saved Jobs', path: '/seeker/saved-jobs', icon: Bookmark },
    { name: 'Applications', path: '/seeker/applications', icon: FileText },
    { name: 'Resume AI', path: '/seeker/resume-intelligence', icon: Cpu },
    { name: 'Career Insights', path: '/seeker/career-insights', icon: Compass },
    { name: 'Interview Prep', path: '/seeker/interview-prep', icon: BookOpen },
  ];

  const recruiterLinks = [
    { name: 'Dashboard', path: '/recruiter/dashboard', icon: Layers },
    { name: 'Company Profile', path: '/recruiter/company', icon: Briefcase },
    { name: 'Post a Job', path: '/recruiter/jobs/create', icon: FileText },
    { name: 'Manage Jobs', path: '/recruiter/jobs', icon: FileSearch },
    { name: 'Candidates', path: '/recruiter/candidates', icon: UserIcon },
    { name: 'Analytics', path: '/recruiter/analytics', icon: TrendingUp },
  ];

  const links = isRecruiter ? recruiterLinks : seekerLinks;

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <div className="flex min-h-screen bg-[#070A0F] text-slate-100 overflow-hidden font-sans">
      {/* Sidebar for Desktop */}
      <aside 
        className={`hidden md:flex flex-col bg-brand-surface1 border-r border-brand-border shrink-0 transition-all duration-300 relative ${
          isCollapsed ? 'w-20' : 'w-64'
        }`}
      >
        <div className="h-16 flex items-center px-5 gap-3 border-b border-brand-border bg-[#070A0F]/20">
          <div className="p-1.5 bg-gradient-to-r from-indigo-500 to-violet-500 rounded-xl text-white shadow-md shadow-indigo-500/10 shrink-0">
            <Cpu className="w-5 h-5" />
          </div>
          {!isCollapsed && (
            <span className="font-extrabold text-base tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
              ApplyRight
            </span>
          )}
        </div>

        {/* Links */}
        <nav className="flex-1 px-3 py-6 space-y-1.5 overflow-y-auto">
          {links.map((link) => {
            const Icon = link.icon;
            const active = isActive(link.path);
            return (
              <Link
                key={link.name}
                to={link.path}
                className={`flex items-center py-2.5 rounded-xl transition-all duration-300 ${
                  isCollapsed ? 'justify-center px-0' : 'px-4'
                } ${
                  active
                    ? 'bg-indigo-500/5 text-indigo-400 font-bold border border-indigo-500/10 shadow-sm shadow-indigo-500/5'
                    : 'text-slate-400 hover:bg-brand-surface2 hover:text-slate-100'
                }`}
                title={isCollapsed ? link.name : undefined}
              >
                <Icon className={`w-4 h-4 shrink-0 ${isCollapsed ? 'mr-0' : 'mr-3'} ${active ? 'text-indigo-400' : 'text-slate-400'}`} />
                {!isCollapsed && <span className="text-[11px] font-bold tracking-wide uppercase">{link.name}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Collapse Toggle Trigger */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
            aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          className="absolute bottom-24 -right-3 w-6 h-6 rounded-full border border-brand-border bg-brand-surface2 hover:bg-brand-surface1 hover:border-slate-700 text-slate-400 hover:text-white flex items-center justify-center shadow-lg transition duration-200"
        >
          {isCollapsed ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronLeft className="w-3.5 h-3.5" />}
        </button>

        {/* User Card */}
        <div className="p-4 border-t border-brand-border bg-[#070A0F]/20 flex flex-col gap-3">
          <div className={`flex items-center gap-3 ${isCollapsed ? 'justify-center' : ''}`}>
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-indigo-500 to-violet-500 flex items-center justify-center font-extrabold text-white text-xs shadow shrink-0">
              {user?.full_name.charAt(0)}
            </div>
            {!isCollapsed && (
              <div className="truncate">
                <p className="text-[11px] font-bold text-slate-200 truncate leading-none">{user?.full_name}</p>
                <p className="text-[9px] text-slate-500 font-bold mt-1.5 uppercase tracking-wider truncate capitalize">{user?.role}</p>
              </div>
            )}
          </div>
          <button
            onClick={handleLogout}
            className={`flex items-center justify-center w-full py-2 text-[10px] font-bold text-rose-400/90 hover:text-rose-350 bg-rose-500/5 hover:bg-rose-500/10 border border-rose-500/10 rounded-xl transition duration-200 ${
              isCollapsed ? 'px-0' : 'px-3'
            }`}
            title={isCollapsed ? "Logout" : undefined}
          >
            <LogOut className={`w-3.5 h-3.5 ${isCollapsed ? 'mr-0' : 'mr-2'}`} />
            {!isCollapsed && "LOGOUT"}
          </button>
        </div>
      </aside>

      {/* Mobile Drawer */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden bg-black/60 backdrop-blur-sm" onClick={() => setSidebarOpen(false)}>
          <aside className="w-64 bg-brand-surface1 border-r border-brand-border flex flex-col h-full" onClick={(e) => e.stopPropagation()}>
            <div className="h-16 flex items-center justify-between px-5 border-b border-brand-border bg-[#070A0F]/20">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-gradient-to-r from-indigo-500 to-violet-500 rounded-xl text-white">
                  <Cpu className="w-4 h-4" />
                </div>
                <span className="font-extrabold text-sm tracking-tight text-white">ApplyRight</span>
              </div>
              <button onClick={() => setSidebarOpen(false)} aria-label="Close navigation" className="p-2 rounded-lg text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <nav className="flex-1 px-3 py-6 space-y-1.5 overflow-y-auto">
              {links.map((link) => {
                const Icon = link.icon;
                const active = isActive(link.path);
                return (
                  <Link
                    key={link.name}
                    to={link.path}
                    onClick={() => setSidebarOpen(false)}
                    className={`flex items-center px-4 py-2.5 rounded-xl transition-all duration-200 ${
                      active
                        ? 'bg-indigo-500/5 text-indigo-400 font-bold border border-indigo-500/10 shadow'
                        : 'text-slate-400 hover:bg-brand-surface2 hover:text-slate-100'
                    }`}
                  >
                    <Icon className="w-4 h-4 mr-3" />
                    <span className="text-[11px] font-bold uppercase tracking-wider">{link.name}</span>
                  </Link>
                );
              })}
            </nav>

            <div className="p-4 border-t border-brand-border bg-[#070A0F]/20">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-indigo-500 to-violet-500 flex items-center justify-center font-extrabold text-white text-xs">
                  {user?.full_name.charAt(0)}
                </div>
                <div className="truncate">
                  <p className="text-[11px] font-bold text-slate-200 truncate">{user?.full_name}</p>
                  <p className="text-[9px] text-slate-500 uppercase tracking-wider capitalize">{user?.role}</p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center justify-center w-full px-3 py-2 text-[10px] font-bold text-rose-400 bg-rose-500/5 hover:bg-rose-500/10 border border-rose-500/10 rounded-xl"
              >
                <LogOut className="w-3.5 h-3.5 mr-2" />
                LOGOUT
              </button>
            </div>
          </aside>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Navbar */}
        <header className="h-16 flex items-center justify-between px-6 border-b border-brand-border bg-brand-bg/60 backdrop-blur-md z-10">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(true)}
              aria-label="Open navigation"
              className="md:hidden min-h-10 min-w-10 p-2 bg-brand-surface2 border border-brand-border rounded-lg text-slate-400 hover:text-white"
            >
              <Menu className="w-5 h-5" />
            </button>
            {/* Search Mock */}
            <div className="relative hidden sm:block w-48 lg:w-64">
              <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-slate-500" />
              <input
                aria-label="Search console"
                type="text"
                placeholder="Search console..."
                className="w-full pl-9 pr-3 py-1.5 bg-brand-surface1 border border-brand-border rounded-xl text-[10px] text-slate-100 placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            {/* Notification bell */}
            <button aria-label="Open notifications" title="Notifications" className="min-h-10 min-w-10 p-2 hover:bg-brand-surface1 border border-brand-border hover:border-slate-700 rounded-xl text-slate-400 hover:text-white transition relative">
              <Bell className="w-3.5 h-3.5" />
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-indigo-500 rounded-full" />
            </button>
            <span className="text-[9px] font-bold px-2.5 py-0.5 rounded-full bg-indigo-500/5 text-indigo-400 border border-indigo-500/10 uppercase tracking-wider">
              {user?.role} Portal
            </span>
          </div>
        </header>

        {/* Scrollable Inner Page Container */}
        <main className="flex-1 overflow-y-auto bg-brand-bg p-4 sm:p-6">
          <div className="max-w-6xl mx-auto space-y-6 animate-fade-in">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};
