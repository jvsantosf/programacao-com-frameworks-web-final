import { ArrowLeft } from "lucide-react";
import { useEffect, useState, type FormEvent } from "react";
import { Link, useNavigate, useParams } from "react-router";
import { AvailabilityBadge, VehicleImage } from "../components/VehicleCard";
import { Alert, Button, Card, CheckItem, Field, Illustration, Input, Spinner } from "../components/ui";
import { api, errorMessage } from "../lib/api";
import { addDays, categoryLabels, chargeableDays, formatCurrency, toInputDateTime } from "../lib/format";
import { illustrations } from "../lib/illustrations";
import type { Rental, Vehicle } from "../types";

export function RentVehiclePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const now = toInputDateTime(new Date());
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [startDate, setStartDate] = useState(now);
  const [expectedReturnDate, setExpectedReturnDate] = useState(toInputDateTime(addDays(new Date(), 3)));
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    api<Vehicle>(`/vehicles/${id}`)
      .then(setVehicle)
      .catch((err) => setError(errorMessage(err)));
  }, [id]);

  const days = chargeableDays(startDate, expectedReturnDate);
  const validPeriod = days > 0;

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const rental = await api<Rental>("/rentals", {
        method: "POST",
        body: {
          vehicleId: Number(id),
          startDate: new Date(startDate).toISOString(),
          expectedReturnDate: new Date(expectedReturnDate).toISOString(),
        },
      });
      navigate("/rentals", {
        state: {
          success: `Locação #${rental.id} registrada: ${rental.vehicle.brand} ${rental.vehicle.model}, total de ${formatCurrency(rental.totalAmount)}.`,
        },
      });
    } catch (err) {
      setError(errorMessage(err));
      setSubmitting(false);
    }
  }

  if (!vehicle) return error ? <Alert>{error}</Alert> : <Spinner />;

  return (
    <>
      <Link to="/vehicles" className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-ink">
        <ArrowLeft className="size-4" />
        Voltar para os veículos
      </Link>

      <div className="grid gap-6 lg:grid-cols-[1.25fr_1fr]">
        <Card className="overflow-hidden p-2">
          <VehicleImage vehicle={vehicle} className="aspect-[16/10] w-full rounded-[20px]" />
          <div className="p-6">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-brand-600">{categoryLabels[vehicle.category]}</p>
                <h1 className="mt-1 text-3xl font-bold tracking-tight text-ink">
                  {vehicle.brand} {vehicle.model}
                </h1>
              </div>
              <AvailabilityBadge available={vehicle.available} />
            </div>

            <dl className="mt-6 grid grid-cols-3 gap-3">
              {[
                ["Ano", String(vehicle.year)],
                ["Cor", vehicle.color],
                ["Placa", vehicle.plate],
              ].map(([label, value]) => (
                <div key={label} className="rounded-2xl bg-canvas px-4 py-3">
                  <dt className="text-xs text-slate-500">{label}</dt>
                  <dd className="mt-0.5 font-semibold text-ink">{value}</dd>
                </div>
              ))}
            </dl>

            <ul className="mt-6 space-y-3 text-[15px]">
              <CheckItem>Diária fixada no momento da reserva</CheckItem>
              <CheckItem>Cada fração de 24 horas conta como uma diária completa</CheckItem>
            </ul>
          </div>
        </Card>

        <Card className="relative h-fit p-6 sm:p-8">
          <Illustration src={illustrations.calendar} className="absolute -top-6 right-6 size-16 rotate-6 drop-shadow-lg" />
          <h2 className="text-xl font-bold tracking-tight text-ink">Registrar locação</h2>
          <p className="mt-1 text-sm text-slate-500">Escolha o período da sua reserva.</p>

          <form onSubmit={handleSubmit} className="mt-6 space-y-5">
            {error && <Alert>{error}</Alert>}

            <Field label="Início da locação">
              <Input
                type="datetime-local"
                required
                min={now}
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </Field>
            <Field label="Devolução prevista">
              <Input
                type="datetime-local"
                required
                min={startDate}
                value={expectedReturnDate}
                onChange={(e) => setExpectedReturnDate(e.target.value)}
              />
            </Field>

            <div className="rounded-2xl border border-slate-100 p-4">
              <p className="font-semibold text-ink">Resumo financeiro</p>
              <div className="mt-3 space-y-2 border-t border-slate-100 pt-3 text-sm">
                <div className="flex justify-between text-slate-500">
                  <span>Valor da diária</span>
                  <span className="font-medium text-ink">{formatCurrency(vehicle.dailyRate)}</span>
                </div>
                <div className="flex justify-between text-slate-500">
                  <span>Diárias cobradas</span>
                  <span className="font-medium text-ink">{validPeriod ? days : "—"}</span>
                </div>
              </div>
              <div className="mt-3 flex items-center justify-between rounded-xl bg-indigo-50 px-4 py-3 text-indigo-600">
                <span className="font-medium">Valor total</span>
                <span className="text-lg font-bold">
                  {validPeriod ? formatCurrency(Number(vehicle.dailyRate) * days) : "—"}
                </span>
              </div>
            </div>

            <Button type="submit" className="h-12 w-full" disabled={submitting || !validPeriod || !vehicle.available}>
              {submitting ? "Confirmando..." : vehicle.available ? "Confirmar locação" : "Veículo indisponível"}
            </Button>
          </form>
        </Card>
      </div>
    </>
  );
}
