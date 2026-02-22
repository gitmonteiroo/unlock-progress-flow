

# Corrigir Dashboard: Sempre Exibir o Card de Boas-vindas com Vídeo

## Problema
O card de boas-vindas com o vídeo de chamada só aparece para alunos que **não compraram nenhum curso**. Quando o aluno compra um curso, o card desaparece e é substituído pelo bloco "Curso Atual".

## Solução
Remover a condição que esconde o card de boas-vindas. Ele passará a ser exibido **sempre** no topo do dashboard, tanto para alunos quanto para administradores, independente de terem cursos comprados ou não.

O bloco "Curso Atual" (com a barra de progresso) continuará aparecendo logo abaixo do card de boas-vindas para quem já tem cursos.

## Resultado esperado
- Dashboard sempre mostra o vídeo de boas-vindas no topo
- Abaixo do vídeo, aparece o curso atual (se houver)
- Depois, as estatísticas e a lista de cursos

## Detalhes Técnicos

Arquivo: `src/pages/Dashboard.tsx`

- Remover a condição `{!userIsAdmin && userCourses.length === 0 && (...)}` que envolve o card de boas-vindas
- O card passará a ser renderizado incondicionalmente, sempre visível no topo do dashboard
