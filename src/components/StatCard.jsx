export default function StatCard({ label, value, detail, tone = "teal", icon: Icon }) {
  const tones = {
    teal: "bg-teal-50 text-teal-700 dark:bg-teal-950 dark:text-teal-200",
    blue: "bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-200",
    rose: "bg-rose-50 text-rose-700 dark:bg-rose-950 dark:text-rose-200",
    amber: "bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-200",
  };

  return (
    <section className="surface p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-bold text-slate-500 dark:text-slate-400">{label}</p>
          <p className="mt-3 text-2xl font-black text-slate-950 dark:text-white">{value}</p>
        </div>
        {Icon && (
          <div className={`flex h-11 w-11 items-center justify-center rounded-lg ${tones[tone]}`}>
            <Icon size={21} />
          </div>
        )}
      </div>
      <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">{detail}</p>
    </section>
  );
}
