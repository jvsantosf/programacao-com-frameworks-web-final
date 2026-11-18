import { ArrowRight, Check, ChevronDown } from "lucide-react";
import type { ReactNode } from "react";
import { Link } from "react-router";
import cretaImage from "../assets/hyundai-creta.webp";
import compassImage from "../assets/jeep-compass.webp";
import { Logo } from "../components/Layout";
import { VehicleThumb } from "../components/VehicleCard";
import { Badge, buttonClass, Card, CheckItem, Illustration } from "../components/ui";
import { useAuth } from "../contexts/AuthContext";
import { categoryLabels } from "../lib/format";
import { illustrations } from "../lib/illustrations";
import { categoryPhotos } from "../lib/vehiclePhotos";
import type { Vehicle, VehicleCategory } from "../types";

const sections = [
  { id: "como-funciona", label: "Como funciona" },
  { id: "frota", label: "Frota" },
  { id: "vantagens", label: "Vantagens" },
  { id: "duvidas", label: "Dúvidas" },
];

const steps = [
  {
    image: illustrations.search,
    title: "Escolha o veículo",
    text: "Filtre por categoria, marca ou modelo e veja a diária de cada carro disponível.",
  },
  {
    image: illustrations.calendar,
    title: "Defina as datas",
    text: "Informe o início e a devolução prevista, com data e hora. O valor total aparece na hora.",
  },
  {
    image: illustrations.key,
    title: "Retire e devolva",
    text: "Acompanhe a locação pelo painel e finalize quando devolver o carro.",
  },
];

const highlights = [
  { value: "1 min", label: "para concluir uma reserva" },
  { value: "5", label: "categorias de veículos" },
  { value: "100%", label: "online, do cadastro à devolução" },
  { value: "0", label: "surpresas no valor final" },
];

const faqs = [
  {
    question: "Como faço para alugar um veículo?",
    answer:
      "Crie sua conta, escolha um veículo disponível na frota, informe a data de retirada e a devolução prevista e confirme. A locação aparece na hora em \"Minhas locações\".",
  },
  {
    question: "Como o valor da locação é calculado?",
    answer:
      "O valor total é calculado pelo período contratado: diária × número de diárias. Qualquer fração de 24 horas conta como uma diária completa; por exemplo, 2 dias e 1 hora são cobrados como 3 diárias.",
  },
  {
    question: "Como finalizo uma locação?",
    answer: "Em \"Minhas locações\", clique em \"Finalizar locação\". A data de devolução é registrada e o veículo volta a ficar disponível.",
  },
  {
    question: "E se o preço da diária mudar depois da minha reserva?",
    answer: "A diária fica registrada no momento da reserva. Alterações posteriores no preço do veículo não afetam a sua locação.",
  },
  {
    question: "Por que alguns veículos não podem ser alugados?",
    answer:
      "Um veículo com locação em andamento fica indisponível até que ela seja finalizada. Assim, o mesmo carro nunca tem duas locações ativas ao mesmo tempo.",
  },
];

function SectionHeading({ eyebrow, title, description }: { eyebrow: string; title: ReactNode; description?: string }) {
  return (
    <div className="mx-auto max-w-2xl text-center">
      <p className="font-semibold text-brand-600">{eyebrow}</p>
      <h2 className="mt-3 text-3xl font-bold leading-tight tracking-[-0.03em] text-ink sm:text-[42px]">{title}</h2>
      {description && <p className="mt-4 text-lg text-slate-500">{description}</p>}
    </div>
  );
}

function Header() {
  const { user } = useAuth();

  return (
    <header className="sticky top-0 z-30 border-b border-slate-100/80 bg-white/85 backdrop-blur-md">
      <div className="mx-auto flex h-18 max-w-6xl items-center justify-between gap-6 px-4 py-3">
        <Logo />
        <nav className="hidden items-center gap-8 md:flex">
          {sections.map((section) => (
            <a key={section.id} href={`#${section.id}`} className="text-sm font-medium text-slate-500 transition hover:text-ink">
              {section.label}
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          {user ? (
            <Link to="/vehicles" className={`${buttonClass("primary")} h-10 px-5`}>
              Acessar painel
            </Link>
          ) : (
            <>
              <Link to="/login" className={`${buttonClass("secondary")} h-10 px-5`}>
                Entrar
              </Link>
              <Link to="/register" className={`${buttonClass("primary")} h-10 px-5 max-sm:hidden`}>
                Criar conta
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="pointer-events-none absolute -top-40 left-1/2 h-[520px] w-[900px] -translate-x-1/2 rounded-full bg-brand-200/40 blur-3xl" />

      <div className="relative mx-auto grid max-w-6xl items-center gap-14 px-4 pb-20 pt-14 lg:grid-cols-[1fr_1.05fr] lg:pt-20">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full border border-brand-100 bg-white py-1.5 pl-1.5 pr-4 text-sm font-medium text-slate-600 shadow-sm">
            <span className="flex size-7 items-center justify-center rounded-full bg-brand-50">
              <Illustration src={illustrations.key} className="size-5" />
            </span>
            Locação de veículos sem burocracia
          </span>

          <h1 className="mt-6 text-[44px] font-bold leading-[1.02] tracking-[-0.04em] text-ink sm:text-6xl">
            Alugue o carro certo, <span className="text-brand-500">na hora certa.</span>
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-slate-500">
            Escolha entre hatches, sedans, SUVs e picapes, reserve em poucos cliques e acompanhe tudo pelo painel. Sem fila no
            balcão e sem papelada.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link to="/vehicles" className={`${buttonClass("primary")} h-13 px-7 text-base`}>
              Ver veículos disponíveis
              <ArrowRight className="size-4" />
            </Link>
            <Link to="/register" className={`${buttonClass("secondary")} h-13 px-7 text-base`}>
              Criar conta grátis
            </Link>
          </div>

          <dl className="mt-10 flex gap-10">
            <div>
              <dt className="text-sm text-slate-500">Cobrança</dt>
              <dd className="mt-1 text-2xl font-bold tracking-tight text-ink">Por diária</dd>
            </div>
            <div>
              <dt className="text-sm text-slate-500">Disponibilidade</dt>
              <dd className="mt-1 text-2xl font-bold tracking-tight text-ink">Em tempo real</dd>
            </div>
          </dl>
        </div>

        <div className="relative">
          <div className="bg-auth relative aspect-[5/4] overflow-hidden rounded-[36px] shadow-2xl shadow-brand-700/20">
            <div className="bg-dots absolute inset-0 opacity-25 [mask-image:radial-gradient(circle_at_top_right,black,transparent_70%)]" />
            <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/25 to-transparent" />
          </div>

          <img
            src={compassImage}
            alt="Jeep Compass branco"
            className="absolute bottom-8 left-0 w-full max-w-none drop-shadow-[0_30px_30px_rgba(0,0,0,0.35)] sm:-left-12 sm:bottom-16 sm:w-[112%]"
          />

          <div className="absolute -top-5 left-4 flex items-center gap-3 rounded-2xl bg-white p-3 pr-5 shadow-xl shadow-slate-900/10 sm:left-8">
            <span className="flex size-10 items-center justify-center rounded-full bg-emerald-500 text-white">
              <Check className="size-5" strokeWidth={3} />
            </span>
            <div>
              <p className="text-sm font-semibold text-ink">Reserva confirmada</p>
              <p className="text-xs text-slate-500">Jeep Compass · 4 diárias</p>
            </div>
          </div>

          <div className="absolute -bottom-8 -right-2 w-52 rounded-2xl max-sm:hidden bg-white p-4 shadow-xl shadow-slate-900/10 sm:-right-6">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-ink">Resumo</p>
              <Illustration src={illustrations.moneyBag} className="size-7" />
            </div>
            <div className="mt-3 space-y-1.5 border-t border-slate-100 pt-3 text-xs">
              <div className="flex justify-between text-slate-500">
                <span>Diária</span>
                <span className="font-medium text-ink">R$ 289,90</span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>Período</span>
                <span className="font-medium text-ink">4 dias</span>
              </div>
            </div>
            <div className="mt-3 flex justify-between rounded-lg bg-indigo-50 px-3 py-2 text-sm font-bold text-indigo-600">
              <span>Total</span>
              <span>R$ 1.159,60</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Highlights() {
  return (
    <section className="border-y border-slate-100 bg-white">
      <dl className="mx-auto grid max-w-6xl grid-cols-2 gap-y-8 px-4 py-10 lg:grid-cols-4">
        {highlights.map((item) => (
          <div key={item.label} className="text-center lg:border-l lg:border-slate-100 lg:first:border-l-0">
            <dt className="text-3xl font-bold tracking-tight text-ink sm:text-4xl">{item.value}</dt>
            <dd className="mt-1 text-sm text-slate-500">{item.label}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

function HowItWorks() {
  return (
    <section id="como-funciona" className="scroll-mt-20 py-24">
      <div className="mx-auto max-w-6xl px-4">
        <SectionHeading
          eyebrow="Como funciona"
          title="Do cadastro à devolução em três passos"
          description="Tudo acontece pelo navegador, no computador ou no celular."
        />
        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {steps.map((step, index) => (
            <Card key={step.title} className="relative p-8">
              <span className="absolute right-6 top-6 text-5xl font-bold tracking-tighter text-slate-100">0{index + 1}</span>
              <span className="flex size-20 items-center justify-center rounded-3xl bg-brand-50">
                <Illustration src={step.image} className="size-14" />
              </span>
              <h3 className="mt-6 text-xl font-bold tracking-tight text-ink">{step.title}</h3>
              <p className="mt-2 leading-relaxed text-slate-500">{step.text}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

const categoryDescriptions: Record<VehicleCategory, string> = {
  ECONOMY: "Baixo consumo para o dia a dia na cidade.",
  HATCH: "Compacto, ágil e fácil de estacionar.",
  SEDAN: "Conforto e porta-malas para a família.",
  SUV: "Espaço e altura para qualquer estrada.",
  PICKUP: "Caçamba e força para o trabalho pesado.",
};

function Fleet() {
  return (
    <section id="frota" className="scroll-mt-20 bg-white py-24">
      <div className="mx-auto max-w-6xl px-4">
        <SectionHeading
          eyebrow="Nossa frota"
          title="Um carro para cada tipo de viagem"
          description="Do econômico para o dia a dia à picape para o trabalho pesado."
        />

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {(Object.keys(categoryLabels) as VehicleCategory[]).map((category) => (
            <div key={category} className="rounded-3xl border border-slate-100 bg-canvas p-5 text-center">
              <div className="flex h-24 items-center justify-center">
                <img src={categoryPhotos[category]} alt="" aria-hidden="true" className="max-h-full w-full object-contain drop-shadow-lg" />
              </div>
              <p className="mt-4 font-bold text-ink">{categoryLabels[category]}</p>
              <p className="mt-1 text-sm leading-snug text-slate-500">{categoryDescriptions[category]}</p>
            </div>
          ))}
        </div>

        <div className="mt-10 text-center">
          <Link to="/vehicles" className={buttonClass("primary")}>
            Ver veículos disponíveis
            <ArrowRight className="size-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}

function Feature({
  eyebrow,
  title,
  text,
  items,
  visual,
  reverse = false,
}: {
  eyebrow: string;
  title: string;
  text: string;
  items: string[];
  visual: ReactNode;
  reverse?: boolean;
}) {
  return (
    <Card className="grid items-center gap-12 overflow-hidden p-6 sm:p-12 lg:grid-cols-2">
      <div className={`min-w-0 ${reverse ? "lg:order-2" : ""}`}>
        <p className="font-semibold text-brand-600">{eyebrow}</p>
        <h3 className="mt-3 text-3xl font-bold leading-tight tracking-[-0.03em] text-ink sm:text-4xl">{title}</h3>
        <p className="mt-4 text-lg leading-relaxed text-slate-500">{text}</p>
        <ul className="mt-7 space-y-3">
          {items.map((item) => (
            <CheckItem key={item}>{item}</CheckItem>
          ))}
        </ul>
      </div>
      <div className={`min-w-0 ${reverse ? "lg:order-1" : ""}`}>{visual}</div>
    </Card>
  );
}

function PricingVisual() {
  return (
    <div className="relative mx-auto max-w-md">
      <div className="absolute inset-x-6 bottom-0 top-10 rounded-[32px] bg-gradient-to-br from-brand-100 to-brand-50" />
      <img src={cretaImage} alt="Hyundai Creta prata" className="relative w-full drop-shadow-[0_20px_25px_rgba(16,23,39,0.25)]" />
      <div className="relative -mt-6 ml-auto w-64 rounded-2xl border border-slate-100 bg-white p-4 shadow-xl shadow-slate-900/10">
        <p className="font-semibold text-ink">Resumo financeiro</p>
        <div className="mt-3 space-y-2 border-t border-slate-100 pt-3 text-sm">
          <div className="flex justify-between text-slate-500">
            <span>Valor da diária</span>
            <span className="font-medium text-ink">R$ 249,90</span>
          </div>
          <div className="flex justify-between text-slate-500">
            <span>Diárias cobradas</span>
            <span className="font-medium text-ink">3</span>
          </div>
        </div>
        <div className="mt-3 flex justify-between rounded-xl bg-indigo-50 px-3 py-2.5 font-bold text-indigo-600">
          <span>Total</span>
          <span>R$ 749,70</span>
        </div>
      </div>
    </div>
  );
}

function DashboardVisual() {
  const rows: (Pick<Vehicle, "brand" | "model" | "plate" | "category"> & { active: boolean })[] = [
    { brand: "Jeep", model: "Compass", plate: "OJK4E56", category: "SUV", active: true },
    { brand: "Hyundai", model: "Creta", plate: "SLM5F67", category: "SUV", active: true },
    { brand: "Fiat", model: "Toro", plate: "QWE6G78", category: "PICKUP", active: false },
  ];

  return (
    <div className="relative">
      <Illustration src={illustrations.gear} className="absolute -right-2 -top-8 z-10 size-16 drop-shadow-lg sm:size-20" />
      <div className="rounded-3xl border border-slate-100 bg-canvas p-4 sm:p-5">
        <div className="grid grid-cols-3 gap-3">
          {[
            ["Locações", "12"],
            ["Em andamento", "2"],
            ["Finalizadas", "10"],
          ].map(([label, value]) => (
            <div key={label} className="rounded-2xl bg-white p-3 shadow-sm">
              <p className="text-xs text-slate-500">{label}</p>
              <p className="text-xl font-bold text-ink">{value}</p>
            </div>
          ))}
        </div>
        <div className="mt-3 divide-y divide-slate-100 rounded-2xl bg-white shadow-sm">
          {rows.map((row) => (
            <div key={row.plate} className="flex items-center gap-3 px-4 py-3">
              <VehicleThumb vehicle={row} className="h-10 w-14" />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-ink">{`${row.brand} ${row.model}`}</p>
                <p className="font-mono text-xs text-slate-500">{row.plate}</p>
              </div>
              <Badge tone={row.active ? "blue" : "green"}>{row.active ? "Em andamento" : "Finalizada"}</Badge>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Advantages() {
  return (
    <section id="vantagens" className="scroll-mt-20 py-24">
      <div className="mx-auto max-w-6xl space-y-8 px-4">
        <SectionHeading eyebrow="Vantagens" title="Simples para quem aluga. Prático para quem gerencia." />
        <div className="space-y-8 pt-6">
          <Feature
            eyebrow="Valor transparente"
            title="Você sabe quanto vai pagar antes de sair."
            text="O valor total aparece enquanto você escolhe as datas, e a diária fica garantida no momento da reserva."
            items={[
              "Valor total calculado na hora",
              "Diária fixada na reserva, sem reajuste surpresa",
              "Fração de 24 horas conta como diária completa",
            ]}
            visual={<PricingVisual />}
          />
          <Feature
            reverse
            eyebrow="Histórico de locações"
            title="Suas locações e devoluções no mesmo lugar."
            text="Acompanhe cada locação em andamento e consulte o histórico das finalizadas, com período, valor e data de devolução."
            items={[
              "Disponibilidade do veículo atualizada automaticamente",
              "Histórico completo das suas locações",
              "Aviso de locações em atraso",
            ]}
            visual={<DashboardVisual />}
          />
        </div>
      </div>
    </section>
  );
}

function Faq() {
  return (
    <section id="duvidas" className="scroll-mt-20 bg-white py-24">
      <div className="mx-auto max-w-3xl px-4">
        <SectionHeading eyebrow="Dúvidas frequentes" title="Ficou alguma pergunta?" />
        <div className="mt-12 space-y-3">
          {faqs.map((faq) => (
            <details key={faq.question} className="group rounded-2xl border border-slate-100 bg-canvas px-6 py-5 open:bg-white open:shadow-sm">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold text-ink [&::-webkit-details-marker]:hidden">
                {faq.question}
                <ChevronDown className="size-5 shrink-0 text-slate-400 transition group-open:rotate-180 group-open:text-brand-500" />
              </summary>
              <p className="mt-3 leading-relaxed text-slate-500">{faq.answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

function CallToAction() {
  const { user } = useAuth();

  return (
    <section className="px-4 py-24">
      <div className="relative mx-auto grid max-w-6xl items-center overflow-hidden rounded-[36px] bg-gradient-to-br from-brand-500 via-brand-600 to-brand-700 px-8 py-14 sm:px-14 lg:grid-cols-2">
        <div className="bg-dots absolute inset-0 opacity-25 [mask-image:linear-gradient(to_right,black,transparent_60%)]" />
        <div className="relative">
          <h2 className="text-3xl font-bold leading-tight tracking-[-0.03em] text-white sm:text-[44px]">
            Pronto para pegar a estrada?
          </h2>
          <p className="mt-4 max-w-md text-lg text-white/80">
            Crie sua conta em segundos e reserve o seu próximo carro hoje mesmo.
          </p>
          <Link
            to={user ? "/vehicles" : "/register"}
            className="mt-8 inline-flex h-13 items-center gap-2 rounded-full bg-white px-7 font-semibold text-brand-600 shadow-lg transition hover:bg-brand-50"
          >
            {user ? "Ver veículos" : "Criar minha conta"}
            <ArrowRight className="size-4" />
          </Link>
        </div>
        <img
          src={compassImage}
          alt=""
          aria-hidden="true"
          className="relative mt-10 w-full -scale-x-100 drop-shadow-[0_25px_25px_rgba(0,0,0,0.35)] lg:mt-0 lg:w-[112%]"
        />
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-slate-100 bg-white">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-12 md:flex-row md:items-start md:justify-between">
        <div className="max-w-xs">
          <Logo />
          <p className="mt-4 text-sm leading-relaxed text-slate-500">
            Sistema de locação de veículos desenvolvido para a disciplina de Programação com Frameworks Web.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-10 text-sm">
          <div>
            <p className="font-semibold text-ink">Navegação</p>
            <ul className="mt-3 space-y-2 text-slate-500">
              {sections.map((section) => (
                <li key={section.id}>
                  <a href={`#${section.id}`} className="hover:text-brand-600">
                    {section.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="font-semibold text-ink">Conta</p>
            <ul className="mt-3 space-y-2 text-slate-500">
              <li>
                <Link to="/login" className="hover:text-brand-600">
                  Entrar
                </Link>
              </li>
              <li>
                <Link to="/register" className="hover:text-brand-600">
                  Criar conta
                </Link>
              </li>
              <li>
                <Link to="/vehicles" className="hover:text-brand-600">
                  Veículos
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div className="border-t border-slate-100 py-6 text-center text-xs text-slate-400">
        © {new Date().getFullYear()} Locadora · Projeto acadêmico UNIPÊ
      </div>
    </footer>
  );
}

export function LandingPage() {
  return (
    <div className="min-h-screen bg-canvas">
      <Header />
      <main>
        <Hero />
        <Highlights />
        <HowItWorks />
        <Fleet />
        <Advantages />
        <Faq />
        <CallToAction />
      </main>
      <Footer />
    </div>
  );
}
