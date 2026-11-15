import { useEffect, useState, type FormEvent } from "react";
import { Link, useNavigate, useParams } from "react-router";
import { Alert, Button, buttonClass, Field, Input, PageHeader, Select, Spinner } from "../components/ui";
import { api, errorMessage } from "../lib/api";
import { categoryLabels } from "../lib/format";
import type { Vehicle } from "../types";

const emptyForm = {
  brand: "",
  model: "",
  year: String(new Date().getFullYear()),
  plate: "",
  color: "",
  category: "ECONOMY",
  dailyRate: "",
  status: "AVAILABLE",
  imageUrl: "",
};

type FormState = typeof emptyForm;

export function VehicleFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = Boolean(id);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [isRented, setIsRented] = useState(false);
  const [loading, setLoading] = useState(isEditing);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;
    api<Vehicle>(`/vehicles/${id}`)
      .then((vehicle) => {
        setIsRented(vehicle.status === "RENTED");
        setForm({
          brand: vehicle.brand,
          model: vehicle.model,
          year: String(vehicle.year),
          plate: vehicle.plate,
          color: vehicle.color,
          category: vehicle.category,
          dailyRate: String(Number(vehicle.dailyRate)),
          status: vehicle.status,
          imageUrl: vehicle.imageUrl ?? "",
        });
      })
      .catch((err) => setError(errorMessage(err)))
      .finally(() => setLoading(false));
  }, [id]);

  function update(field: keyof FormState) {
    return (event: { target: { value: string } }) => setForm((current) => ({ ...current, [field]: event.target.value }));
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError("");
    setSubmitting(true);

    const { status, ...rest } = form;
    const body = {
      ...rest,
      year: Number(form.year),
      dailyRate: Number(form.dailyRate),
      ...(isRented ? {} : { status }),
    };

    try {
      await api(isEditing ? `/vehicles/${id}` : "/vehicles", { method: isEditing ? "PUT" : "POST", body });
      navigate("/");
    } catch (err) {
      setError(errorMessage(err));
      setSubmitting(false);
    }
  }

  if (loading) return <Spinner />;

  return (
    <div className="mx-auto max-w-2xl">
      <PageHeader
        title={isEditing ? "Editar veículo" : "Cadastrar veículo"}
        description="Preencha as informações do veículo da frota."
      />

      <form onSubmit={handleSubmit} className="space-y-5 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        {error && <Alert>{error}</Alert>}

        <div className="grid gap-4 sm:grid-cols-2">
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
            <Input required value={form.color} onChange={update("color")} />
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
          <Field label="Valor da diária (R$)">
            <Input type="number" required min="0.01" step="0.01" value={form.dailyRate} onChange={update("dailyRate")} />
          </Field>
          <Field label="Status">
            <Select value={form.status} onChange={update("status")} disabled={isRented}>
              {isRented && <option value="RENTED">Locado</option>}
              <option value="AVAILABLE">Disponível</option>
              <option value="MAINTENANCE">Manutenção</option>
            </Select>
          </Field>
        </div>

        <Field label="URL da imagem (opcional)">
          <Input type="url" value={form.imageUrl} onChange={update("imageUrl")} placeholder="https://..." />
        </Field>

        <div className="flex justify-end gap-2 border-t border-slate-100 pt-5">
          <Link to="/" className={buttonClass("secondary")}>
            Cancelar
          </Link>
          <Button type="submit" disabled={submitting}>
            {submitting ? "Salvando..." : "Salvar"}
          </Button>
        </div>
      </form>
    </div>
  );
}
