import { Link } from "react-router-dom";
import { BookOpen } from "lucide-react";

const Terms = () => (
  <div className="dark min-h-screen bg-background">
    <header className="border-b border-border">
      <div className="container mx-auto flex items-center gap-2 px-4 py-4">
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
            <BookOpen className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="font-display text-xl font-bold text-foreground">Hub Negócios Digitais</span>
        </Link>
      </div>
    </header>
    <main className="container mx-auto max-w-3xl px-4 py-12">
      <h1 className="mb-6 font-display text-3xl font-bold text-foreground">Termos de Uso</h1>
      <div className="space-y-4 text-muted-foreground">
        <p>Ao utilizar a plataforma Hub Negócios Digitais, você concorda com os seguintes termos:</p>
        <h2 className="font-display text-xl font-semibold text-foreground">1. Uso da Plataforma</h2>
        <p>A plataforma é destinada ao acesso de cursos digitais adquiridos pelo usuário. O acesso é pessoal e intransferível.</p>
        <h2 className="font-display text-xl font-semibold text-foreground">2. Pagamentos</h2>
        <p>Os pagamentos são processados de forma segura. Após a confirmação, o acesso ao curso é liberado automaticamente.</p>
        <h2 className="font-display text-xl font-semibold text-foreground">3. Propriedade Intelectual</h2>
        <p>Todo o conteúdo disponível é protegido por direitos autorais. É proibida a reprodução ou distribuição sem autorização.</p>
        <h2 className="font-display text-xl font-semibold text-foreground">4. Política de Reembolso</h2>
        <p>Solicite reembolso em até 7 dias após a compra, conforme o Código de Defesa do Consumidor.</p>
      </div>
    </main>
  </div>
);

export default Terms;
