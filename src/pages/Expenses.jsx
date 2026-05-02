import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, Pencil, Search, Trash2 } from "lucide-react";
import ExpenseForm from "../components/ExpenseForm";
import { useExpenses } from "../context/useExpenses";
import { categories } from "../data/seedExpenses";
import { formatCurrency, formatDate } from "../utils";

const PAGE_SIZE = 5;

export default function Expenses() {
  const { expenses, addExpense, updateExpense, deleteExpense } = useExpenses();
  const [selectedExpense, setSelectedExpense] = useState(null);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [sortBy, setSortBy] = useState("latest");
  const [page, setPage] = useState(1);

  const filteredExpenses = useMemo(() => {
    const query = search.trim().toLowerCase();
    return expenses
      .filter((expense) => {
        const matchesSearch = expense.title.toLowerCase().includes(query);
        const matchesCategory = category === "All" || expense.category === category;
        return matchesSearch && matchesCategory;
      })
      .sort((a, b) => {
        if (sortBy === "highest") return Number(b.amount) - Number(a.amount);
        if (sortBy === "lowest") return Number(a.amount) - Number(b.amount);
        return new Date(b.date) - new Date(a.date);
      });
  }, [expenses, search, category, sortBy]);

  const totalPages = Math.max(1, Math.ceil(filteredExpenses.length / PAGE_SIZE));
  const visibleExpenses = filteredExpenses.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  function handleSave(expense) {
    if (expense.id) {
      updateExpense(expense);
    } else {
      addExpense(expense);
    }
    setSelectedExpense(null);
    setPage(1);
  }

  function handleDelete(id) {
    deleteExpense(id);
    if (selectedExpense?.id === id) setSelectedExpense(null);
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[0.8fr_1.2fr]">
      <ExpenseForm
        selectedExpense={selectedExpense}
        onSave={handleSave}
        onCancel={() => setSelectedExpense(null)}
      />

      <section className="surface p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h2 className="text-lg font-bold">Expense Records</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Search, filter, sort, edit, delete, and paginate records.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            <label className="space-y-1">
              <span className="text-xs font-bold uppercase text-slate-500">Search</span>
              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-2.5 text-slate-400" size={16} />
                <input
                  value={search}
                  onChange={(event) => {
                    setSearch(event.target.value);
                    setPage(1);
                  }}
                  className="field pl-9"
                  placeholder="Expense title"
                />
              </div>
            </label>
            <label className="space-y-1">
              <span className="text-xs font-bold uppercase text-slate-500">Filter</span>
              <select
                value={category}
                onChange={(event) => {
                  setCategory(event.target.value);
                  setPage(1);
                }}
                className="field"
              >
                <option>All</option>
                {categories.map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </select>
            </label>
            <label className="space-y-1">
              <span className="text-xs font-bold uppercase text-slate-500">Sort</span>
              <select value={sortBy} onChange={(event) => setSortBy(event.target.value)} className="field">
                <option value="latest">Latest date</option>
                <option value="highest">Highest amount</option>
                <option value="lowest">Lowest amount</option>
              </select>
            </label>
          </div>
        </div>

        <div className="mt-5 overflow-hidden rounded-lg border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950">
          <div className="hidden grid-cols-[1.2fr_0.8fr_0.7fr_0.8fr_0.7fr] bg-slate-950 px-4 py-3 text-sm font-bold text-white dark:bg-slate-800 md:grid">
            <span>Title</span>
            <span>Category</span>
            <span>Amount</span>
            <span>Date</span>
            <span>Actions</span>
          </div>

          {visibleExpenses.length === 0 ? (
            <p className="p-6 text-center text-slate-500">No matching expenses found.</p>
          ) : (
            visibleExpenses.map((expense) => (
              <article
                key={expense.id}
                className="grid gap-2 border-t border-slate-200 px-4 py-4 text-sm transition hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-900 md:grid-cols-[1.2fr_0.8fr_0.7fr_0.8fr_0.7fr] md:items-center"
              >
                <div>
                  <p className="font-bold">{expense.title}</p>
                  <p className="text-slate-500 dark:text-slate-400">{expense.note}</p>
                </div>
                <span className="w-fit rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-bold dark:bg-slate-800">
                  {expense.category}
                </span>
                <span className="font-bold">{formatCurrency(expense.amount)}</span>
                <span>{formatDate(expense.date)}</span>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedExpense(expense)}
                    className="icon-button"
                    aria-label={`Edit ${expense.title}`}
                    title="Edit"
                  >
                    <Pencil size={16} />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(expense.id)}
                    className="icon-button text-red-700 hover:border-red-300 hover:bg-red-50 dark:text-red-300 dark:hover:bg-red-950"
                    aria-label={`Delete ${expense.title}`}
                    title="Delete"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </article>
            ))
          )}
        </div>

        <div className="mt-5 flex items-center justify-between">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Page {page} of {totalPages}
          </p>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setPage((current) => Math.max(1, current - 1))}
              disabled={page === 1}
              className="pager-button"
            >
              <ChevronLeft size={16} />
              Previous
            </button>
            <button
              type="button"
              onClick={() => setPage((current) => Math.min(totalPages, current + 1))}
              disabled={page === totalPages}
              className="pager-button"
            >
              Next
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
