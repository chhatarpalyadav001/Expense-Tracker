import { useEffect, useMemo, useReducer, useState } from "react";
import { seedExpenses } from "../data/seedExpenses";
import { ExpenseContext } from "./expenseContext";

const STORAGE_KEY = "personal-finance-expenses-v1";
const THEME_KEY = "personal-finance-theme-v1";

function getInitialExpenses() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : seedExpenses;
  } catch {
    return seedExpenses;
  }
}

function expenseReducer(state, action) {
  switch (action.type) {
    case "add":
      return [{ ...action.payload, id: crypto.randomUUID() }, ...state];
    case "update":
      return state.map((expense) =>
        expense.id === action.payload.id ? action.payload : expense,
      );
    case "delete":
      return state.filter((expense) => expense.id !== action.payload);
    default:
      return state;
  }
}

export function ExpenseProvider({ children }) {
  const [expenses, dispatch] = useReducer(expenseReducer, undefined, getInitialExpenses);
  const [isDark, setIsDark] = useState(() => localStorage.getItem(THEME_KEY) === "dark");

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(expenses));
  }, [expenses]);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark);
    localStorage.setItem(THEME_KEY, isDark ? "dark" : "light");
  }, [isDark]);

  const totals = useMemo(() => {
    const total = expenses.reduce((sum, expense) => sum + Number(expense.amount), 0);
    const average = expenses.length ? total / expenses.length : 0;
    const highest = expenses.reduce(
      (max, expense) => (Number(expense.amount) > Number(max.amount) ? expense : max),
      expenses[0] ?? { amount: 0, title: "No expenses" },
    );
    return { total, average, highest, count: expenses.length };
  }, [expenses]);

  const value = useMemo(
    () => ({
      expenses,
      totals,
      isDark,
      addExpense: (payload) => dispatch({ type: "add", payload }),
      updateExpense: (payload) => dispatch({ type: "update", payload }),
      deleteExpense: (id) => dispatch({ type: "delete", payload: id }),
      toggleTheme: () => setIsDark((current) => !current),
    }),
    [expenses, totals, isDark],
  );

  return <ExpenseContext.Provider value={value}>{children}</ExpenseContext.Provider>;
}
