import { useEffect, useMemo, useState } from "react";
import { useExpenses } from "../context/useExpenses";
import { categoryColors } from "../data/seedExpenses";
import { formatCurrency } from "../utils";

export default function Reports() {
  const { expenses, totals } = useExpenses();
  const [rates, setRates] = useState(null);
  const [apiState, setApiState] = useState("loading");

  useEffect(() => {
    const controller = new AbortController();

    async function loadRates() {
      try {
        setApiState("loading");
        const response = await fetch("https://open.er-api.com/v6/latest/INR", {
          signal: controller.signal,
        });
        if (!response.ok) throw new Error("Unable to load rates");
        const data = await response.json();
        setRates(data.rates);
        setApiState("success");
      } catch (error) {
        if (error.name !== "AbortError") setApiState("error");
      }
    }

    loadRates();
    const interval = window.setInterval(loadRates, 60000);
    return () => {
      controller.abort();
      window.clearInterval(interval);
    };
  }, []);

  const categorySummary = useMemo(() => {
    const grouped = expenses.reduce((acc, expense) => {
      acc[expense.category] = (acc[expense.category] ?? 0) + Number(expense.amount);
      return acc;
    }, {});

    return Object.entries(grouped)
      .map(([category, amount]) => ({
        category,
        amount,
        percentage: totals.total ? (amount / totals.total) * 100 : 0,
      }))
      .sort((a, b) => b.amount - a.amount);
  }, [expenses, totals.total]);

  const usdValue = rates?.USD ? totals.total * rates.USD : null;
  const eurValue = rates?.EUR ? totals.total * rates.EUR : null;

  return (
    <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
      <section className="surface p-5">
        <h2 className="panel-title">Category Report</h2>
        <div className="mt-5 space-y-4">
          {categorySummary.map((item) => (
            <div key={item.category}>
              <div className="mb-2 flex items-center justify-between text-sm">
                <span className="font-bold">{item.category}</span>
                <span>{formatCurrency(item.amount)}</span>
              </div>
              <div className="h-3 rounded-full bg-slate-100 dark:bg-slate-800">
                <div
                  className="h-3 rounded-full"
                  style={{
                    width: `${item.percentage}%`,
                    backgroundColor: categoryColors[item.category] ?? "#64748b",
                  }}
                />
              </div>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                {item.percentage.toFixed(1)}% of total spending
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="surface p-5">
        <h2 className="panel-title">Currency API Integration</h2>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
          Fetch API refreshes INR exchange rates every minute from a public endpoint.
        </p>

        <div className="mt-5 rounded-lg border border-slate-200 p-4 dark:border-slate-800">
          <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">Total in INR</p>
          <p className="mt-2 text-3xl font-bold">{formatCurrency(totals.total)}</p>
        </div>

        {apiState === "loading" && <p className="mt-4 text-sm text-slate-500">Loading exchange rates...</p>}
        {apiState === "error" && (
          <p className="mt-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-800 dark:border-red-900 dark:bg-red-950 dark:text-red-100">
            Could not load live exchange rates. CRUD and reports still work offline.
          </p>
        )}
        {apiState === "success" && (
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <div className="rounded-lg bg-slate-100 p-4 dark:bg-slate-800">
              <p className="text-sm text-slate-500 dark:text-slate-400">Approx. USD</p>
              <p className="mt-2 text-xl font-bold">${usdValue?.toFixed(2)}</p>
            </div>
            <div className="rounded-lg bg-slate-100 p-4 dark:bg-slate-800">
              <p className="text-sm text-slate-500 dark:text-slate-400">Approx. EUR</p>
              <p className="mt-2 text-xl font-bold">€{eurValue?.toFixed(2)}</p>
            </div>
          </div>
        )}

        <div className="mt-6 rounded-lg bg-teal-50 p-4 text-sm text-teal-900 dark:bg-teal-950 dark:text-teal-100">
          Project coverage: React Router, Context API, async Fetch API, CRUD, charts,
          pagination, dark mode, memoized summaries, validation, and error handling.
        </div>
      </section>
    </div>
  );
}
