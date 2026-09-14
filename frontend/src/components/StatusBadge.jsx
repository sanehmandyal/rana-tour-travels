import { CheckCircle2, Clock, XCircle, AlertCircle, Sparkles } from "lucide-react";

export default function StatusBadge({ status }) {
  const map = {
    New: {
      bg: "bg-amber-50 text-amber-700 border-amber-200",
      icon: Clock,
    },
    Contacted: {
      bg: "bg-blue-50 text-blue-700 border-blue-200",
      icon: Sparkles,
    },
    "Quote Sent": {
      bg: "bg-purple-50 text-purple-700 border-purple-200",
      icon: Sparkles,
    },
    "Awaiting Confirmation": {
      bg: "bg-yellow-50 text-yellow-800 border-yellow-200",
      icon: Clock,
    },
    Confirmed: {
      bg: "bg-teal-50 text-teal-700 border-teal-200",
      icon: CheckCircle2,
    },
    "In Progress": {
      bg: "bg-indigo-50 text-indigo-700 border-indigo-200",
      icon: Sparkles,
    },
    Completed: {
      bg: "bg-emerald-100 text-emerald-800 border-emerald-300 font-bold shadow-xs",
      icon: CheckCircle2,
    },
    Cancelled: {
      bg: "bg-rose-50 text-rose-700 border-rose-200",
      icon: XCircle,
    },
  };

  const current = map[status] || {
    bg: "bg-slate-100 text-slate-700 border-slate-200",
    icon: AlertCircle,
  };

  const Icon = current.icon;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${current.bg}`}
    >
      <Icon size={13} className="shrink-0" />
      {status}
    </span>
  );
}
