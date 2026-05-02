import { useContext } from "react";
import { ExpenseContext } from "./expenseContext";

export function useExpenses() {
  const context = useContext(ExpenseContext);
  if (!context) {
    throw new Error("useExpenses must be used inside ExpenseProvider");
  }
  return context;
}
