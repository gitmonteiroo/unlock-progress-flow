import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { CheckCircle, Zap, TrendingUp, Shield } from "lucide-react";
import hubLogo from "@/assets/hub-logo.png";

const Landing = () => {
  return (
    <div className="dark min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border">
        <div className="container mx-auto flex items-center justify-between px-4 py-4">
          <div className="flex items-center gap-2">
            <img src={hubLogo} alt="Hub Negócios Digitais" className="h-9 w-9 rounded-lg object-cover" />
            <span className="font-display text-xl font-bold text-foreground">Hub Negócios Digitais</span>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/login">
              <Button variant="outline" size="lg" className="font-semibold">Entrar</Button>
            </Link>
            <Link to="/signup">
              <Button size="lg" className="font-semibold">Criar Conta</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="mx-auto max-w-3xl animate-fade-in">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-sm text-primary">
            <Zap className="h-4 w-4" />
            Comece seu negócio digital hoje
          </div>
          <h1 className="mb-6 font-display text-4xl font-bold leading-tight text-foreground md:text-6xl">
            Transforme seu conhecimento em{" "}
            <span className="text-primary">resultado real</span>
          </h1>
          <p className="mb-8 text-lg text-muted-foreground md:text-xl">
            Acesse cursos práticos e objetivos por apenas R$7,90 e comece a construir seu negócio digital do zero.
          </p>
          <Link to="/signup">
            <Button size="lg" className="h-14 px-10 text-lg font-semibold">
              Começar por R$7,90
            </Button>
          </Link>
        </div>
      </section>

      {/* Benefits */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid gap-8 md:grid-cols-3">
          {[
            { icon: TrendingUp, title: "Resultados Práticos", desc: "Conteúdo focado em ação e resultados reais, sem enrolação." },
            { icon: Shield, title: "Acesso Vitalício", desc: "Comprou, é seu. Acesse quando quiser, para sempre." },
            { icon: Zap, title: "Desbloqueio Progressivo", desc: "Comece barato e desbloqueie novos cursos conforme avança." },
          ].map((item, i) => (
            <div key={i} className="rounded-xl border border-border bg-card p-8 transition-colors hover:border-primary/30">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <item.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mb-2 font-display text-lg font-semibold text-foreground">{item.title}</h3>
              <p className="text-sm text-muted-foreground">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Course Preview */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="mb-8 text-center font-display text-3xl font-bold text-foreground">
          Seu primeiro curso
        </h2>
        <div className="mx-auto max-w-2xl rounded-xl border border-border bg-card p-8">
          <h3 className="mb-3 font-display text-2xl font-bold text-foreground">
            Negócio Digital na Prática
          </h3>
          <p className="mb-6 text-muted-foreground">
            Aprenda a criar seu próprio negócio digital do zero, com estratégias práticas e validadas no mercado.
          </p>
          <ul className="mb-8 space-y-3">
            {["Passo a passo completo", "Estratégias validadas", "Suporte da comunidade", "Acesso vitalício"].map((b, i) => (
              <li key={i} className="flex items-center gap-3 text-sm text-foreground">
                <CheckCircle className="h-5 w-5 text-success" />
                {b}
              </li>
            ))}
          </ul>
          <div className="flex items-center justify-between">
            <div>
              <span className="font-display text-3xl font-bold text-foreground">R$7,90</span>
              <span className="ml-2 text-sm text-muted-foreground">acesso vitalício</span>
            </div>
            <Link to="/signup">
              <Button size="lg">Quero Começar</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8">
        <div className="container mx-auto flex flex-col items-center gap-4 px-4 text-sm text-muted-foreground md:flex-row md:justify-between">
          <span>© 2026 Hub Negócios Digitais. Todos os direitos reservados.</span>
          <div className="flex gap-6">
            <Link to="/terms" className="hover:text-foreground">Termos de Uso</Link>
            <Link to="/privacy" className="hover:text-foreground">Política de Privacidade</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
