

# Adicionar Descrições Atrativas aos Cursos

## Objetivo
Inserir uma descrição persuasiva em cada curso da plataforma para criar desejo de compra nos alunos. As descrições aparecem na página de cursos (`/courses`) e na página de desbloqueio (`/unlock`).

## O que será feito

Atualizar o campo `description` de cada curso no banco de dados com textos chamativos:

| Curso | Descrição |
|-------|-----------|
| **Negócio Digital na Prática** | Aprenda do zero como criar seu negócio online e gerar sua primeira renda na internet — mesmo sem experiência. O passo a passo completo para sair do zero e começar a faturar. |
| **Organização Financeira do Zero** | Chega de fechar o mês no vermelho! Descubra como organizar suas finanças, eliminar dívidas e começar a construir sua reserva — de forma simples e prática. |
| **Carreira Acelerada** | Destaque-se no mercado de trabalho e conquiste as melhores oportunidades. Técnicas de produtividade, preparação para entrevistas e estratégias para acelerar sua carreira. |
| **Marketing Prático para Negócios Locais** | Atraia mais clientes para o seu negócio usando estratégias de marketing digital que realmente funcionam — sem precisar de grandes investimentos. |
| **Relacionamentos Conscientes** | Transforme a qualidade dos seus relacionamentos. Aprenda a se comunicar melhor, resolver conflitos e construir conexões mais saudáveis e verdadeiras. |
| **Mestre da Airfryer** | +150 receitas práticas e deliciosas para você dominar a airfryer e surpreender no dia a dia. Economia de tempo, sabor e praticidade na sua cozinha! |

## Detalhes Técnicos

- **Ação:** 6 comandos `UPDATE` na tabela `courses` para preencher o campo `description`
- **Nenhuma alteração de código** necessária — a página `/courses` já exibe `course.description` nos cards
- O curso "Desbloqueio de Conteúdos Avançados" não será alterado pois já é filtrado da listagem

