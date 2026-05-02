import { useMemo } from "react";
import { Activity, IndianRupee, ReceiptText, TrendingUp } from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import ErrorBoundary from "../components/ErrorBoundary";
import StatCard from "../components/StatCard";
import { useExpenses } from "../context/useExpenses";
import { categoryColors } from "../data/seedExpenses";
import { formatCurrency, monthLabel } from "../utils";

export default function Dashboard() {
  const { expenses, totals } = useExpenses();

  const categoryData = useMemo(() => {
    const grouped = expenses.reduce((acc, expense) => {
      acc[expense.category] = (acc[expense.category] ?? 0) + Number(expense.amount);
      return acc;
    }, {});
    return Object.entries(grouped).map(([name, value]) => ({ name, value }));
  }, [expenses]);

  const monthlyData = useMemo(() => {
    const grouped = expenses.reduce((acc, expense) => {
      const label = monthLabel(expense.date);
      acc[label] = (acc[label] ?? 0) + Number(expense.amount);
      return acc;
    }, {});
    return Object.entries(grouped).map(([month, total]) => ({ month, total }));
  }, [expenses]);

  const recentExpenses = expenses
    .slice()
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 5);

  return (
    <div className="space-y-6">
      <section className="overflow-hidden rounded-lg border border-white/80 bg-slate-950 text-white shadow-soft dark:border-slate-800">
        <div className="grid gap-6 p-6 md:grid-cols-[1.2fr_0.8fr] md:p-8">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.16em] text-teal-200">
              Personal finance command center
            </p>
            <h2 className="mt-3 max-w-2xl text-3xl font-black tracking-normal sm:text-4xl">
              Track spending, control categories, and explain your money story clearly.
            </h2>
            <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-300">
              Built for the capstone viva with CRUD records, analytics, API integration,
              routing, memoized summaries, and persistent local data.
            </p>
          </div>
          <div className="grid content-end gap-3 sm:grid-cols-2 md:grid-cols-1">
            <div className="rounded-lg border border-white/10 bg-white/10 p-4">
              <p className="text-sm text-slate-300">Current tracked spend</p>
              <p className="mt-2 text-3xl font-black">{formatCurrency(totals.total)}</p>
            </div>
            <div className="rounded-lg border border-white/10 bg-white/10 p-4">
              <p className="text-sm text-slate-300">Records analyzed</p>
              <p className="mt-2 text-3xl font-black">{totals.count}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Total Spending"
          value={formatCurrency(totals.total)}
          detail="Across all saved expenses"
          icon={IndianRupee}
          tone="teal"
        />
        <StatCard
          label="Average Entry"
          value={formatCurrency(totals.average)}
          detail="Memoized from current data"
          icon={Activity}
          tone="blue"
        />
        <StatCard
          label="Transactions"
          value={totals.count}
          detail="CRUD records in local storage"
          icon={ReceiptText}
          tone="rose"
        />
        <StatCard
          label="Highest Expense"
          value={formatCurrency(totals.highest.amount)}
          detail={totals.highest.title}
          icon={TrendingUp}
          tone="amber"
        />
      </section>

      <section className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <ErrorBoundary>
          <div className="chart-panel">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="panel-title">Category Spending</h2>
                <p className="panel-subtitle">Pie chart grouped by spending category.</p>
              </div>
            </div>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={categoryData} dataKey="value" nameKey="name" innerRadius={55} outerRadius={105} paddingAngle={3}>
                    {categoryData.map((entry) => (
                      <Cell key={entry.name} fill={categoryColors[entry.name] ?? "#64748b"} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => formatCurrency(value)} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-2 gap-2 text-sm sm:grid-cols-4">
              {categoryData.map((item) => (
                <span key={item.name} className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                  <span
                    className="h-3 w-3 rounded-full"
                    style={{ backgroundColor: categoryColors[item.name] ?? "#64748b" }}
                  />
                  {item.name}
                </span>
              ))}
            </div>
          </div>
        </ErrorBoundary>

        <ErrorBoundary>
          <div className="chart-panel">
            <h2 className="panel-title">Monthly Spending</h2>
            <p className="panel-subtitle">Bar chart showing month-wise totals.</p>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#d1d5db" />
                  <XAxis dataKey="month" />
                  <YAxis tickFormatter={(value) => `₹${value / 1000}k`} />
                  <Tooltip formatter={(value) => formatCurrency(value)} />
                  <Bar dataKey="total" fill="#0f766e" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </ErrorBoundary>
      </section>

      <section className="surface p-5">
        <h2 className="panel-title">Recent Expenses</h2>
        <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-5">
          {recentExpenses.map((expense) => (
            <article key={expense.id} className="rounded-lg border border-slate-200 bg-slate-50 p-4 transition hover:-translate-y-0.5 hover:shadow-soft dark:border-slate-800 dark:bg-slate-950">
              <p className="font-bold">{expense.title}</p>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{expense.category}</p>
              <p className="mt-4 text-lg font-bold text-teal-700 dark:text-teal-300">
                {formatCurrency(expense.amount)}
              </p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
