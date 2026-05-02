import { lazy, Suspense } from "react";
import { BarChart3, CreditCard, LayoutDashboard, Moon, Sun, WalletCards } from "lucide-react";
import { NavLink, Route, Routes } from "react-router-dom";
import { useExpenses } from "./context/useExpenses";

const Dashboard = lazy(() => import("./pages/Dashboard"));
const Expenses = lazy(() => import("./pages/Expenses"));
const Reports = lazy(() => import("./pages/Reports"));

const navItems = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/expenses", label: "Expenses", icon: CreditCard },
  { to: "/reports", label: "Reports", icon: BarChart3 },
];

function App() {
  const { isDark, toggleTheme } = useExpenses();

  return (
    <div className="min-h-screen bg-[#f3f6f4] text-slate-950 transition-colors dark:bg-[#080d13] dark:text-slate-100">
      <div className="pointer-events-none fixed inset-x-0 top-0 h-80 bg-[linear-gradient(135deg,rgba(15,118,110,0.18),rgba(37,99,235,0.14),rgba(219,39,119,0.09))] dark:bg-[linear-gradient(135deg,rgba(20,184,166,0.12),rgba(59,130,246,0.11),rgba(244,63,94,0.08))]" />
      <header className="sticky top-0 z-20 border-b border-white/70 bg-white/80 backdrop-blur-xl dark:border-slate-800/80 dark:bg-slate-950/78">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-4 sm:flex-row sm:items-center sm:justify-between lg:px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-slate-950 text-white shadow-soft dark:bg-white dark:text-slate-950">
              <WalletCards size={25} strokeWidth={2.2} />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-teal-700 dark:text-teal-300">
                Finance Workspace
              </p>
              <h1 className="text-xl font-black tracking-normal sm:text-2xl">
                Expense Tracker
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <nav className="flex rounded-lg border border-white/80 bg-white/75 p-1 shadow-soft dark:border-slate-800 dark:bg-slate-900/80">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    className={({ isActive }) =>
                      `flex items-center gap-2 rounded-md px-3 py-2 text-sm font-bold transition ${
                        isActive
                          ? "bg-slate-950 text-white shadow-sm dark:bg-white dark:text-slate-950"
                          : "text-slate-600 hover:bg-slate-100 hover:text-slate-950 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
                      }`
                    }
                  >
                    <Icon size={16} />
                    <span className="hidden sm:inline">{item.label}</span>
                  </NavLink>
                );
              })}
            </nav>
            <button
              type="button"
              onClick={toggleTheme}
              className="inline-flex h-11 w-11 items-center justify-center rounded-lg border border-white/80 bg-white/85 text-slate-900 shadow-soft transition hover:-translate-y-0.5 hover:border-teal-300 dark:border-slate-800 dark:bg-slate-900 dark:text-white"
              aria-label="Toggle dark mode"
              title="Toggle dark mode"
            >
              {isDark ? <Sun size={19} /> : <Moon size={19} />}
            </button>
          </div>
        </div>
      </header>

      <main className="relative mx-auto max-w-7xl px-4 py-6 lg:px-8">
        <Suspense
          fallback={
            <div className="surface p-6">
              Loading finance workspace...
            </div>
          }
        >
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/expenses" element={<Expenses />} />
            <Route path="/reports" element={<Reports />} />
          </Routes>
        </Suspense>
      </main>
    </div>
  );
}

export default App;
