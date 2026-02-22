

# Corrigir Organização Financeira: Remover Conteúdo Duplicado

## Problema Encontrado
A aula "A Regra dos 90 Dias - Napoleon Hill" (vídeo + PDF) está duplicada -- ela aparece tanto no **curso principal** "Organização Financeira do Zero" (dentro do módulo "Materiais Complementares") quanto no **curso de upsell** "Conteúdo Extra - Organização Financeira".

Por isso, quando você abre o curso, o conteúdo do upsell aparece misturado com o conteúdo principal, em vez de ficar separado e bloqueado como no "Negócio Digital na Prática".

## Estrutura Atual (errada)

Organização Financeira do Zero:
- Módulo 1: Finanças Pessoais (1 aula - correto)
- Módulo 2: Materiais Complementares (2 aulas - ERRADO, tem a Regra dos 90 Dias aqui dentro)
- Seção de Upsell bloqueada: A Regra dos 90 Dias (correto, mas duplicado)

## Estrutura Correta (como será)

Organização Financeira do Zero:
- Módulo 1: Finanças Pessoais (1 aula)
- Módulo 2: Materiais Complementares (1 aula - só materiais)
- Seção de Upsell bloqueada: A Regra dos 90 Dias - Napoleon Hill (separado, com botão de desbloqueio)

## O que será feito

### 1. Remover a aula duplicada do curso principal
- Deletar a aula "A Regra dos 90 Dias - Napoleon Hill" que está dentro do módulo "Materiais Complementares" do curso principal
- Isso faz com que o conteúdo do upsell só exista no curso separado, aparecendo bloqueado no final da página

Nenhuma alteração de código é necessária -- o `CourseDetail.tsx` já está correto e carrega os módulos do upsell separadamente. O problema é apenas o dado duplicado no banco.

## Detalhe Técnico

```sql
DELETE FROM lessons 
WHERE id = 'f674bfa7-8b27-482a-8f0a-895b4b114bdc';
```

Essa é a aula duplicada (Regra dos 90 Dias) dentro do módulo "Materiais Complementares" do curso principal. A versão correta permanece no curso de upsell (id: `54ae49a0`).

