import { useEffect, useState, type FormEvent } from "react";
import { Link, useNavigate, useParams } from "react-router";
import { VehicleImage, VehicleStatusBadge } from "../components/VehicleCard";
import { Alert, Button, buttonClass, Field, Input, Spinner } from "../components/ui";
import { api, errorMessage } from "../lib/api";
import { addDays, categoryLabels, daysBetween, formatCurrency, toInputDate } from "../lib/format";
import type { Vehicle } from "../types";

export function RentVehiclePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const today = toInputDate(new Date());
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [startDate, setStartDate] = useState(today);
  const [expectedReturnDate, setExpectedReturnDate] = useState(toInputDate(addDays(new Date(), 3)));
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    api<Vehicle>(`/vehicles/${id}`)
      .then(setVehicle)
      .catch((err) => setError(errorMessage(err)));
  }, [id]);

  const days = daysBetween(startDate, expectedReturnDate);
  const validPeriod = days > 0;

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await api("/rentals", { method: "POST", body: { vehicleId: Number(id), startDate, expectedReturnDate } });
      navigate("/rentals");
    } catch (err) {
      setError(errorMessage(err));
      setSubmitting(false);
    }
  }

  if (!vehicle) return error ? <Alert>{error}</Alert> : <Spinner />;

  return (
    <div className="mx-auto grid max-w-4xl gap-6 md:grid-cols-[1.1fr_1fr]">
      <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <VehicleImage vehicle={vehicle} className="aspect-[16/10] w-full" />
        <div className="space-y-3 p-5">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h1 className="text-xl font-semibold text-slate-900">
                {vehicle.brand} {vehicle.model}
              </h1>
              <p className="text-sm text-slate-500">{categoryLabels[vehicle.category]}</p>
            </div>
            <VehicleStatusBadge status={vehicle.status} />
          </div>
          <dl className="grid grid-cols-3 gap-3 text-sm">
            <div>
              <dt className="text-slate-500">Ano</dt>
              <dd className="font-medium text-slate-900">{vehicle.year}</dd>
            </div>
            <div>
              <dt className="text-slate-500">Cor</dt>
              <dd className="font-medium text-slate-900">{vehicle.color}</dd>
            </div>
            <div>
              <dt className="text-slate-500">Placa</dt>
              <dd className="font-mono font-medium text-slate-900">{vehicle.plate}</dd>
            </div>
          </dl>
        </div>
      </section>

      <form onSubmit={handleSubmit} className="space-y-5 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <div>
          <h2 className="font-semibold text-slate-900">Registrar locação</h2>
          <p className="text-sm text-slate-500">Diária de {formatCurrency(vehicle.dailyRate)}</p>
        </div>

        {error && <Alert>{error}</Alert>}

        <Field label="Data de retirada">
          <Input type="date" required min={today} value={startDate} onChange={(e) => setStartDate(e.target.value)} />
        </Field>
        <Field label="Devolução prevista">
          <Input
            type="date"
            required
            min={startDate}
            value={expectedReturnDate}
            onChange={(e) => setExpectedReturnDate(e.target.value)}
          />
        </Field>

        <div className="rounded-lg bg-slate-50 p-4 text-sm">
          <div className="flex justify-between text-slate-600">
            <span>Período</span>
            <span>{validPeriod ? `${days} diária${days > 1 ? "s" : ""}` : "—"}</span>
          </div>
          <div className="mt-2 flex justify-between border-t border-slate-200 pt-2 font-semibold text-slate-900">
            <span>Total estimado</span>
            <span>{validPeriod ? formatCurrency(Number(vehicle.dailyRate) * days) : "—"}</span>
          </div>
        </div>

        <div className="flex gap-2">
          <Link to="/" className={`${buttonClass("secondary")} flex-1`}>
            Voltar
          </Link>
          <Button type="submit" className="flex-1" disabled={submitting || !validPeriod || vehicle.status !== "AVAILABLE"}>
            {submitting ? "Confirmando..." : "Confirmar locação"}
          </Button>
        </div>
      </form>
    </div>
  );
}
