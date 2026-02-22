

# Corrigir Upsell Financeiro: Preço do Curso e Estrutura de Upsell

## Problema
O preço do curso "Organização Financeira do Zero" foi alterado erroneamente para R$27,90. O correto e R$7,90. O conteudo do video e PDF (Regra dos 90 Dias) deveria ser um **upsell dentro do curso**, nao o curso em si -- igual ao padrao do "Negocio Digital na Pratica" com o "Desbloqueio de Conteudos Avancados".

## O que sera feito

### 1. Corrigir o preco do curso
- Atualizar o preco de "Organizacao Financeira do Zero" de volta para **R$7,90**

### 2. Criar curso de upsell no banco de dados
- Criar um novo curso chamado **"Conteudo Extra - Organizacao Financeira"** (ou similar) com preco de **R$27,90**
- Criar um modulo dentro desse curso: "A Regra dos 90 Dias - Napoleon Hill"
- Criar a aula com o video do Vimeo (1167038922) e o PDF ja salvo

### 3. Atualizar a pagina CourseDetail
- Quando o aluno estiver dentro do curso "Organizacao Financeira do Zero", exibir os modulos do upsell financeiro **bloqueados** no final da pagina (mesmo padrao visual do upsell avancado)
- Mostrar botao "Desbloqueie agora por R$27,90" apontando para `/upsell-financeiro`

### 4. Atualizar UpsellFinanceiro
- Apontar para o **novo curso de upsell** (nao mais para o curso principal de financas)
- Manter o video, modulos bloqueados e CTA de compra

## Resultado esperado
- Curso "Organizacao Financeira do Zero" volta a custar **R$7,90**
- Dentro do curso financeiro, aparece a secao de upsell bloqueada com o conteudo da "Regra dos 90 Dias"
- O aluno pode desbloquear o upsell por **R$27,90** via pagina `/upsell-financeiro`
- Padrao identico ao que ja funciona no "Negocio Digital na Pratica"

## Detalhes Tecnicos

### Banco de dados
- `UPDATE courses SET price = 7.90 WHERE title = 'Organizacao Financeira do Zero'`
- `INSERT INTO courses` -- novo curso de upsell financeiro (price = 27.90, sort_order alto, is_entry_course = false)
- `INSERT INTO modules` -- modulo para o conteudo Napoleon Hill
- `INSERT INTO lessons` -- aula com video Vimeo + PDF

### Arquivos a editar
- **`src/pages/CourseDetail.tsx`** -- Adicionar logica para carregar e exibir modulos de upsell quando o curso for o financeiro (mesmo padrao do `ENTRY_COURSE_ID` / `UPSELL_COURSE_ID`)
- **`src/pages/UpsellFinanceiro.tsx`** -- Atualizar o `FINANCE_COURSE_ID` para apontar para o novo curso de upsell (nao o curso principal)

