import { useEffect, useState } from "react";
import { Link } from "react-router";
import { Alert, Badge, Button, buttonClass, EmptyState, PageHeader, Spinner } from "../components/ui";
import { useAuth } from "../contexts/AuthContext";
import { api, errorMessage } from "../lib/api";
import { formatCurrency, formatDate, formatDateTime, rentalStatusLabels, toInputDate } from "../lib/format";
import type { Rental, RentalStatus } from "../types";

const filters: { value: RentalStatus | ""; label: string }[] = [
  { value: "", label: "Todas" },
  { value: "ACTIVE", label: "Em andamento" },
  { value: "RETURNED", label: "Devolvidas" },
];

function isLate(rental: Rental) {
  return rental.status === "ACTIVE" && rental.expectedReturnDate.slice(0, 10) < toInputDate(new Date());
}

export function RentalsPage() {
  const { isAdmin } = useAuth();
  const [rentals, setRentals] = useState<Rental[]>([]);
  const [status, setStatus] = useState<RentalStatus | "">("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [returningId, setReturningId] = useState<number | null>(null);

  useEffect(() => {
    setLoading(true);
    api<Rental[]>(`/rentals${status ? `?status=${status}` : ""}`)
      .then((data) => {
        setRentals(data);
        setError("");
      })
      .catch((err) => setError(errorMessage(err)))
      .finally(() => setLoading(false));
  }, [status]);

  async function handleReturn(rental: Rental) {
    if (!confirm(`Confirmar a devolução do ${rental.vehicle.brand} ${rental.vehicle.model}?`)) return;
    setReturningId(rental.id);
    try {
      const updated = await api<Rental>(`/rentals/${rental.id}/return`, { method: "PATCH" });
      setRentals((current) =>
        status === "ACTIVE"
          ? current.filter((item) => item.id !== rental.id)
          : current.map((item) => (item.id === rental.id ? updated : item)),
      );
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setReturningId(null);
    }
  }

  return (
    <>
      <PageHeader
        title={isAdmin ? "Locações" : "Minhas locações"}
        description={isAdmin ? "Acompanhe todas as locações e registre devoluções." : "Acompanhe suas locações e devoluções."}
        action={
          <div className="inline-flex rounded-lg border border-slate-200 bg-white p-1">
            {filters.map((filter) => (
              <button
                key={filter.value}
                onClick={() => setStatus(filter.value)}
                className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                  status === filter.value ? "bg-teal-700 text-white" : "text-slate-600 hover:text-slate-900"
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>
        }
      />

      {error && (
        <div className="mb-4">
          <Alert>{error}</Alert>
        </div>
      )}

      {loading ? (
        <Spinner />
      ) : rentals.length === 0 ? (
        <EmptyState>
          Nenhuma locação encontrada.{" "}
          {!isAdmin && (
            <Link to="/" className={`${buttonClass("ghost")} text-teal-700`}>
              Ver veículos disponíveis
            </Link>
          )}
        </EmptyState>
      ) : (
        <div className="space-y-3">
          {rentals.map((rental) => (
            <article
              key={rental.id}
              className="grid gap-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm md:grid-cols-[1.4fr_1fr_1fr_auto] md:items-center"
            >
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="font-semibold text-slate-900">
                    {rental.vehicle.brand} {rental.vehicle.model}
                  </h2>
                  <Badge tone={rental.status === "ACTIVE" ? "blue" : "slate"}>{rentalStatusLabels[rental.status]}</Badge>
                  {isLate(rental) && <Badge tone="amber">Atrasada</Badge>}
                </div>
                <p className="text-sm text-slate-500">
                  <span className="font-mono">{rental.vehicle.plate}</span> · Locação #{rental.id}
                  {isAdmin && ` · ${rental.user.name}`}
                </p>
              </div>

              <dl className="text-sm">
                <dt className="text-slate-500">Período</dt>
                <dd className="text-slate-900">
                  {formatDate(rental.startDate)} → {formatDate(rental.expectedReturnDate)}
                </dd>
                {rental.returnedAt && (
                  <dd className="text-xs text-slate-500">Devolvido em {formatDateTime(rental.returnedAt)}</dd>
                )}
              </dl>

              <dl className="text-sm">
                <dt className="text-slate-500">{rental.totalAmount ? "Valor final" : "Valor estimado"}</dt>
                <dd className="font-semibold text-slate-900">{formatCurrency(rental.totalAmount ?? rental.estimatedAmount)}</dd>
                <dd className="text-xs text-slate-500">{formatCurrency(rental.dailyRate)} /dia</dd>
              </dl>

              <div className="md:text-right">
                {rental.status === "ACTIVE" && (
                  <Button
                    variant="secondary"
                    disabled={returningId === rental.id}
                    onClick={() => handleReturn(rental)}
                  >
                    {returningId === rental.id ? "Registrando..." : "Registrar devolução"}
                  </Button>
                )}
              </div>
            </article>
          ))}
        </div>
      )}
    </>
  );
}
