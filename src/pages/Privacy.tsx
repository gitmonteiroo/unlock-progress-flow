import { Link } from "react-router-dom";
import { BookOpen } from "lucide-react";

const Privacy = () => (
  <div className="dark min-h-screen bg-background">
    <header className="border-b border-border">
      <div className="container mx-auto flex items-center gap-2 px-4 py-4">
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
            <BookOpen className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="font-display text-xl font-bold text-foreground">EduPro</span>
        </Link>
      </div>
    </header>
    <main className="container mx-auto max-w-3xl px-4 py-12">
      <h1 className="mb-6 font-display text-3xl font-bold text-foreground">Política de Privacidade</h1>
      <div className="space-y-4 text-muted-foreground">
        <p>Sua privacidade é importante para nós. Esta política descreve como coletamos e usamos seus dados.</p>
        <h2 className="font-display text-xl font-semibold text-foreground">1. Dados Coletados</h2>
        <p>Coletamos nome, email e dados de progresso nos cursos para personalizar sua experiência.</p>
        <h2 className="font-display text-xl font-semibold text-foreground">2. Uso dos Dados</h2>
        <p>Seus dados são utilizados exclusivamente para operação da plataforma e melhoria dos serviços.</p>
        <h2 className="font-display text-xl font-semibold text-foreground">3. Compartilhamento</h2>
        <p>Não compartilhamos seus dados com terceiros, exceto quando exigido por lei.</p>
        <h2 className="font-display text-xl font-semibold text-foreground">4. Segurança</h2>
        <p>Utilizamos criptografia e práticas de segurança para proteger suas informações.</p>
      </div>
    </main>
  </div>
);

export default Privacy;
