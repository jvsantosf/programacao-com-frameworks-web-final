import { Car, ClipboardList, LogIn, LogOut, Plus, UserPlus, type LucideIcon } from "lucide-react";
import { Link, NavLink, Outlet, useNavigate } from "react-router";
import { useAuth } from "../contexts/AuthContext";
import { buttonClass } from "./ui";

interface NavItem {
  to: string;
  label: string;
  icon: LucideIcon;
  end?: boolean;
}

export function Logo() {
  return (
    <Link to="/" className="flex items-center gap-2.5">
      <span className="flex size-10 items-center justify-center rounded-xl bg-brand-500 text-white shadow-md shadow-brand-500/30">
        <Car className="size-5" strokeWidth={2.4} />
      </span>
      <span className="text-lg font-bold tracking-tight text-ink">Locadora</span>
    </Link>
  );
}

function initials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join("");
}

export function Layout() {
  const { user, isAdmin, logout } = useAuth();
  const navigate = useNavigate();

  const items: NavItem[] = [{ to: "/", label: "Veículos", icon: Car, end: true }];
  if (user) items.push({ to: "/rentals", label: isAdmin ? "Locações" : "Minhas locações", icon: ClipboardList });
  if (isAdmin) items.push({ to: "/vehicles/new", label: "Novo veículo", icon: Plus });

  function handleLogout() {
    logout();
    navigate("/login");
  }

  const navClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-3 whitespace-nowrap rounded-full px-4 py-2.5 text-sm font-medium transition-colors ${
      isActive ? "bg-brand-500 text-white shadow-md shadow-brand-500/25" : "text-slate-500 hover:bg-slate-100 hover:text-ink"
    }`;

  return (
    <div className="min-h-screen bg-canvas lg:flex">
      <aside className="sticky top-0 z-20 border-b border-slate-100 bg-white lg:flex lg:h-screen lg:w-72 lg:shrink-0 lg:flex-col lg:border-b-0 lg:border-r">
        <div className="flex h-16 items-center justify-between px-4 lg:h-24 lg:px-7">
          <Logo />
          {!user && (
            <Link to="/login" className={`${buttonClass("secondary")} h-9 px-4 lg:hidden`}>
              Entrar
            </Link>
          )}
          {user && (
            <button onClick={handleLogout} aria-label="Sair" className="rounded-full p-2 text-slate-500 hover:bg-slate-100 lg:hidden">
              <LogOut className="size-5" />
            </button>
          )}
        </div>

        <nav className="flex gap-1 overflow-x-auto px-4 pb-3 lg:flex-1 lg:flex-col lg:gap-1.5 lg:px-5 lg:pb-0">
          {items.map(({ to, label, icon: Icon, end }) => (
            <NavLink key={to} to={to} end={end} className={navClass}>
              <Icon className="size-[18px]" />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden p-5 lg:block">
          {user ? (
            <div className="flex items-center gap-3 rounded-2xl bg-canvas p-3">
              <span className="flex size-10 items-center justify-center rounded-full bg-brand-100 text-sm font-bold text-brand-600">
                {initials(user.name)}
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-ink">{user.name}</p>
                <p className="text-xs text-slate-500">{isAdmin ? "Administrador" : "Cliente"}</p>
              </div>
              <button
                onClick={handleLogout}
                aria-label="Sair"
                className="rounded-full p-2 text-slate-400 transition hover:bg-white hover:text-brand-600"
              >
                <LogOut className="size-[18px]" />
              </button>
            </div>
          ) : (
            <div className="space-y-2">
              <Link to="/register" className={`${buttonClass("primary")} w-full`}>
                <UserPlus className="size-4" />
                Criar conta
              </Link>
              <Link to="/login" className={`${buttonClass("secondary")} w-full`}>
                <LogIn className="size-4" />
                Entrar
              </Link>
            </div>
          )}
        </div>
      </aside>

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 lg:px-10 lg:py-10">
        <Outlet />
      </main>
    </div>
  );
}
