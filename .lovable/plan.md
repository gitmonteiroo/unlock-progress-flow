

# Corrigir Pagina de Vendas do Upsell Financeiro

## Problema
A pagina `/upsell-financeiro` esta mostrando o video do curso (que e o conteudo pago) e tem 3 modulos inventados com itens que nao existem ("pilares", "planilhas", etc.). A pagina de vendas deve ser **100% persuasiva** -- sem mostrar conteudo real. O conteudo do upsell e simples: apenas 1 video + 1 e-book (Regra dos 90 Dias).

## Referencia
A pagina `UpsellAdvanced.tsx` e o modelo correto: sem video, apenas modulos bloqueados + beneficios + bloco de clareza + CTA de compra.

## O que sera feito

### Alterar `src/pages/UpsellFinanceiro.tsx`

1. **Remover o video embed** -- o video e conteudo do curso, nao deve aparecer na pagina de vendas
2. **Simplificar os modulos bloqueados** para refletir o conteudo real (1 modulo com 2 itens):
   - "A Regra dos 90 Dias - Napoleon Hill" (video-aula)
   - "E-book: Guia Definitivo para Transformacao Financeira" (PDF)
3. **Manter a mesma estrutura visual** do `UpsellAdvanced`: header persuasivo, modulos bloqueados, beneficios, bloco de clareza, card de compra e CTA secundario
4. **Remover os 3 modulos inventados** (Financas Pessoais, Regra dos 90 Dias com pilares, Materiais Complementares) e substituir por 1 modulo simples e real

### Estrutura final da pagina
1. Header persuasivo (badge + titulo + subtitulo)
2. Modulo bloqueado: "A Regra dos 90 Dias - Napoleon Hill" com 2 itens (video + e-book)
3. Beneficios (lista com checks)
4. Bloco de clareza (texto persuasivo)
5. Card de compra (R$27,90 + botao)
6. CTA secundario ("Prefiro continuar...")

Nenhuma alteracao de banco de dados necessaria.
