

# Plano: Adicionar Conteudo ao Curso "Negocio Digital na Pratica"

## Resumo

Vou cadastrar os 6 modulos (baseados nos capitulos do eBook), distribuir as 9 videoaulas, adicionar suporte a PDF nas aulas e fazer upload do eBook como material complementar.

## Estrutura do Curso

O curso tera 6 modulos com 9 aulas distribuidas assim:

| Modulo | Titulo | Aulas | Videos |
|--------|--------|-------|--------|
| 1 | O Mundo Digital e Suas Oportunidades | 2 aulas | Video 1 e 2 |
| 2 | Montando Sua Base no Digital | 2 aulas | Video 3 e 4 |
| 3 | Modelos de Negocios Digitais na Pratica | 2 aulas | Video 5 e 6 |
| 4 | Marketing Digital que Funciona | 1 aula | Video 7 |
| 5 | Como Criar e Vender Seu Curso Digital | 1 aula | Video 8 |
| 6 | Estudos de Caso e Depoimentos | 1 aula | Video 9 |

## Etapas

### 1. Adicionar coluna `pdf_url` na tabela `lessons`
- Permitir que cada aula tenha um PDF associado
- Campo opcional (nullable)

### 2. Criar bucket de armazenamento para materiais do curso
- Bucket publico chamado `course-materials`
- Politica de leitura publica e upload restrito a admins

### 3. Upload do eBook PDF
- Copiar o PDF enviado para o projeto
- Implementar upload para o storage no fluxo admin (ou inserir URL diretamente)

### 4. Inserir modulos e aulas no banco de dados
- 6 modulos com sort_order correto
- 9 aulas com links embed do Vimeo (convertidos para formato player: `https://player.vimeo.com/video/ID`)
- Links Vimeo na ordem fornecida:
  1. `1166810061`
  2. `1166810246`
  3. `1166809562`
  4. `1166810458`
  5. `1166810622`
  6. `1166810832`
  7. `1166811037`
  8. `1166811220`
  9. `1166809852`

### 5. Atualizar a pagina de aula (Lesson.tsx)
- Mostrar botao de download do PDF quando a aula tiver `pdf_url`
- Icone de arquivo PDF com link para download

## Detalhes Tecnicos

- **Migracao SQL**: `ALTER TABLE lessons ADD COLUMN pdf_url text;`
- **Storage**: Criar bucket `course-materials` com acesso publico de leitura
- **Dados**: Usar ferramenta de insert para cadastrar modulos e aulas
- **Vimeo embed**: Converter URLs de compartilhamento para formato iframe (`https://player.vimeo.com/video/{ID}`)
- **Lesson.tsx**: Adicionar secao condicional abaixo do video com link para PDF

