import { Link, NavLink, Outlet, useNavigate } from "react-router";
import { useAuth } from "../contexts/AuthContext";
import { Button, buttonClass, CarIcon } from "./ui";

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  `whitespace-nowrap rounded-lg px-2.5 py-2 text-sm font-medium transition-colors sm:px-3 ${
    isActive ? "bg-teal-50 text-teal-800" : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
  }`;

export function Layout() {
  const { user, isAdmin, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/login");
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/90 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center gap-3 px-4 sm:gap-6">
          <Link to="/" className="flex items-center gap-2 font-semibold text-slate-900">
            <span className="flex size-8 items-center justify-center rounded-lg bg-teal-700 text-white">
              <CarIcon className="size-5" />
            </span>
            <span className="hidden sm:inline">Locadora</span>
          </Link>

          <nav className="flex flex-1 items-center gap-1">
            <NavLink to="/" end className={navLinkClass}>
              Veículos
            </NavLink>
            {user && (
              <NavLink to="/rentals" className={navLinkClass}>
                {isAdmin ? "Locações" : "Minhas locações"}
              </NavLink>
            )}
          </nav>

          {user ? (
            <div className="flex items-center gap-3">
              <div className="hidden text-right text-sm md:block">
                <p className="font-medium text-slate-900">{user.name}</p>
                <p className="text-xs text-slate-500">{isAdmin ? "Administrador" : "Cliente"}</p>
              </div>
              <Button variant="secondary" onClick={handleLogout}>
                Sair
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link to="/login" className={buttonClass("ghost")}>
                Entrar
              </Link>
              <Link to="/register" className={buttonClass("primary")}>
                Criar conta
              </Link>
            </div>
          )}
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8">
        <Outlet />
      </main>
    </div>
  );
}
