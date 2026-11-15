import { Check, X } from "lucide-react";
import { useEffect, type ButtonHTMLAttributes, type InputHTMLAttributes, type ReactNode, type SelectHTMLAttributes } from "react";

type ButtonVariant = "primary" | "secondary" | "danger" | "ghost";

const buttonVariants: Record<ButtonVariant, string> = {
  primary: "bg-brand-500 text-white shadow-sm shadow-brand-500/30 hover:bg-brand-600 disabled:bg-brand-300 disabled:shadow-none",
  secondary: "border border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50",
  danger: "border border-red-100 bg-red-50 text-red-600 hover:bg-red-100",
  ghost: "text-slate-600 hover:bg-slate-100 hover:text-ink",
};

export const buttonClass = (variant: ButtonVariant = "primary") =>
  `inline-flex h-11 items-center justify-center gap-2 rounded-full px-6 text-sm font-semibold transition-colors disabled:cursor-not-allowed ${buttonVariants[variant]}`;

export function Button({
  variant = "primary",
  className = "",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: ButtonVariant }) {
  return <button className={`${buttonClass(variant)} ${className}`} {...props} />;
}

const fieldClass =
  "h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-[15px] text-ink placeholder:text-slate-400 transition focus:border-brand-500 focus:outline-none focus:ring-4 focus:ring-brand-500/15 disabled:bg-slate-50 disabled:text-slate-500";

export function Input({ className = "", ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return <input className={`${fieldClass} ${className}`} {...props} />;
}

export function Select({ className = "", ...props }: SelectHTMLAttributes<HTMLSelectElement>) {
  return <select className={`${fieldClass} ${className}`} {...props} />;
}

export function Field({ label, hint, children }: { label: string; hint?: string; children: ReactNode }) {
  return (
    <label className="block space-y-2">
      <span className="text-sm font-medium text-ink">{label}</span>
      {children}
      {hint && <span className="block text-[13px] text-slate-500">{hint}</span>}
    </label>
  );
}

export function Alert({ children }: { children: ReactNode }) {
  return <div className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">{children}</div>;
}

const badgeTones = {
  green: "bg-emerald-50 text-emerald-600",
  orange: "bg-brand-50 text-brand-600",
  slate: "bg-slate-100 text-slate-500",
  blue: "bg-indigo-50 text-indigo-600",
};

export function Badge({ tone, children }: { tone: keyof typeof badgeTones; children: ReactNode }) {
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${badgeTones[tone]}`}>
      <span className="size-1.5 rounded-full bg-current" />
      {children}
    </span>
  );
}

export function Card({ className = "", children }: { className?: string; children: ReactNode }) {
  return <div className={`rounded-3xl border border-slate-100 bg-white shadow-[0_1px_2px_rgb(16_23_39/0.04)] ${className}`}>{children}</div>;
}

export function Illustration({ src, className = "size-20" }: { src: string; className?: string }) {
  return <img src={src} alt="" aria-hidden="true" draggable={false} className={`select-none object-contain ${className}`} />;
}

export function PageHeader({ title, description, action }: { title: string; description?: string; action?: ReactNode }) {
  return (
    <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className="text-[28px] font-bold leading-tight tracking-tight text-ink">{title}</h1>
        {description && <p className="mt-1 text-slate-500">{description}</p>}
      </div>
      {action}
    </div>
  );
}

export function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
}: {
  options: { value: T; label: string }[];
  value: T;
  onChange: (value: T) => void;
}) {
  return (
    <div className="inline-flex rounded-full bg-slate-100 p-1">
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          onClick={() => onChange(option.value)}
          className={`rounded-full px-5 py-2 text-sm font-medium transition ${
            value === option.value ? "bg-white text-ink shadow-sm" : "text-slate-500 hover:text-ink"
          }`}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}

export function CheckItem({ children }: { children: ReactNode }) {
  return (
    <li className="flex items-center gap-3 text-slate-600">
      <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-brand-500 text-white">
        <Check className="size-3.5" strokeWidth={3} />
      </span>
      {children}
    </li>
  );
}

export function EmptyState({ image, title, children }: { image: string; title: string; children?: ReactNode }) {
  return (
    <Card className="flex flex-col items-center px-6 py-14 text-center">
      <Illustration src={image} className="size-20" />
      <h2 className="mt-4 text-lg font-semibold text-ink">{title}</h2>
      {children && <div className="mt-1 text-slate-500">{children}</div>}
    </Card>
  );
}

export function Spinner() {
  return (
    <div className="flex justify-center py-16">
      <div className="size-7 animate-spin rounded-full border-[3px] border-brand-100 border-t-brand-500" />
    </div>
  );
}

export function Modal({ open, onClose, children }: { open: boolean; onClose: () => void; children: ReactNode }) {
  useEffect(() => {
    if (!open) return;
    const handleKey = (event: KeyboardEvent) => event.key === "Escape" && onClose();
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-ink/40 backdrop-blur-sm" onClick={onClose} />
      <div role="dialog" aria-modal="true" className="relative w-full max-w-md rounded-3xl bg-white p-8 shadow-2xl">
        <button
          type="button"
          onClick={onClose}
          aria-label="Fechar"
          className="absolute right-5 top-5 rounded-full p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-ink"
        >
          <X className="size-5" />
        </button>
        {children}
      </div>
    </div>
  );
}

export function ConfirmDialog({
  open,
  image,
  title,
  description,
  confirmLabel,
  loading,
  onConfirm,
  onClose,
}: {
  open: boolean;
  image: string;
  title: string;
  description: ReactNode;
  confirmLabel: string;
  loading?: boolean;
  onConfirm: () => void;
  onClose: () => void;
}) {
  return (
    <Modal open={open} onClose={onClose}>
      <div className="text-center">
        <Illustration src={image} className="mx-auto size-24" />
        <h2 className="mt-4 text-2xl font-bold tracking-tight text-ink">{title}</h2>
        <div className="mt-2 text-slate-500">{description}</div>
      </div>
      <div className="mt-8 grid grid-cols-2 gap-3">
        <Button variant="secondary" onClick={onClose}>
          Cancelar
        </Button>
        <Button onClick={onConfirm} disabled={loading}>
          {loading ? "Aguarde..." : confirmLabel}
        </Button>
      </div>
    </Modal>
  );
}
