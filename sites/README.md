# Aula: Portfólio no Ar (Módulo 7)

Site interativo das aulas de Google Sites (aulas 21 a 24) e da preparação para a apresentação do Projeto Integrador.
Mesmo formato da aula Painel Inteligente: o aluno informa o nome ao entrar, e o progresso das missões, o resultado do quiz e o endereço do site dele são registrados na aba **Registro dos Sites** da planilha da turma, por meio do Apps Script em `apps-script/`.

## Publicar

GitHub Pages deste repositório, na pasta `sites/` (endereço do Pages + `/sites/`).

## Ligar o painel da turma

Sem este passo o site funciona, mas o progresso fica só no computador de cada aluno.

1. Na planilha da turma: Extensões › Apps Script. Cole `apps-script/backend.js` e, em Configurações do projeto, mostre e substitua o `appsscript.json`.
2. Rode a função `autorizar` uma vez.
3. Implantar › Nova implantação › App da Web, executando como você, com acesso para qualquer pessoa.
4. Copie o endereço que termina em `/exec` e cole em `var API=''` no `index.html`.

Aviso: a API é pública e grava apenas o primeiro nome do aluno, o progresso da aula e o endereço do site publicado.

## Editar

O `index.html` é montado a partir de `src/` (`body.html`, `extra.css`, `app.js`) mais o CSS da aula Painel Inteligente.
