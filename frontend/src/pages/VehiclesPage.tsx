import { useEffect, useState } from "react";
import { Link } from "react-router";
import { VehicleCard } from "../components/VehicleCard";
import { Alert, Button, buttonClass, EmptyState, Input, PageHeader, Select, Spinner } from "../components/ui";
import { useAuth } from "../contexts/AuthContext";
import { api, errorMessage } from "../lib/api";
import { categoryLabels, vehicleStatusLabels } from "../lib/format";
import type { Vehicle } from "../types";

export function VehiclesPage() {
  const { user, isAdmin } = useAuth();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [status, setStatus] = useState("");

  useEffect(() => {
    const params = new URLSearchParams();
    if (search.trim()) params.set("search", search.trim());
    if (category) params.set("category", category);
    if (status) params.set("status", status);

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
  }, [search, category, status]);

  async function handleDelete(vehicle: Vehicle) {
    if (!confirm(`Excluir ${vehicle.brand} ${vehicle.model} (${vehicle.plate})?`)) return;
    try {
      await api(`/vehicles/${vehicle.id}`, { method: "DELETE" });
      setVehicles((current) => current.filter((item) => item.id !== vehicle.id));
    } catch (err) {
      alert(errorMessage(err));
    }
  }

  function renderActions(vehicle: Vehicle) {
    if (isAdmin) {
      return (
        <>
          <Link to={`/vehicles/${vehicle.id}/edit`} className={`${buttonClass("secondary")} flex-1`}>
            Editar
          </Link>
          <Button variant="danger" className="flex-1" onClick={() => handleDelete(vehicle)}>
            Excluir
          </Button>
        </>
      );
    }

    if (vehicle.status !== "AVAILABLE") return null;

    return (
      <Link to={user ? `/vehicles/${vehicle.id}/rent` : "/login"} className={`${buttonClass("primary")} w-full`}>
        Alugar
      </Link>
    );
  }

  return (
    <>
      <PageHeader
        title="Veículos"
        description={isAdmin ? "Gerencie a frota da locadora." : "Escolha o veículo ideal para a sua viagem."}
        action={
          isAdmin && (
            <Link to="/vehicles/new" className={buttonClass("primary")}>
              Cadastrar veículo
            </Link>
          )
        }
      />

      <div className="mb-6 grid gap-3 sm:grid-cols-[1fr_180px_180px]">
        <Input placeholder="Buscar por marca, modelo ou placa" value={search} onChange={(e) => setSearch(e.target.value)} />
        <Select value={category} onChange={(e) => setCategory(e.target.value)} aria-label="Categoria">
          <option value="">Todas as categorias</option>
          {Object.entries(categoryLabels).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </Select>
        <Select value={status} onChange={(e) => setStatus(e.target.value)} aria-label="Status">
          <option value="">Todos os status</option>
          {Object.entries(vehicleStatusLabels).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </Select>
      </div>

      {error && <Alert>{error}</Alert>}

      {loading ? (
        <Spinner />
      ) : vehicles.length === 0 ? (
        <EmptyState>Nenhum veículo encontrado com os filtros selecionados.</EmptyState>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {vehicles.map((vehicle) => (
            <VehicleCard key={vehicle.id} vehicle={vehicle} actions={renderActions(vehicle)} />
          ))}
        </div>
      )}
    </>
  );
}
