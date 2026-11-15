import { useEffect, useState } from "react";
import { Link } from "react-router";
import { Alert, Badge, Button, buttonClass, Card, ConfirmDialog, EmptyState, Illustration, PageHeader, SegmentedControl, Spinner } from "../components/ui";
import { useAuth } from "../contexts/AuthContext";
import { api, errorMessage } from "../lib/api";
import { formatCurrency, formatDate, formatDateTime, rentalStatusLabels, toInputDate } from "../lib/format";
import { categoryIllustrations, illustrations } from "../lib/illustrations";
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
  const [toReturn, setToReturn] = useState<Rental | null>(null);
  const [returning, setReturning] = useState(false);

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

  async function handleReturn() {
    if (!toReturn) return;
    setReturning(true);
    try {
      const updated = await api<Rental>(`/rentals/${toReturn.id}/return`, { method: "PATCH" });
      setRentals((current) =>
        status === "ACTIVE"
          ? current.filter((item) => item.id !== updated.id)
          : current.map((item) => (item.id === updated.id ? updated : item)),
      );
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setReturning(false);
      setToReturn(null);
    }
  }

  return (
    <>
      <PageHeader
        title={isAdmin ? "Locações" : "Minhas locações"}
        description={isAdmin ? "Acompanhe todas as locações e registre devoluções." : "Acompanhe suas reservas e devoluções."}
        action={<SegmentedControl options={filters} value={status} onChange={setStatus} />}
      />

      {error && (
        <div className="mb-6">
          <Alert>{error}</Alert>
        </div>
      )}

      {loading ? (
        <Spinner />
      ) : rentals.length === 0 ? (
        <EmptyState image={illustrations.clipboard} title="Nenhuma locação por aqui">
          {!isAdmin && (
            <Link to="/" className={`${buttonClass("primary")} mt-5`}>
              Ver veículos disponíveis
            </Link>
          )}
        </EmptyState>
      ) : (
        <Card className="overflow-hidden">
          <div className="hidden grid-cols-[1.6fr_1.2fr_1fr_1fr_auto] gap-4 border-b border-slate-100 px-6 py-4 text-sm font-medium text-slate-500 md:grid">
            <span>Veículo</span>
            <span>Período</span>
            <span>Situação</span>
            <span>Valor</span>
            <span className="w-48" />
          </div>

          <ul className="divide-y divide-slate-100">
            {rentals.map((rental) => (
              <li
                key={rental.id}
                className="grid gap-4 px-6 py-5 transition hover:bg-slate-50/60 md:grid-cols-[1.6fr_1.2fr_1fr_1fr_auto] md:items-center"
              >
                <div className="flex items-center gap-4">
                  <span className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-brand-50">
                    <Illustration src={categoryIllustrations[rental.vehicle.category]} className="size-8" />
                  </span>
                  <div className="min-w-0">
                    <p className="truncate font-semibold text-ink">
                      {rental.vehicle.brand} {rental.vehicle.model}
                    </p>
                    <p className="truncate text-sm text-slate-500">
                      <span className="font-mono">{rental.vehicle.plate}</span> · #{rental.id}
                      {isAdmin && ` · ${rental.user.name}`}
                    </p>
                  </div>
                </div>

                <div className="text-sm">
                  <p className="text-ink">
                    {formatDate(rental.startDate)} → {formatDate(rental.expectedReturnDate)}
                  </p>
                  {rental.returnedAt && (
                    <p className="text-xs text-slate-500">Devolvido em {formatDateTime(rental.returnedAt)}</p>
                  )}
                </div>

                <div className="flex flex-wrap gap-2">
                  <Badge tone={rental.status === "ACTIVE" ? "blue" : "green"}>{rentalStatusLabels[rental.status]}</Badge>
                  {isLate(rental) && <Badge tone="orange">Atrasada</Badge>}
                </div>

                <div>
                  <p className="font-bold text-ink">{formatCurrency(rental.totalAmount ?? rental.estimatedAmount)}</p>
                  <p className="text-xs text-slate-500">{rental.totalAmount ? "Valor final" : "Estimado"}</p>
                </div>

                <div className="md:w-48 md:text-right">
                  {rental.status === "ACTIVE" && (
                    <Button variant="secondary" className="h-10 w-full whitespace-nowrap px-4 md:w-auto" onClick={() => setToReturn(rental)}>
                      Registrar devolução
                    </Button>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </Card>
      )}

      <ConfirmDialog
        open={toReturn !== null}
        image={illustrations.key}
        title="Registrar devolução"
        description={
          toReturn && (
            <>
              Confirma a devolução do <strong className="text-ink">{`${toReturn.vehicle.brand} ${toReturn.vehicle.model}`}</strong>?
              O valor final será calculado pelos dias utilizados e o veículo volta a ficar disponível.
            </>
          )
        }
        confirmLabel="Confirmar"
        loading={returning}
        onConfirm={handleReturn}
        onClose={() => setToReturn(null)}
      />
    </>
  );
}
