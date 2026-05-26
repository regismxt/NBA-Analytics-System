import { Activity, BarChart3, GitCompare, Home, Shield, Trophy, Users } from "lucide-react";
import { NavLink, Outlet } from "react-router-dom";

const navItems = [
  { to: "/", label: "Dashboard", icon: Home },
  { to: "/games", label: "Jogos", icon: Activity },
  { to: "/players", label: "Jogadores", icon: Users },
  { to: "/teams", label: "Times", icon: Shield },
  { to: "/analytics", label: "Analytics", icon: BarChart3 },
  { to: "/compare", label: "Comparar", icon: GitCompare }
];

export function AppShell() {
  return (
    <div className="min-h-screen text-slate-100">
      <aside className="fixed inset-y-0 left-0 z-20 hidden w-64 border-r border-white/10 bg-ink/90 px-4 py-5 backdrop-blur lg:block">
        <div className="mb-8 flex items-center gap-3 px-2">
          <div className="grid h-11 w-11 place-items-center rounded-lg bg-rim text-ink">
            <Trophy size={23} />
          </div>
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-rim">NBA</p>
            <h1 className="text-lg font-bold leading-tight">Live Analytics</h1>
          </div>
        </div>
        <nav className="space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === "/"}
              className={({ isActive }) =>
                [
                  "flex h-11 items-center gap-3 rounded-lg px-3 text-sm font-medium transition",
                  isActive ? "bg-rim text-ink" : "text-slate-300 hover:bg-white/10 hover:text-white"
                ].join(" ")
              }
            >
              <item.icon size={18} />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>
      </aside>

      <div className="lg:pl-64">
        <header className="sticky top-0 z-10 border-b border-white/10 bg-ink/78 px-4 py-3 backdrop-blur lg:hidden">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 font-bold">
              <Trophy className="text-rim" size={22} />
              NBA Live Analytics
            </div>
          </div>
          <nav className="mt-3 flex gap-2 overflow-x-auto pb-1">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === "/"}
                className={({ isActive }) =>
                  [
                    "flex h-9 shrink-0 items-center gap-2 rounded-lg px-3 text-sm",
                    isActive ? "bg-rim text-ink" : "bg-white/5 text-slate-300"
                  ].join(" ")
                }
              >
                <item.icon size={16} />
                {item.label}
              </NavLink>
            ))}
          </nav>
        </header>

        <main className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
