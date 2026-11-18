import { ArrowLeft } from "lucide-react";
import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router";
import { Alert, Button, buttonClass, Card, Field, Illustration, Input, Select } from "../components/ui";
import { api, errorMessage } from "../lib/api";
import { categoryLabels } from "../lib/format";
import { illustrations } from "../lib/illustrations";
import type { Vehicle } from "../types";

const emptyForm = {
  brand: "",
  model: "",
  year: String(new Date().getFullYear()),
  plate: "",
  color: "",
  category: "ECONOMY",
  dailyRate: "",
};

type FormState = typeof emptyForm;

export function VehicleFormPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState<FormState>(emptyForm);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  function update(field: keyof FormState) {
    return (event: { target: { value: string } }) => setForm((current) => ({ ...current, [field]: event.target.value }));
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      const vehicle = await api<Vehicle>("/vehicles", {
        method: "POST",
        body: { ...form, year: Number(form.year), dailyRate: Number(form.dailyRate) },
      });
      navigate("/vehicles", {
        state: { success: `${vehicle.brand} ${vehicle.model} (${vehicle.plate}) cadastrado com sucesso.` },
      });
    } catch (err) {
      setError(errorMessage(err));
      setSubmitting(false);
    }
  }

  return (
    <div className="mx-auto max-w-2xl">
      <Link to="/vehicles" className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-ink">
        <ArrowLeft className="size-4" />
        Voltar para os veículos
      </Link>

      <Card className="p-8 sm:p-10">
        <div className="text-center">
          <Illustration src={illustrations.automobile} className="mx-auto size-24" />
          <h1 className="mt-4 text-[28px] font-bold tracking-tight text-ink">Cadastrar veículo</h1>
          <p className="mt-2 text-slate-500">Adicione um novo veículo à frota da locadora.</p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          {error && <Alert>{error}</Alert>}

          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Marca">
              <Input required value={form.brand} onChange={update("brand")} placeholder="Ex.: Toyota" />
            </Field>
            <Field label="Modelo">
              <Input required value={form.model} onChange={update("model")} placeholder="Ex.: Corolla" />
            </Field>
            <Field label="Ano">
              <Input type="number" required min={1990} value={form.year} onChange={update("year")} />
            </Field>
            <Field label="Placa">
              <Input required value={form.plate} onChange={update("plate")} placeholder="ABC1D23" className="uppercase" />
            </Field>
            <Field label="Cor">
              <Input required value={form.color} onChange={update("color")} placeholder="Ex.: Prata" />
            </Field>
            <Field label="Categoria">
              <Select value={form.category} onChange={update("category")}>
                {Object.entries(categoryLabels).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </Select>
            </Field>
          </div>

          <Field label="Valor da diária (R$)">
            <Input
              type="number"
              required
              min="0.01"
              step="0.01"
              value={form.dailyRate}
              onChange={update("dailyRate")}
              placeholder="0,00"
            />
          </Field>

          <div className="grid grid-cols-2 gap-3 pt-3">
            <Link to="/vehicles" className={buttonClass("secondary")}>
              Cancelar
            </Link>
            <Button type="submit" disabled={submitting}>
              {submitting ? "Salvando..." : "Cadastrar"}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
