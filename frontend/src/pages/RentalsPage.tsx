import { useEffect, useState } from "react";
import { Link } from "react-router";
import { VehicleThumb } from "../components/VehicleCard";
import {
  Alert,
  Badge,
  Button,
  buttonClass,
  Card,
  ConfirmDialog,
  EmptyState,
  PageHeader,
  SegmentedControl,
  Spinner,
  SuccessAlert,
} from "../components/ui";
import { api, errorMessage } from "../lib/api";
import { formatCurrency, formatDateTime, rentalStatusLabels } from "../lib/format";
import { illustrations } from "../lib/illustrations";
import { useFlashMessage } from "../lib/useFlashMessage";
import type { Rental, RentalStatus } from "../types";

const filters: { value: RentalStatus | ""; label: string }[] = [
  { value: "", label: "Todas" },
  { value: "ACTIVE", label: "Em andamento" },
  { value: "FINISHED", label: "Finalizadas" },
];

function isLate(rental: Rental) {
  return rental.status === "ACTIVE" && new Date(rental.expectedReturnDate) < new Date();
}

export function RentalsPage() {
  const [rentals, setRentals] = useState<Rental[]>([]);
  const [status, setStatus] = useState<RentalStatus | "">("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useFlashMessage();
  const [toFinish, setToFinish] = useState<Rental | null>(null);
  const [finishing, setFinishing] = useState(false);

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

  async function handleFinish() {
    if (!toFinish) return;
    setFinishing(true);
    setError("");
    try {
      const updated = await api<Rental>(`/rentals/${toFinish.id}/finish`, { method: "PATCH" });
      setRentals((current) =>
        status === "ACTIVE"
          ? current.filter((item) => item.id !== updated.id)
          : current.map((item) => (item.id === updated.id ? updated : item)),
      );
      setSuccess(`Locação #${updated.id} finalizada. O ${updated.vehicle.brand} ${updated.vehicle.model} está disponível novamente.`);
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setFinishing(false);
      setToFinish(null);
    }
  }

  return (
    <>
      <PageHeader
        title="Minhas locações"
        description="Acompanhe suas locações em andamento e o histórico das finalizadas."
        action={<SegmentedControl options={filters} value={status} onChange={setStatus} />}
      />

      {success && (
        <div className="mb-6">
          <SuccessAlert onClose={() => setSuccess("")}>{success}</SuccessAlert>
        </div>
      )}

      {error && (
        <div className="mb-6">
          <Alert>{error}</Alert>
        </div>
      )}

      {loading ? (
        <Spinner />
      ) : rentals.length === 0 ? (
        <EmptyState image={illustrations.clipboard} title="Nenhuma locação por aqui">
          <Link to="/vehicles" className={`${buttonClass("primary")} mt-5`}>
            Ver veículos disponíveis
          </Link>
        </EmptyState>
      ) : (
        <Card className="overflow-hidden">
          <div className="hidden grid-cols-[1.5fr_1.4fr_1fr_1fr_auto] gap-4 border-b border-slate-100 px-6 py-4 text-sm font-medium text-slate-500 md:grid">
            <span>Veículo</span>
            <span>Período contratado</span>
            <span>Situação</span>
            <span>Valor total</span>
            <span className="w-44" />
          </div>

          <ul className="divide-y divide-slate-100">
            {rentals.map((rental) => (
              <li
                key={rental.id}
                className="grid gap-4 px-6 py-5 transition hover:bg-slate-50/60 md:grid-cols-[1.5fr_1.4fr_1fr_1fr_auto] md:items-center"
              >
                <div className="flex min-w-0 items-center gap-4">
                  <VehicleThumb vehicle={rental.vehicle} />
                  <div className="min-w-0">
                    <p className="truncate font-semibold text-ink">
                      {rental.vehicle.brand} {rental.vehicle.model}
                    </p>
                    <p className="truncate text-sm text-slate-500">
                      <span className="font-mono">{rental.vehicle.plate}</span> · #{rental.id}
                    </p>
                  </div>
                </div>

                <div className="text-sm">
                  <p className="text-ink">{formatDateTime(rental.startDate)}</p>
                  <p className="text-ink">até {formatDateTime(rental.expectedReturnDate)}</p>
                  {rental.returnedAt && (
                    <p className="text-xs text-slate-500">Devolvido em {formatDateTime(rental.returnedAt)}</p>
                  )}
                </div>

                <div className="flex flex-wrap gap-2">
                  <Badge tone={rental.status === "ACTIVE" ? "blue" : "green"}>{rentalStatusLabels[rental.status]}</Badge>
                  {isLate(rental) && <Badge tone="orange">Atrasada</Badge>}
                </div>

                <div>
                  <p className="font-bold text-ink">{formatCurrency(rental.totalAmount)}</p>
                  <p className="text-xs text-slate-500">{formatCurrency(rental.dailyRate)} /dia</p>
                </div>

                <div className="md:w-44 md:text-right">
                  {rental.status === "ACTIVE" && (
                    <Button
                      variant="secondary"
                      className="h-10 w-full whitespace-nowrap px-4 md:w-auto"
                      onClick={() => setToFinish(rental)}
                    >
                      Finalizar locação
                    </Button>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </Card>
      )}

      <ConfirmDialog
        open={toFinish !== null}
        image={illustrations.key}
        title="Finalizar locação"
        description={
          toFinish && (
            <>
              Confirma a devolução do <strong className="text-ink">{`${toFinish.vehicle.brand} ${toFinish.vehicle.model}`}</strong>?
              A data de devolução será registrada e o veículo voltará a ficar disponível.
            </>
          )
        }
        confirmLabel="Finalizar"
        loading={finishing}
        onConfirm={handleFinish}
        onClose={() => setToFinish(null)}
      />
    </>
  );
}
