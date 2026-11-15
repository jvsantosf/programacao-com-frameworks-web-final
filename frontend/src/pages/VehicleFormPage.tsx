import { ArrowLeft } from "lucide-react";
import { useEffect, useState, type FormEvent } from "react";
import { Link, useNavigate, useParams } from "react-router";
import { Alert, Button, buttonClass, Card, Field, Illustration, Input, Select, Spinner } from "../components/ui";
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
    if (!id) {
      setForm(emptyForm);
      setIsRented(false);
      return;
    }
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
      <Link to="/" className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-ink">
        <ArrowLeft className="size-4" />
        Voltar para a frota
      </Link>

      <Card className="p-8 sm:p-10">
        <div className="text-center">
          <Illustration src={isEditing ? illustrations.wrench : illustrations.automobile} className="mx-auto size-24" />
          <h1 className="mt-4 text-[28px] font-bold tracking-tight text-ink">
            {isEditing ? "Editar veículo" : "Cadastrar veículo"}
          </h1>
          <p className="mt-2 text-slate-500">
            {isEditing ? "Atualize as informações do veículo." : "Adicione um novo veículo à frota da locadora."}
          </p>
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
            <Field label="Status" hint={isRented ? "Libere o veículo registrando a devolução." : undefined}>
              <Select value={form.status} onChange={update("status")} disabled={isRented}>
                {isRented && <option value="RENTED">Locado</option>}
                <option value="AVAILABLE">Disponível</option>
                <option value="MAINTENANCE">Manutenção</option>
              </Select>
            </Field>
          </div>

          <Field label="URL da imagem" hint="Opcional. Sem imagem, exibimos uma ilustração da categoria.">
            <Input type="url" value={form.imageUrl} onChange={update("imageUrl")} placeholder="https://..." />
          </Field>

          <div className="grid grid-cols-2 gap-3 pt-3">
            <Link to="/" className={buttonClass("secondary")}>
              Cancelar
            </Link>
            <Button type="submit" disabled={submitting}>
              {submitting ? "Salvando..." : isEditing ? "Salvar alterações" : "Cadastrar"}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
