// Backend da aula "Painel Inteligente": registra o progresso de cada aluno
// na aba "Registro do Desafio" da planilha da turma (uma linha por aluno).
var ABA = 'Registro do Desafio';
var CAB = ['Aluno', 'Painel escolhido', 'Entrou em', 'Missão (passos feitos)', 'Missão concluída', 'Quiz (acertos de 5)', 'Desafio concluído', 'Última atividade'];
var TOTAL_QUIZ = 5;
var TOTAL_MISSAO = 12; // passos da missão de cada aluno no site

function inteiro(v, min, max) {
  return typeof v === 'number' && Math.floor(v) === v && v >= min && v <= max;
}

function doGet() {
  return json({ ok: true, servico: 'painel-inteligente' });
}

function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    var d = JSON.parse((e && e.postData && e.postData.contents) || '{}');
    var nome = limpar(d.nome);
    if (!nome) return json({ ok: false, erro: 'Informe o nome.' });
    var aba = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(ABA);
    if (!aba) {
      aba = SpreadsheetApp.getActiveSpreadsheet().insertSheet(ABA);
      aba.getRange(1, 1, 1, CAB.length).setValues([CAB]);
    }
    var agora = Utilities.formatDate(new Date(), 'America/Manaus', 'dd/MM/yyyy HH:mm');
    var linha = acharLinha(aba, nome);
    var atual;
    if (linha) {
      atual = aba.getRange(linha, 1, 1, CAB.length).getValues()[0];
    } else {
      linha = Math.max(aba.getLastRow(), 1) + 1;
      atual = [nome, '', agora, '', 'Não', '', 'Não', agora];
    }
    if (d.painel) atual[1] = limpar(d.painel);
    if (inteiro(d.missaoFeitos, 0, TOTAL_MISSAO)) {
      atual[3] = d.missaoFeitos + ' de ' + TOTAL_MISSAO;
      if (d.missaoFeitos === TOTAL_MISSAO) atual[4] = 'Sim';
    }
    if (inteiro(d.quizAcertos, 0, TOTAL_QUIZ)) atual[5] = d.quizAcertos + ' de ' + TOTAL_QUIZ;
    atual[6] = (atual[4] === 'Sim' && atual[5] !== '') ? 'Sim' : 'Não';
    atual[7] = agora;
    aba.getRange(linha, 1, 1, CAB.length).setNumberFormat('@').setValues([atual]);
    return json({ ok: true, linha: linha });
  } catch (err) {
    return json({ ok: false, erro: String(err) });
  } finally {
    lock.releaseLock();
  }
}

function acharLinha(aba, nome) {
  var ultima = aba.getLastRow();
  if (ultima < 2) return 0;
  var nomes = aba.getRange(2, 1, ultima - 1, 1).getValues();
  var alvo = chave(nome);
  for (var i = 0; i < nomes.length; i++) {
    if (chave(String(nomes[i][0])) === alvo) return i + 2;
  }
  return 0;
}

function chave(s) {
  return String(s).trim().toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/\s+/g, ' ');
}

// Tira espaços extras, limita o tamanho e impede que o texto vire fórmula na planilha
function limpar(s) {
  s = String(s || '').replace(/[\x00-\x1F\x7F]/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 60);
  while (/^[\s=+\-@'"]/.test(s)) s = s.slice(1);
  return s;
}

function json(o) {
  return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON);
}

// Rode esta função uma vez no editor para autorizar o acesso à planilha
function autorizar() {
  Logger.log(SpreadsheetApp.getActiveSpreadsheet().getName());
}
