import { Plus, Search } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router";
import { VehicleCard } from "../components/VehicleCard";
import {
  Alert,
  buttonClass,
  EmptyState,
  Input,
  PageHeader,
  SegmentedControl,
  Select,
  Spinner,
  SuccessAlert,
} from "../components/ui";
import { api, errorMessage } from "../lib/api";
import { categoryLabels } from "../lib/format";
import { illustrations } from "../lib/illustrations";
import { useFlashMessage } from "../lib/useFlashMessage";
import type { Vehicle } from "../types";

type AvailabilityFilter = "" | "true" | "false";

const availabilityOptions: { value: AvailabilityFilter; label: string }[] = [
  { value: "", label: "Todos" },
  { value: "true", label: "Disponíveis" },
  { value: "false", label: "Locados" },
];

export function VehiclesPage() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useFlashMessage();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [available, setAvailable] = useState<AvailabilityFilter>("");

  useEffect(() => {
    const params = new URLSearchParams();
    if (search.trim()) params.set("search", search.trim());
    if (category) params.set("category", category);
    if (available) params.set("available", available);

    const timeout = setTimeout(() => {
      setLoading(true);
      api<Vehicle[]>(`/vehicles?${params}`)
        .then((data) => {
          setVehicles(data);
          setError("");
        })
        .catch((err) => setError(errorMessage(err)))
        .finally(() => setLoading(false));
    }, 250);

    return () => clearTimeout(timeout);
  }, [search, category, available]);

  return (
    <>
      <PageHeader
        title="Veículos"
        description="Consulte a frota e escolha um veículo disponível para alugar."
        action={
          <Link to="/vehicles/new" className={buttonClass("primary")}>
            <Plus className="size-4" />
            Cadastrar veículo
          </Link>
        }
      />

      {success && (
        <div className="mb-6">
          <SuccessAlert onClose={() => setSuccess("")}>{success}</SuccessAlert>
        </div>
      )}

      <div className="mb-6 flex flex-col gap-3 lg:flex-row lg:items-center">
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
          className="rounded-full lg:w-56"
        >
          <option value="">Todas as categorias</option>
          {Object.entries(categoryLabels).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </Select>
        <SegmentedControl options={availabilityOptions} value={available} onChange={setAvailable} />
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
            <VehicleCard
              key={vehicle.id}
              vehicle={vehicle}
              actions={
                vehicle.available && (
                  <Link to={`/vehicles/${vehicle.id}/rent`} className={`${buttonClass("primary")} h-10 px-5`}>
                    Alugar
                  </Link>
                )
              }
            />
          ))}
        </div>
      )}
    </>
  );
}
