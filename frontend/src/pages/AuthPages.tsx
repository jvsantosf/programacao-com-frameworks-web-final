import { ArrowLeft } from "lucide-react";
import { useState, type FormEvent, type ReactNode } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router";
import { Alert, Button, Field, Illustration, Input } from "../components/ui";
import { useAuth } from "../contexts/AuthContext";
import { errorMessage } from "../lib/api";
import { illustrations } from "../lib/illustrations";

function AuthShell({
  image,
  title,
  subtitle,
  footer,
  children,
}: {
  image: string;
  title: string;
  subtitle: string;
  footer: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="bg-auth relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-10">
      <div className="bg-dots pointer-events-none absolute inset-x-0 top-0 h-40 opacity-50 [mask-image:linear-gradient(to_bottom,black,transparent)]" />
      <div className="bg-dots pointer-events-none absolute bottom-0 left-0 h-full w-48 opacity-40 [mask-image:linear-gradient(to_right,black,transparent)]" />

      <Link
        to="/"
        className="absolute left-4 top-4 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-medium text-white backdrop-blur transition hover:bg-white/20 sm:left-8 sm:top-8"
      >
        <ArrowLeft className="size-4" />
        Voltar ao início
      </Link>

      <div className="relative w-full max-w-md rounded-[28px] bg-white p-8 shadow-2xl shadow-black/30 sm:p-10">
        <div className="text-center">
          <Illustration src={image} className="mx-auto size-24" />
          <h1 className="mt-4 text-[28px] font-bold leading-tight tracking-tight text-ink">{title}</h1>
          <p className="mt-2 text-slate-500">{subtitle}</p>
        </div>
        <div className="mt-8">{children}</div>
        <div className="mt-6 text-center text-sm text-slate-500">{footer}</div>
      </div>
    </div>
  );
}

function useAuthForm(action: () => Promise<void>) {
  const navigate = useNavigate();
  const location = useLocation();
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await action();
      navigate(location.state?.from ?? "/vehicles", { replace: true });
    } catch (err) {
      setError(errorMessage(err));
      setSubmitting(false);
    }
  }

  return { error, submitting, handleSubmit };
}

export function LoginPage() {
  const { user, login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { error, submitting, handleSubmit } = useAuthForm(() => login(email, password));

  if (user) return <Navigate to="/vehicles" replace />;

  return (
    <AuthShell
      image={illustrations.key}
      title="Bem-vindo de volta"
      subtitle="Entre para alugar veículos e acompanhar suas locações."
      footer={
        <>
          Ainda não tem conta?{" "}
          <Link to="/register" className="font-semibold text-brand-600 hover:underline">
            Cadastre-se
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        {error && <Alert>{error}</Alert>}
        <Field label="E-mail">
          <Input
            type="email"
            required
            autoComplete="email"
            placeholder="nome@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </Field>
        <Field label="Senha">
          <Input
            type="password"
            required
            autoComplete="current-password"
            placeholder="Sua senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </Field>
        <Button type="submit" disabled={submitting} className="h-12 w-full">
          {submitting ? "Entrando..." : "Entrar"}
        </Button>
      </form>
    </AuthShell>
  );
}

export function RegisterPage() {
  const { user, register } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { error, submitting, handleSubmit } = useAuthForm(() => register(name, email, password));

  if (user) return <Navigate to="/vehicles" replace />;

  return (
    <AuthShell
      image={illustrations.automobile}
      title="Crie sua conta"
      subtitle="Em poucos segundos você já pode reservar o seu carro."
      footer={
        <>
          Já possui cadastro?{" "}
          <Link to="/login" className="font-semibold text-brand-600 hover:underline">
            Entrar
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        {error && <Alert>{error}</Alert>}
        <Field label="Nome completo">
          <Input
            required
            minLength={3}
            autoComplete="name"
            placeholder="Seu nome"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </Field>
        <Field label="E-mail">
          <Input
            type="email"
            required
            autoComplete="email"
            placeholder="nome@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </Field>
        <Field label="Senha" hint="Use no mínimo 6 caracteres.">
          <Input
            type="password"
            required
            minLength={6}
            autoComplete="new-password"
            placeholder="Crie uma senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </Field>
        <Button type="submit" disabled={submitting} className="h-12 w-full">
          {submitting ? "Criando conta..." : "Criar conta"}
        </Button>
      </form>
    </AuthShell>
  );
}
