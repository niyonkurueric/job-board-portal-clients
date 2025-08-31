import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { LayoutDashboard, Briefcase, FileText, Users } from "lucide-react";

// Optionally import a jobs icon if you want a different icon for jobs

const Sidebar = ({ userType, isCollapsed }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const adminLinks = [
    { name: "Dashboard", icon: LayoutDashboard, href: "/dashboard" },
    { name: "Jobs", icon: Briefcase, href: "/dashboard/jobs" },
    { name: "Applications", icon: FileText, href: "/dashboard/applications" },
    { name: "Users", icon: Users, href: "/dashboard/users" },
  ];
  const userLinks = [
    { name: "Dashboard", icon: LayoutDashboard, href: "/dashboard" },
    { name: "Jobs", icon: Briefcase, href: "/dashboard/jobs" },
    { name: "My Applications", icon: FileText, href: "/dashboard/applications" },
  ];

  const links = userType === "admin" ? adminLinks : userLinks;
  return (
    <aside
      className={`${
        isCollapsed ? "w-20" : "w-72"
      } bg-[#222a5f] text-white h-screen flex flex-col transition-all duration-300 ease-in-out fixed left-0 top-0 z-40 shadow-2xl`}
    >
      {/* Header */}
      <div className="p-6 border-b border-slate-700 flex-shrink-0">
        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-[#3aafef] rounded-xl flex items-center justify-center">
                <Briefcase className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-white">
                  Job Board Portal
                </h1>
                <p className="text-xs text-slate-400">
                  {userType === "admin" ? "Admin Portal" : "User Portal"}
                </p>
              </div>
            </div>
          )}
          {isCollapsed && (
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mx-auto">
              <Briefcase className="w-6 h-6 text-white" />
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {links.map((link) => {
          const IconComponent = link.icon;
          // Only mark as active if the path matches exactly
          const isActive = location.pathname === link.href;
          return (
            <button
              key={link.name}
              onClick={() => navigate(link.href)}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-left transition-all duration-200 group ${
                isActive
                  ? "bg-[#3aafef] text-white shadow-lg"
                  : "text-slate-300 hover:bg-slate-700/50 hover:text-white"
              }`}
            >
              <IconComponent
                className={`w-5 h-5 ${
                  isActive ? "text-white" : "text-slate-400 group-hover:text-white"
                }`}
              />
              {!isCollapsed && <span className="font-medium">{link.name}</span>}
            </button>
          );
        })}
      </nav>
    </aside>
  );
};

export default Sidebar;
