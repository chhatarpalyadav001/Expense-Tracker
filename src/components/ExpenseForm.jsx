import { useEffect, useState } from "react";
import { CheckCircle2, X } from "lucide-react";
import { categories } from "../data/seedExpenses";

const initialForm = {
  title: "",
  category: "Food",
  amount: "",
  date: new Date().toISOString().slice(0, 10),
  note: "",
};

export default function ExpenseForm({ selectedExpense, onSave, onCancel }) {
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    setForm(selectedExpense ?? initialForm);
    setErrors({});
  }, [selectedExpense]);

  function updateField(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  }

  function validate() {
    const nextErrors = {};
    if (!form.title.trim()) nextErrors.title = "Title is required";
    if (!form.amount || Number(form.amount) <= 0) nextErrors.amount = "Amount must be positive";
    if (!form.date) nextErrors.date = "Date is required";
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  function handleSubmit(event) {
    event.preventDefault();
    if (!validate()) return;
    onSave({ ...form, amount: Number(form.amount) });
    setForm(initialForm);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="surface p-5"
    >
      <div className="mb-5 flex items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold">{selectedExpense ? "Edit Expense" : "Add Expense"}</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Track spending with category and date details.
          </p>
        </div>
        {selectedExpense && (
          <button
            type="button"
            onClick={onCancel}
            className="icon-button"
            aria-label="Cancel edit"
            title="Cancel edit"
          >
            <X size={17} />
          </button>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="space-y-1">
          <span className="text-sm font-semibold">Title</span>
          <input
            name="title"
            value={form.title}
            onChange={updateField}
            className="field"
            placeholder="Lunch, books, cab..."
          />
          {errors.title && <span className="error-text">{errors.title}</span>}
        </label>

        <label className="space-y-1">
          <span className="text-sm font-semibold">Category</span>
          <select name="category" value={form.category} onChange={updateField} className="field">
            {categories.map((category) => (
              <option key={category}>{category}</option>
            ))}
          </select>
        </label>

        <label className="space-y-1">
          <span className="text-sm font-semibold">Amount</span>
          <input
            name="amount"
            type="number"
            min="1"
            value={form.amount}
            onChange={updateField}
            className="field"
            placeholder="1200"
          />
          {errors.amount && <span className="error-text">{errors.amount}</span>}
        </label>

        <label className="space-y-1">
          <span className="text-sm font-semibold">Date</span>
          <input name="date" type="date" value={form.date} onChange={updateField} className="field" />
          {errors.date && <span className="error-text">{errors.date}</span>}
        </label>
      </div>

      <label className="mt-4 block space-y-1">
        <span className="text-sm font-semibold">Note</span>
        <textarea
          name="note"
          value={form.note}
          onChange={updateField}
          className="field min-h-20 resize-y"
          placeholder="Optional note"
        />
      </label>

      <button
        type="submit"
        className="mt-5 inline-flex items-center gap-2 rounded-lg bg-slate-950 px-4 py-2.5 text-sm font-bold text-white shadow-soft transition hover:-translate-y-0.5 hover:bg-teal-800 dark:bg-white dark:text-slate-950 dark:hover:bg-teal-200"
      >
        <CheckCircle2 size={17} />
        {selectedExpense ? "Update Expense" : "Add Expense"}
      </button>
    </form>
  );
}
