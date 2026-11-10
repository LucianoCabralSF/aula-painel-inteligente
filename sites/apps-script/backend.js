// Backend da aula "Portfólio no Ar" (Módulo 7): registra o progresso de cada aluno
// na aba "Registro dos Sites" da planilha da turma (uma linha por aluno).
var ABA = 'Registro dos Sites';
var CAB = ['Aluno', 'Entrou em', 'Missão 1 · site no ar', 'Missão 2 · design', 'Missão 3 · trabalhos', 'Missão 4 · textos e teste', 'Checklist do palco', 'Quiz (acertos de 6)', 'Endereço do site', 'Última atividade'];
// campo enviado pelo site -> [coluna (base 0), total de passos]
var MISSOES = { m1: [2, 7], m2: [3, 6], m3: [4, 6], m4: [5, 6], m5: [6, 8] };
var TOTAL_QUIZ = 6;

function inteiro(v, min, max) {
  return typeof v === 'number' && Math.floor(v) === v && v >= min && v <= max;
}

function doGet() {
  return json({ ok: true, servico: 'portfolio-no-ar' });
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
      atual = [nome, agora, '', '', '', '', '', '', '', agora];
    }
    Object.keys(MISSOES).forEach(function (k) {
      var col = MISSOES[k][0], total = MISSOES[k][1];
      if (inteiro(d[k], 0, total)) atual[col] = d[k] + ' de ' + total;
    });
    if (inteiro(d.quiz, 0, TOTAL_QUIZ)) atual[7] = d.quiz + ' de ' + TOTAL_QUIZ;
    // só aceita endereço de site publicado no Google Sites
    if (typeof d.site === 'string' && /^https:\/\/sites\.google\.com\/[^\s]{1,200}$/.test(d.site)) atual[8] = d.site;
    atual[9] = agora;
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
