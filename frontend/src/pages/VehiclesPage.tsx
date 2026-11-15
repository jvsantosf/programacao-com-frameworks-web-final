import { Pencil, Plus, Search, Trash2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router";
import { VehicleCard } from "../components/VehicleCard";
import {
  Alert,
  buttonClass,
  Card,
  CheckItem,
  ConfirmDialog,
  EmptyState,
  Illustration,
  Input,
  PageHeader,
  SegmentedControl,
  Select,
  Spinner,
} from "../components/ui";
import { useAuth } from "../contexts/AuthContext";
import { api, errorMessage } from "../lib/api";
import { categoryLabels, formatCurrency } from "../lib/format";
import { illustrations } from "../lib/illustrations";
import type { Vehicle, VehicleStatus } from "../types";

const statusOptions: { value: VehicleStatus | ""; label: string }[] = [
  { value: "", label: "Todos" },
  { value: "AVAILABLE", label: "Disponíveis" },
  { value: "RENTED", label: "Locados" },
  { value: "MAINTENANCE", label: "Manutenção" },
];

function Hero({ fleet }: { fleet: Vehicle[] }) {
  const available = fleet.filter((vehicle) => vehicle.status === "AVAILABLE");
  const lowestRate = available.length > 0 ? Math.min(...available.map((vehicle) => Number(vehicle.dailyRate))) : null;

  return (
    <Card className="mb-10 grid items-center gap-10 overflow-hidden p-8 sm:p-12 lg:grid-cols-[1.15fr_1fr]">
      <div>
        <p className="font-semibold text-brand-600">Locação facilitada</p>
        <h1 className="mt-3 text-4xl font-bold leading-[1.05] tracking-[-0.03em] text-ink sm:text-5xl">
          Seu próximo carro, pronto em segundos.
        </h1>
        <p className="mt-5 max-w-lg text-lg text-slate-500">
          Escolha o veículo, defina as datas e pronto. Sem fila no balcão, sem papelada e sem surpresa no valor final.
        </p>
        <ul className="mt-7 space-y-3">
          <CheckItem>Valor estimado calculado na hora da reserva</CheckItem>
          <CheckItem>Pague apenas pelos dias que realmente usar</CheckItem>
          <CheckItem>Acompanhe locações e devoluções em um só lugar</CheckItem>
        </ul>
        <div className="mt-8 inline-block rounded-2xl border border-dashed border-indigo-300 bg-indigo-50/60 px-6 py-4 text-indigo-500">
          Frota revisada. <strong className="font-semibold text-indigo-600">Pronta para rodar.</strong>
        </div>
      </div>

      <div className="relative mx-auto flex aspect-square w-full max-w-sm items-center justify-center">
        <div className="absolute inset-6 rounded-full bg-gradient-to-br from-brand-100 via-brand-50 to-white" />
        <Illustration src={illustrations.automobile} className="relative w-3/4 drop-shadow-2xl" />
        <div className="absolute -left-2 top-8 flex items-center gap-3 rounded-2xl bg-white p-3 pr-5 shadow-xl shadow-slate-200/80 sm:-left-6">
          <Illustration src={illustrations.calendar} className="size-10" />
          <div>
            <p className="text-xs text-slate-500">Retirada</p>
            <p className="text-sm font-semibold text-ink">A partir de hoje</p>
          </div>
        </div>
        <div className="absolute -right-2 bottom-6 rounded-2xl bg-white p-4 shadow-xl shadow-slate-200/80 sm:-right-4">
          <div className="flex items-center gap-2">
            <Illustration src={illustrations.moneyBag} className="size-8" />
            <p className="text-xs text-slate-500">Diárias a partir de</p>
          </div>
          <p className="mt-2 rounded-xl bg-indigo-50 px-3 py-2 text-lg font-bold text-indigo-600">
            {lowestRate !== null ? formatCurrency(lowestRate) : "—"}
          </p>
        </div>
      </div>
    </Card>
  );
}

function FleetStats({ fleet }: { fleet: Vehicle[] }) {
  const stats = [
    { label: "Frota total", value: fleet.length, image: illustrations.motorway },
    { label: "Disponíveis", value: fleet.filter((v) => v.status === "AVAILABLE").length, image: illustrations.checkMark },
    { label: "Locados", value: fleet.filter((v) => v.status === "RENTED").length, image: illustrations.key },
    { label: "Manutenção", value: fleet.filter((v) => v.status === "MAINTENANCE").length, image: illustrations.wrench },
  ];

  return (
    <div className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.label} className="flex items-center gap-4 p-5">
          <Illustration src={stat.image} className="size-12" />
          <div>
            <p className="text-sm text-slate-500">{stat.label}</p>
            <p className="text-2xl font-bold tracking-tight text-ink">{stat.value}</p>
          </div>
        </Card>
      ))}
    </div>
  );
}

export function VehiclesPage() {
  const { user, isAdmin } = useAuth();
  const [fleet, setFleet] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [status, setStatus] = useState<VehicleStatus | "">("");
  const [toDelete, setToDelete] = useState<Vehicle | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    api<Vehicle[]>("/vehicles")
      .then(setFleet)
      .catch((err) => setError(errorMessage(err)))
      .finally(() => setLoading(false));
  }, []);

  const vehicles = useMemo(() => {
    const term = search.trim().toLowerCase();
    return fleet.filter(
      (vehicle) =>
        (!category || vehicle.category === category) &&
        (!status || vehicle.status === status) &&
        (!term || `${vehicle.brand} ${vehicle.model} ${vehicle.plate}`.toLowerCase().includes(term)),
    );
  }, [fleet, search, category, status]);

  async function handleDelete() {
    if (!toDelete) return;
    setDeleting(true);
    try {
      await api(`/vehicles/${toDelete.id}`, { method: "DELETE" });
      setFleet((current) => current.filter((item) => item.id !== toDelete.id));
      setToDelete(null);
    } catch (err) {
      setError(errorMessage(err));
      setToDelete(null);
    } finally {
      setDeleting(false);
    }
  }

  function renderActions(vehicle: Vehicle) {
    if (isAdmin) {
      return (
        <>
          <Link
            to={`/vehicles/${vehicle.id}/edit`}
            aria-label="Editar"
            className="flex size-10 items-center justify-center rounded-full border border-slate-200 text-slate-500 transition hover:border-brand-200 hover:bg-brand-50 hover:text-brand-600"
          >
            <Pencil className="size-4" />
          </Link>
          <button
            onClick={() => setToDelete(vehicle)}
            aria-label="Excluir"
            className="flex size-10 items-center justify-center rounded-full border border-slate-200 text-slate-500 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600"
          >
            <Trash2 className="size-4" />
          </button>
        </>
      );
    }

    if (vehicle.status !== "AVAILABLE") return null;

    return (
      <Link to={user ? `/vehicles/${vehicle.id}/rent` : "/login"} className={`${buttonClass("primary")} h-10 px-5`}>
        Alugar
      </Link>
    );
  }

  return (
    <>
      {isAdmin ? (
        <>
          <PageHeader
            title="Frota"
            description="Gerencie os veículos disponíveis para locação."
            action={
              <Link to="/vehicles/new" className={buttonClass("primary")}>
                <Plus className="size-4" />
                Cadastrar veículo
              </Link>
            }
          />
          <FleetStats fleet={fleet} />
        </>
      ) : (
        <Hero fleet={fleet} />
      )}

      <div className="mb-5 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <h2 className="text-2xl font-bold tracking-tight text-ink">{isAdmin ? "Veículos cadastrados" : "Veículos"}</h2>
        <div className="overflow-x-auto">
          <SegmentedControl options={statusOptions} value={status} onChange={setStatus} />
        </div>
      </div>

      <div className="mb-6 flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-4 top-1/2 size-[18px] -translate-y-1/2 text-slate-400" />
          <Input
            placeholder="Busque por marca, modelo ou placa"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="rounded-full pl-11"
          />
        </div>
        <Select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          aria-label="Categoria"
          className="rounded-full sm:w-60"
        >
          <option value="">Todas as categorias</option>
          {Object.entries(categoryLabels).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </Select>
      </div>

      {error && (
        <div className="mb-6">
          <Alert>{error}</Alert>
        </div>
      )}

      {loading ? (
        <Spinner />
      ) : vehicles.length === 0 ? (
        <EmptyState image={illustrations.search} title="Nenhum veículo encontrado">
          Tente ajustar a busca ou os filtros selecionados.
        </EmptyState>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {vehicles.map((vehicle) => (
            <VehicleCard key={vehicle.id} vehicle={vehicle} actions={renderActions(vehicle)} />
          ))}
        </div>
      )}

      <ConfirmDialog
        open={toDelete !== null}
        image={illustrations.wrench}
        title="Excluir veículo?"
        description={
          toDelete && (
            <>
              O <strong className="text-ink">{`${toDelete.brand} ${toDelete.model}`}</strong> ({toDelete.plate}) será removido da
              frota. Essa ação não pode ser desfeita.
            </>
          )
        }
        confirmLabel="Excluir"
        loading={deleting}
        onConfirm={handleDelete}
        onClose={() => setToDelete(null)}
      />
    </>
  );
}
