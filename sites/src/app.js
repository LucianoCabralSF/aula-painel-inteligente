(function(){
var $=function(id){return document.getElementById(id)};
function esc(s){return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;')}
function semAcento(s){return String(s).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g,'').trim()}
function ler(k,pad){try{var v=localStorage.getItem(k);return v===null?pad:JSON.parse(v)}catch(e){return pad}}
function gravar(k,v){try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}}

// Endereço do Apps Script da turma (apps-script/backend.js). Vazio = o progresso fica só neste computador.
var API='https://script.google.com/macros/s/AKfycbwXcbyNSYDksrbxwIU9B9M6tq2_MyGyId2aTGfiOJsy4qP4T3uGaWilmSSc53hQk_B06g/exec';
var aluno=ler('m7-nome','');
function enviar(dados,syncEl){
  if(!aluno)return Promise.resolve(false);
  if(!API){if(syncEl){syncEl.className='sync ok';syncEl.textContent='Salvo neste computador.'}return Promise.resolve(true)}
  dados.nome=aluno;
  if(syncEl){syncEl.className='sync';syncEl.textContent='Salvando no painel da turma…'}
  // sem Content-Type para não disparar CORS
  return fetch(API,{method:'POST',body:JSON.stringify(dados)}).then(function(r){return r.json()}).then(function(j){
    if(!j.ok)throw new Error(j.erro||'erro');
    if(syncEl){syncEl.className='sync ok';syncEl.textContent='Salvo no painel da turma.'}return true;
  }).catch(function(){
    if(syncEl){syncEl.className='sync err';syncEl.textContent='Não consegui salvar. Confira a internet e marque a caixinha de novo.'}return false;
  });
}
function chips(box,list,atual,aoClicar){box.innerHTML='';
  list.forEach(function(o){var b=document.createElement('button');b.type='button';b.className='btn'+(o[0]===atual?' on':'');b.textContent=o[1];
    b.addEventListener('click',function(){aoClicar(o[0])});box.appendChild(b)})}

// início: endereço sendo digitado
var full='sites.google.com/view/meu-portfolio',t=0;
function type(){$('typed').textContent=full.slice(0,t);if(t<full.length){t++;setTimeout(type,70)}}
if(window.matchMedia&&matchMedia('(prefers-reduced-motion:reduce)').matches){t=full.length}type();

// 1 · rascunho x publicado
var P={acc:'restrito',pub:null};
function renderPub(){
  var d=$('pTit').value.trim()||'(sem título)';
  $('pDraft').textContent=d;
  chips($('pAcc'),[['restrito','Restrito'],['link','Qualquer pessoa com o link']],P.acc,function(v){P.acc=v;renderPub()});
  var live=$('pLive'),v=$('pV');live.className='ban';
  if(!P.pub){live.className='ban none';live.textContent='Este endereço ainda não existe.';v.style.color='var(--bad)';v.textContent='Você nunca publicou. Para o mundo, o site não existe.'}
  else if(P.pub.acc==='restrito'){live.className='ban lock';live.textContent='🔒 Você precisa de acesso';v.style.color='var(--bad)';v.textContent='Publicado como Restrito: só quem você convidou entra. Mude para "Qualquer pessoa com o link" e publique de novo.'}
  else{live.textContent=P.pub.tit;
    var igual=P.pub.tit===d&&P.pub.acc===P.acc;v.style.color=igual?'var(--live)':'var(--bad)';
    v.textContent=igual?'No ar e atualizado. Qualquer pessoa com o endereço vê isto.':'O visitante ainda vê a versão antiga. Falta publicar de novo.'}
  $('pSaved').textContent=P.pub&&P.pub.tit===d&&P.pub.acc===P.acc?'Publicado. Rascunho e site estão iguais.':'Rascunho salvo automaticamente. Ainda não publicado.';
}
$('pTit').addEventListener('input',renderPub);
$('pPub').addEventListener('click',function(){P.pub={tit:$('pTit').value.trim()||'(sem título)',acc:P.acc};renderPub()});

// 2 · cartões
[].forEach.call(document.querySelectorAll('.flip'),function(c){c.addEventListener('click',function(){c.classList.toggle('open')})});

// missões
var MIS={
 m1:{nome:'Missão 1',fim:'site no ar!',rows:[
  ['Criar o site','No Drive: Novo › Mais › Google Sites.'],
  ['Dar os dois nomes','Nome do arquivo (lá em cima): Site_Portfolio_SeuNome. Nome do site: o seu primeiro nome.'],
  ['Criar o menu de uma vez','Aba Páginas, botão +. Crie: Início, Meus Trabalhos, Sobre Mim e Contato.'],
  ['Escrever o banner','O título do topo diz quem você é e o que a pessoa encontra aqui. Até seis palavras.'],
  ['Seção de apresentação','Uma faixa com três a cinco linhas sobre você, escritas com as suas palavras.'],
  ['Seção com imagem','Um avatar, um desenho ou um trabalho do curso, com legenda curta.'],
  ['Publicar e conferir','Botão Publicar › qualquer pessoa com o link. Abra o endereço em outra máquina e cole aqui embaixo.']]},
 m2:{nome:'Missão 2',fim:'site com identidade!',rows:[
  ['Escrever o objetivo no papel','Uma linha: o que eu quero que o visitante faça na minha página inicial.'],
  ['Escolher o tema','Painel Temas. Os prontos já combinam cor e fonte. Dois minutos.'],
  ['Definir a cor de destaque','Uma cor que já existe na imagem do topo. Só em títulos e botões.'],
  ['Arrumar a hierarquia','Aumente uma coisa e diminua duas. Use os estilos Título, Cabeçalho e Texto normal.'],
  ['Criar um botão','Inserir › Botão, na página inicial, levando para Meus Trabalhos. Texto com verbo: "Ver meus trabalhos".'],
  ['Publicar e ver no celular','Publique e use o ícone de visualização do editor para ver na tela pequena. Corrija o que ficar torto.']]},
 m3:{nome:'Missão 3',fim:'portfólio completo!',rows:[
  ['Listar no papel','Um trabalho de cada módulo (IA, documentos, apresentações, planilhas) e, ao lado, incorporar ou link.'],
  ['Liberar os arquivos','Em cada um: Compartilhar › qualquer pessoa com o link › Leitor. Nunca Editor.'],
  ['Incorporar a apresentação e o documento','Inserir › Apresentações ou Documentos. Documento longo vira link.'],
  ['Incorporar o gráfico do painel','Só o gráfico do seu Painel Inteligente, nunca a aba com a base de dados.'],
  ['Incorporar o formulário','Na página Contato. Veja o passo a passo logo abaixo.'],
  ['Publicar e testar na anônima','Ctrl + Shift + N, cole o endereço e confira bloco por bloco. Escreva uma legenda em cada um.']]},
 m4:{nome:'Missão 4',fim:'pronto para ensaiar!',rows:[
  ['Reescrever o título do topo','Minha versão primeiro. Depois cinco variações da IA, e escolho uma com motivo.'],
  ['Reescrever a chamada do botão','Uma frase com verbo. "Clique aqui" não vale.'],
  ['Pôr o meu detalhe','Um número ou fato verdadeiro que só eu sei: quantos trabalhos, em quantos meses.'],
  ['Declarar a autoria no rodapé','O que eu escrevi e onde a IA ajudou.'],
  ['Testar o site de um colega','Só com o endereço, sem explicação. Digo onde travei e uma coisa que funcionou bem.'],
  ['Corrigir o que impedia o uso','Site pedindo acesso, bloco que não aparece, texto que ninguém entendeu. E publicar de novo.']]},
 m5:{nome:'Checklist',fim:'pronto para o palco!',rows:[
  ['Publiquei depois da última mudança','Mesmo que nada tenha mudado, clique em Publicar por garantia.'],
  ['O site abre na janela anônima','Sem pedir acesso, com todas as páginas do menu.'],
  ['Todos os blocos aparecem','Apresentação, documento, gráfico e formulário, cada um com legenda.'],
  ['Nenhum dado pessoal exposto','Nem meu, nem de colegas.'],
  ['Conferi no celular','Título inteiro, texto legível, nada cortado.'],
  ['Tenho o plano B','Capturas de tela de cada página, salvas em uma apresentação, para o caso de a internet cair.'],
  ['Ensaiei duas vezes com o cronômetro','Em voz alta, dentro de três minutos.'],
  ['Abas abertas antes de começar','E depois disso não mexo em mais nada.']]}
};
var feito=ler('m7-feito',{});
function renderMis(id){
  var m=MIS[id],box=document.querySelector('.mwrap[data-m="'+id+'"]'),ok=0,h='';
  m.rows.forEach(function(r,i){var k=id+'-'+i,d=!!feito[k];if(d)ok++;
    h+='<tr class="'+(d?'done':'')+'"><td><input type="checkbox" data-k="'+k+'"'+(d?' checked':'')+' aria-label="Marcar: '+esc(r[0])+'"></td><td class="ref">'+(i+1)+'</td><td class="what">'+esc(r[0])+'</td><td class="wrap">'+esc(r[1])+'</td></tr>'});
  var tot=m.rows.length;
  box.innerHTML='<div style="display:flex;align-items:center;gap:12px;margin-bottom:10px"><div class="meter" style="flex:1"><i style="width:'+(ok/tot*100)+'%"></i></div><span class="score">'+ok+' de '+tot+(ok===tot?' · '+m.fim:'')+'</span></div>'+
    '<div class="tablewrap"><table><thead><tr><th>Feito</th><th>Passo</th><th>O que fazer</th><th>Como</th></tr></thead><tbody>'+h+'</tbody></table></div><p class="sync" data-sync="'+id+'"></p>';
  return ok;
}
function contar(id){var n=0;MIS[id].rows.forEach(function(r,i){if(feito[id+'-'+i])n++});return n}
Object.keys(MIS).forEach(function(id){
  renderMis(id);
  document.querySelector('.mwrap[data-m="'+id+'"]').addEventListener('change',function(e){
    var k=e.target.getAttribute('data-k');if(!k)return;
    feito[k]=e.target.checked;gravar('m7-feito',feito);renderMis(id);
    var d={};d[id]=contar(id);enviar(d,document.querySelector('[data-sync="'+id+'"]'));
  });
});
function enviarTudo(){var d={};Object.keys(MIS).forEach(function(id){d[id]=contar(id)});var s=ler('m7-site','');if(s)d.site=s;enviar(d,null)}

// endereço do site
var site=ler('m7-site','');
if(site){$('siteUrl').value=site;$('syncS').className='sync ok';$('syncS').textContent='Endereço salvo.'}
$('siteSave').addEventListener('click',function(){
  var v=$('siteUrl').value.trim(),s=$('syncS');
  if(!/^https:\/\/sites\.google\.com\/[^\s]+$/.test(v)){s.className='sync err';s.textContent='O endereço precisa começar com https://sites.google.com/ . Copie da barra do navegador depois de publicar.';return}
  if(/\/edit(\?|$)/.test(v)||/\/d\//.test(v)){s.className='sync err';s.textContent='Este é o endereço do editor. Clique em Publicar e copie o endereço do site publicado.';return}
  gravar('m7-site',v);enviar({site:v},s);
});

// 4 · laboratório de design
var LAB={cor:'c6',fonte:'f3',tam:'flat',con:'low'};
var LOPT=[['cor','Cores',[['ok','Uma cor de destaque'],['c6','Seis cores']]],['fonte','Fontes',[['ok','Uma família'],['f3','Três fontes']]],['tam','Tamanhos',[['ok','Um grande, o resto menor'],['flat','Tudo do mesmo tamanho']]],['con','Contraste',[['ok','Texto escuro no claro'],['low','Cinza claro no branco']]]];
function renderLab(){
  var o=$('labOpts');o.innerHTML='';var bons=0,cls='lab';
  LOPT.forEach(function(g){var l=document.createElement('span');l.className='lbl';l.textContent=g[1];o.appendChild(l);
    var w=document.createElement('div');w.className='row';chips(w,g[2],LAB[g[0]],function(v){LAB[g[0]]=v;renderLab()});o.appendChild(w);
    if(LAB[g[0]]==='ok')bons++;else cls+=' '+LAB[g[0]]});
  $('lab').className=cls;
  var r=$('labScore');r.textContent=bons+' de 4';r.className=bons===4?'':'err';
  $('labMsg').textContent=bons===4?'Guia. Dá para saber por onde começar a ler, e parece feito por quem sabe o que está fazendo.':bons>=2?'Melhorando. Se tudo chama atenção, nada chama atenção.':'Confunde. O texto é o mesmo, mas você deixaria seu nome neste site?';
}
function palavras(s){s=s.trim();return s?s.split(/\s+/).length:0}
function renderPhone(){var v=$('phTit').value.trim(),n=palavras(v);$('phBan').textContent=v||'(sem título)';
  var e=$('phV');e.style.color=n&&n<=6?'var(--live)':'var(--bad)';
  e.textContent=!n?'Digite um título.':n<=6?n+' palavra'+(n>1?'s':'')+'. Cabe bem na tela pequena.':n+' palavras. No celular o título cobre a tela inteira. Corte para seis ou menos.'}
$('phTit').addEventListener('input',renderPhone);

// 6 · permissão
var PERM={doc:'restrito',slides:'restrito',graf:'restrito',form:'login'},permAberta=false;
var PITENS=[['doc','Documento'],['slides','Apresentação'],['graf','Gráfico do painel'],['form','Formulário']];
var POPT=[['restrito','Restrito'],['leitor','Com o link · Leitor'],['editor','Com o link · Editor']],FOPT=[['login','Exige login'],['livre','Aceita sem login']];
function renderPermEd(){var ed=$('permEd');ed.innerHTML='<span class="lbl">Permissão de cada arquivo</span>';
  PITENS.forEach(function(it){var d=document.createElement('div');d.className='perm';d.innerHTML='<b>'+it[1]+'</b>';
    var w=document.createElement('div');w.className='row';chips(w,it[0]==='form'?FOPT:POPT,PERM[it[0]],function(v){PERM[it[0]]=v;renderPermEd();if(permAberta)renderPermView()});
    d.appendChild(w);ed.appendChild(d)})}
function renderPermView(){var h='',ok=0;
  PITENS.forEach(function(it){var v=PERM[it[0]];
    if(v==='restrito')h+='<div class="blk no">🔒 '+it[1]+': você precisa de acesso</div>';
    else if(v==='login')h+='<div class="blk no">🔒 '+it[1]+': faça login para responder</div>';
    else if(v==='editor')h+='<div class="blk risk">⚠ '+it[1]+': aparece, mas qualquer visitante pode apagar tudo</div>';
    else{ok++;h+='<div class="blk ok">✓ '+it[1]+': aparece certinho</div>'}});
  $('permView').innerHTML=h;var e=$('permV');e.style.color=ok===4?'var(--live)':'var(--bad)';
  e.textContent=ok===4?'Os quatro blocos funcionam para quem não é você. É assim que o seu site precisa estar.':ok+' de 4 funcionando. Ajuste as permissões ao lado: a tela atualiza na hora.'}
$('permGo').addEventListener('click',function(){permAberta=true;renderPermView()});

// incorporar ou link
var SORT=[['Formulário "Fale comigo"','inc','Incorporar. Cada clique a mais perde gente.'],['Documento de dez páginas','link','Link. Ninguém lê dez páginas dentro de um retângulo.'],['Gráfico do seu painel','inc','Incorporar. Ele atualiza sozinho e é o seu melhor argumento.'],['PDF para a pessoa baixar','link','Link. É algo que a pessoa leva embora.'],['Planilha com nomes e respostas das pessoas','nao','Nenhum dos dois. Dado pessoal não vai para site público. Mostre só o gráfico.']];
var SOPT=[['inc','Incorporar'],['link','Link'],['nao','Nenhum dos dois']];
function montarPerguntas(box,lista,opcoes,aoFim){var placar={};
  lista.forEach(function(q,qi){var d=document.createElement('div');d.className='card q';
    d.innerHTML='<b>'+(qi+1)+'. '+esc(q[0])+'</b><div class="opts"></div><div class="fb"></div>';
    var o=d.querySelector('.opts'),fb=d.querySelector('.fb');
    (opcoes||q[3]).forEach(function(op){var b=document.createElement('button');b.type='button';b.className='btn';b.textContent=op[1];
      b.addEventListener('click',function(){
        [].forEach.call(o.querySelectorAll('button'),function(x){x.classList.remove('right','wrong')});
        var certo=op[0]===q[1];b.classList.add(certo?'right':'wrong');fb.style.color=certo?'var(--live)':'var(--bad)';
        fb.textContent=certo?q[2]:'Ainda não. Leia de novo e pense em quem vai abrir o site.';
        if(placar[qi]===undefined)placar[qi]=certo;
        if(aoFim&&Object.keys(placar).length===lista.length)aoFim(Object.keys(placar).filter(function(k){return placar[k]}).length);
      });o.appendChild(b)});
    box.appendChild(d)})}
montarPerguntas($('sortBox'),SORT,SOPT,null);

// 8 · teste do título
var VAZIAS=['incrivel','unico','inovador','melhor','top','legal','maravilhoso','perfeito','show'];
var EXEMPLOS=['Bem-vindo ao meu site incrível','Meu site','Quatro projetos que eu construí em três meses'];
function renderTit(){var v=$('tTit').value.trim(),k=semAcento(v),n=palavras(v),ws=k.split(/[^a-z0-9]+/);
  var testes=[
    [n>=3&&n<=8,'Tem entre três e oito palavras ('+n+')'],
    [k.indexOf('bem-vindo')<0&&k.indexOf('bem vindo')<0&&k.indexOf('espero que')<0,'Não gasta espaço com "bem-vindo"'],
    [!VAZIAS.some(function(a){return ws.indexOf(a)>-1}),'Sem adjetivo vazio (incrível, único, top…)'],
    [k!=='meu site'&&k!=='meu portfolio'&&k!=='inicio'&&n>0,'Diz mais do que "Meu site"'],
    [/\d|\b(um|dois|tres|quatro|cinco|seis|sete|oito|nove|dez)\b/.test(k),'Traz um número ou fato concreto']];
  var ok=0;$('tChecks').innerHTML=testes.map(function(x){if(x[0])ok++;return '<li class="'+(x[0]?'ok':'no')+'">'+(x[0]?'✓ ':'✗ ')+x[1]+'</li>'}).join('');
  var e=$('tV');e.style.color=ok===5?'var(--live)':'var(--bad)';
  e.textContent=ok===5?'Serve. Só poderia estar no seu site.':'Ainda poderia estar no site de qualquer pessoa. Falta o detalhe que só você sabe.';}
$('tTit').addEventListener('input',renderTit);
chips($('tEx'),EXEMPLOS.map(function(x,i){return [i,'Exemplo '+(i+1)]}),-1,function(i){$('tTit').value=EXEMPLOS[i];renderTit()});

// prompts
var PR=[['Título do topo','Escreva cinco títulos para o topo de um site que reúne [o que o site tem]. Cada título com no máximo seis palavras, dizendo o que o visitante ganha ao ficar. Sem adjetivos como incrível, único ou inovador.'],
 ['Texto de abertura','Escreva cinco versões do texto de abertura da página inicial de um site. O site reúne [o que o site tem]. Quem lê é alguém da comunidade que nunca ouviu falar do curso. Máximo de quarenta palavras por versão. Tom direto, sem adjetivos exagerados. Termine com uma chamada para ação com verbo. Marque com colchetes o que eu preciso conferir.'],
 ['Encurtar pela metade','Reescreva o texto abaixo com metade das palavras, sem perder nenhuma informação concreta. Corte adjetivos.\n\n[cole aqui a versão escolhida]'],
 ['Declaração de autoria (rodapé)','Os textos deste site foram escritos por [seu primeiro nome] com apoio de inteligência artificial para gerar variações de título e de chamada. A escolha, a revisão e os dados são meus.']];
PR.forEach(function(p){var d=document.createElement('div');d.className='card pr';
  d.innerHTML='<h3>'+esc(p[0])+'</h3><pre>'+esc(p[1])+'</pre><button type="button" class="copy">Copiar</button>';$('prompts').appendChild(d)});
$('prompts').addEventListener('click',function(e){var b=e.target.closest('.copy');if(!b)return;var code=b.previousElementSibling;
  var ok=function(){b.textContent='Copiado';b.classList.add('ok');setTimeout(function(){b.textContent='Copiar';b.classList.remove('ok')},1500)};
  var fb=function(){var r=document.createRange();r.selectNodeContents(code);var s=getSelection();s.removeAllRanges();s.addRange(r);b.textContent='Ctrl+C'};
  try{navigator.clipboard.writeText(code.textContent).then(ok,fb)}catch(err){fb()}});

// 10 · quiz
var Q=[
 ['Mudei o título no editor, mas o colega continua vendo o antigo.','b','Isso. O Sites salva sozinho, mas só o Publicar põe no ar.',[['a','O site quebrou'],['b','Faltou clicar em Publicar'],['c','A internet dele caiu']]],
 ['O colega abre o endereço do meu site e aparece "você precisa de acesso".','c','Isso. O site foi publicado como restrito.',[['a','Mandar o link de novo'],['b','Pedir a senha dele'],['c','Publicar › Gerenciar › qualquer pessoa com o link']]],
 ['O gráfico aparece para mim, mas na janela anônima vira um retângulo pedindo acesso.','a','Isso. O site não empresta a sua permissão: o arquivo precisa estar liberado.',[['a','O arquivo incorporado está restrito'],['b','O gráfico é pesado demais'],['c','Falta trocar o tema']]],
 ['Qual é a permissão certa para um arquivo incorporado no site?','b','Isso. Quem tem o endereço olha e não mexe.',[['a','Restrito'],['b','Qualquer pessoa com o link · Leitor'],['c','Qualquer pessoa com o link · Editor']]],
 ['Qual título serve melhor para o topo do portfólio?','c','Isso. Diz o que a pessoa encontra e traz um número.',[['a','Bem-vindo ao meu site'],['b','O site mais incrível do mundo'],['c','Quatro projetos que eu construí']]],
 ['O que NÃO pode aparecer em um site aberto?','a','Isso. Site aberto é aberto mesmo.',[['a','Endereço de casa e telefone'],['b','O gráfico do meu painel'],['c','Meu primeiro nome']]]];
montarPerguntas($('quizBox'),Q,null,function(c){
  $('quizScore').textContent='Acertou de primeira: '+c+' de '+Q.length+(c===Q.length?'. Mandou bem!':'');
  gravar('m7-quiz',c);enviar({quiz:c},$('syncQ'))});

// 11 · cronômetro
var fim=0,iv=null;
function mostra(seg){$('clk').textContent=('0'+Math.floor(seg/60)).slice(-2)+':'+('0'+seg%60).slice(-2)}
function tique(){var r=Math.max(0,Math.round((fim-Date.now())/1000));mostra(r);
  if(r===60)$('tMsg').textContent='Falta um minuto. Comece a fechar.';
  if(r===0){clearInterval(iv);iv=null;$('clk').classList.add('end');$('tMsg').textContent='Tempo! Se faltou falar algo, corte conteúdo no próximo ensaio.'}}
$('tGo').addEventListener('click',function(){clearInterval(iv);$('clk').classList.remove('end');$('tMsg').textContent='Valendo. Fale olhando para a turma.';fim=Date.now()+180000;tique();iv=setInterval(tique,500)});
$('tStop').addEventListener('click',function(){clearInterval(iv);iv=null;$('clk').classList.remove('end');mostra(180);$('tMsg').textContent='Ensaie em voz alta. Se o tempo apertar, corte conteúdo: não fale mais rápido.'});

// navegação
var secs=[].slice.call(document.querySelectorAll('main section')),links=[].slice.call(document.querySelectorAll('#nav a'));
function cur(){var y=scrollY+120,c=0;secs.forEach(function(s,i){if(s.offsetTop<=y)c=i});return c}
function onScroll(){var c=cur();links.forEach(function(a,i){a.classList.toggle('on',i===c)});
  var h=document.documentElement.scrollHeight-innerHeight;$('progress').style.width=(h>0?scrollY/h*100:0)+'%';
  var on=links[c];if(on&&on.parentNode.scrollWidth>on.parentNode.clientWidth){on.parentNode.scrollLeft=on.offsetLeft-40}}
addEventListener('scroll',onScroll,{passive:true});
addEventListener('keydown',function(e){if(/INPUT|TEXTAREA/.test(document.activeElement.tagName))return;
  var c=cur();if(e.key==='ArrowRight'&&c<secs.length-1){e.preventDefault();secs[c+1].scrollIntoView()}
  if(e.key==='ArrowLeft'&&c>0){e.preventDefault();secs[c-1].scrollIntoView()}});

// nome do aluno
function mostrarAluno(){$('me').hidden=!aluno;$('meNome').textContent=aluno;$('gate').hidden=!!aluno;if(!aluno)$('gateNome').focus()}
$('gateForm').addEventListener('submit',function(e){e.preventDefault();
  var nome=$('gateNome').value.replace(/\s+/g,' ').trim();
  if(nome.length<2){$('gateErr').textContent='Digite seu nome para entrar.';return}
  aluno=nome;gravar('m7-nome',aluno);$('gateErr').textContent='';mostrarAluno();enviarTudo()});
$('meTrocar').addEventListener('click',function(){aluno='';try{localStorage.removeItem('m7-nome')}catch(err){}$('gateNome').value='';mostrarAluno()});

renderPub();renderLab();renderPhone();renderPermEd();renderTit();onScroll();mostrarAluno();
$('permView').innerHTML='<div class="blk">Clique em "Abrir em janela anônima" para ver.</div>';
})();
