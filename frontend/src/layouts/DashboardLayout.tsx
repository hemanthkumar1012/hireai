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
  Menu,
  X,
  Cpu,
  Bell,
  Search,
  BookOpen,
  Bookmark,
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
    { name: 'Resume Analyzer', path: '/seeker/resume-intelligence', icon: Cpu },
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
  const initials = user?.full_name?.trim()?.charAt(0)?.toUpperCase() || 'A';

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isActive = (path: string) => location.pathname === path;

  const navigation = (
    <nav className="flex-1 overflow-y-auto px-3 py-5">
      <div className="mb-3 px-3 text-[10px] font-semibold uppercase tracking-[0.14em] text-[#8A8A91]">
        Workspace
      </div>

      <div className="space-y-1">
        {links.map((link) => {
          const Icon = link.icon;
          const active = isActive(link.path);

          return (
            <Link
              key={link.name}
              to={link.path}
              title={isCollapsed ? link.name : undefined}
              className={`group flex items-center rounded-2xl border px-3.5 py-3 transition-all duration-200 ${
                isCollapsed ? 'justify-center' : ''
              } ${
                active
                  ? 'border-[#E2DBFF] bg-[#F3F0FF] text-[#5F4EC8] shadow-[0_4px_14px_rgba(110,90,230,0.08)]'
                  : 'border-transparent text-[#5D5D64] hover:border-[#ECECF0] hover:bg-[#FAFAFC] hover:text-[#1D1D1F]'
              }`}
            >
              <Icon
                className={`h-[18px] w-[18px] shrink-0 ${
                  isCollapsed ? '' : 'mr-3'
                } ${active ? 'text-[#6E5AE6]' : 'text-[#85858C] group-hover:text-[#4A4A50]'}`}
                strokeWidth={1.8}
              />

              {!isCollapsed && (
                <span className="text-[12px] font-semibold tracking-[-0.01em]">
                  {link.name}
                </span>
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );

  const accountBlock = (
    <div className="border-t border-[#ECECF0] bg-[#FCFCFD] p-4">
      <div className={`flex items-center gap-3 ${isCollapsed ? 'justify-center' : ''}`}>
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#1D1D1F] text-xs font-bold text-white">
          {initials}
        </div>

        {!isCollapsed && (
          <div className="min-w-0 flex-1">
            <p className="truncate text-[12px] font-semibold text-[#1D1D1F]">
              {user?.full_name || 'Account'}
            </p>
            <p className="mt-0.5 truncate text-[10px] font-medium capitalize tracking-wide text-[#7A7A81]">
              {(user?.role || 'user').replace('_', ' ').toLowerCase()}
            </p>
          </div>
        )}
      </div>

      <button
        onClick={handleLogout}
        title={isCollapsed ? 'Log out' : undefined}
        className={`mt-3 flex w-full items-center justify-center rounded-xl border border-[#F1D9D7] bg-white py-2.5 text-[11px] font-semibold text-[#C9342C] transition hover:bg-[#FFF7F6] ${
          isCollapsed ? 'px-0' : 'px-3'
        }`}
      >
        <LogOut className={`h-4 w-4 ${isCollapsed ? '' : 'mr-2'}`} strokeWidth={1.8} />
        {!isCollapsed && 'Log out'}
      </button>
    </div>
  );

  return (
    <div className="flex min-h-screen overflow-hidden bg-[#F5F5F7] font-sans text-[#1D1D1F]">
      <aside
        className={`relative hidden shrink-0 border-r border-[#E5E5EA] bg-white md:flex md:flex-col ${
          isCollapsed ? 'w-[78px]' : 'w-[264px]'
        } transition-[width] duration-300`}
      >
        <div className="flex h-[72px] items-center border-b border-[#ECECF0] px-5">
          <Link to="/seeker/dashboard" className={`flex items-center ${isCollapsed ? 'mx-auto' : ''}`}>
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#6E5AE6] text-white shadow-[0_8px_18px_rgba(110,90,230,0.22)]">
              <Cpu className="h-5 w-5" strokeWidth={1.9} />
            </div>

            {!isCollapsed && (
              <div className="ml-3">
                <div className="text-[17px] font-extrabold tracking-[-0.03em] text-[#1D1D1F]">
                  ApplyRight
                </div>
                <div className="mt-0.5 text-[9px] font-semibold uppercase tracking-[0.12em] text-[#8A8A91]">
                  Career OS
                </div>
              </div>
            )}
          </Link>
        </div>

        {navigation}

        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          className="absolute -right-3 top-[82px] flex h-7 w-7 items-center justify-center rounded-full border border-[#DCDCE1] bg-white text-[#6E6E73] shadow-[0_4px_12px_rgba(0,0,0,0.08)] transition hover:bg-[#F8F8FA] hover:text-[#1D1D1F]"
        >
          {isCollapsed ? <ChevronRight className="h-3.5 w-3.5" /> : <ChevronLeft className="h-3.5 w-3.5" />}
        </button>

        {accountBlock}
      </aside>

      {sidebarOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/30 backdrop-blur-[2px] md:hidden"
          onClick={() => setSidebarOpen(false)}
        >
          <aside
            className="flex h-full w-[286px] flex-col border-r border-[#E5E5EA] bg-white shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex h-[72px] items-center justify-between border-b border-[#ECECF0] px-5">
              <Link to="/seeker/dashboard" className="flex items-center" onClick={() => setSidebarOpen(false)}>
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#6E5AE6] text-white">
                  <Cpu className="h-5 w-5" strokeWidth={1.9} />
                </div>
                <div className="ml-3">
                  <div className="text-[17px] font-extrabold tracking-[-0.03em] text-[#1D1D1F]">ApplyRight</div>
                  <div className="mt-0.5 text-[9px] font-semibold uppercase tracking-[0.12em] text-[#8A8A91]">Career OS</div>
                </div>
              </Link>

              <button
                onClick={() => setSidebarOpen(false)}
                aria-label="Close navigation"
                className="rounded-xl p-2 text-[#6E6E73] hover:bg-[#F5F5F7] hover:text-[#1D1D1F]"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <nav className="flex-1 overflow-y-auto px-3 py-5">
              <div className="mb-3 px-3 text-[10px] font-semibold uppercase tracking-[0.14em] text-[#8A8A91]">Workspace</div>
              <div className="space-y-1">
                {links.map((link) => {
                  const Icon = link.icon;
                  const active = isActive(link.path);
                  return (
                    <Link
                      key={link.name}
                      to={link.path}
                      onClick={() => setSidebarOpen(false)}
                      className={`flex items-center rounded-2xl border px-3.5 py-3 transition ${
                        active
                          ? 'border-[#E2DBFF] bg-[#F3F0FF] text-[#5F4EC8]'
                          : 'border-transparent text-[#5D5D64] hover:border-[#ECECF0] hover:bg-[#FAFAFC] hover:text-[#1D1D1F]'
                      }`}
                    >
                      <Icon className={`mr-3 h-[18px] w-[18px] ${active ? 'text-[#6E5AE6]' : 'text-[#85858C]'}`} strokeWidth={1.8} />
                      <span className="text-[12px] font-semibold">{link.name}</span>
                    </Link>
                  );
                })}
              </div>
            </nav>

            <div className="border-t border-[#ECECF0] bg-[#FCFCFD] p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#1D1D1F] text-xs font-bold text-white">{initials}</div>
                <div className="min-w-0">
                  <p className="truncate text-[12px] font-semibold text-[#1D1D1F]">{user?.full_name || 'Account'}</p>
                  <p className="mt-0.5 truncate text-[10px] capitalize text-[#7A7A81]">{(user?.role || 'user').replace('_', ' ').toLowerCase()}</p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="mt-3 flex w-full items-center justify-center rounded-xl border border-[#F1D9D7] bg-white px-3 py-2.5 text-[11px] font-semibold text-[#C9342C] hover:bg-[#FFF7F6]"
              >
                <LogOut className="mr-2 h-4 w-4" strokeWidth={1.8} />
                Log out
              </button>
            </div>
          </aside>
        </div>
      )}

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-20 flex h-[72px] items-center justify-between border-b border-[#E5E5EA] bg-white/90 px-4 backdrop-blur-xl sm:px-6 lg:px-8">
          <div className="flex min-w-0 items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              aria-label="Open navigation"
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#E4E4E8] bg-white text-[#5D5D64] md:hidden"
            >
              <Menu className="h-5 w-5" />
            </button>

            <div className="relative hidden w-[260px] lg:block xl:w-[340px]">
              <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8A8A91]" strokeWidth={1.8} />
              <input
                aria-label="Search console"
                type="text"
                placeholder="Search jobs, applications, insights..."
                className="h-10 w-full rounded-xl border border-[#E2E2E7] bg-[#F8F8FA] pl-10 pr-4 text-[12px] text-[#1D1D1F] placeholder:text-[#929299] focus:border-[#C8C0F8] focus:bg-white focus:outline-none focus:ring-4 focus:ring-[#6E5AE6]/10"
              />
            </div>
          </div>

          <div className="flex items-center gap-2.5 sm:gap-3">
            <button
              aria-label="Open notifications"
              title="Notifications"
              className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-[#E3E3E7] bg-white text-[#6E6E73] transition hover:bg-[#F7F7F9] hover:text-[#1D1D1F]"
            >
              <Bell className="h-[18px] w-[18px]" strokeWidth={1.8} />
              <span className="absolute right-2.5 top-2.5 h-1.5 w-1.5 rounded-full bg-[#6E5AE6]" />
            </button>

            <div className="hidden h-10 items-center gap-2 rounded-xl border border-[#E3E3E7] bg-[#FAFAFC] px-3 sm:flex">
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#1D1D1F] text-[9px] font-bold text-white">{initials}</div>
              <span className="max-w-[120px] truncate text-[11px] font-semibold text-[#4A4A50]">{user?.full_name || 'Account'}</span>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto bg-[#F5F5F7] px-4 py-6 sm:px-6 lg:px-8">
          <div className="mx-auto w-full max-w-[1240px] animate-fade-in">{children}</div>
        </main>
      </div>
    </div>
  );
};
