(function(){
/* ══════════════════════════════════════════════
   CONFIG — Өз деректеріңізді осы жерде жазыңыз
   ══════════════════════════════════════════════ */
var CONFIG = {
  groom: 'Тамерлан',
  bride: 'Дина',
  eventType: 'Той',
  eventDate: { year: 2026, month: 11, day: 27 },
  eventTime: '19:00',

  program: [
    { time: '17:00', text: 'Қонақтардың жиналуы' },
    { time: '18:00', text: 'Тойдың басталуы' },
    { time: '23:00', text: 'Шығарып салу' }
  ],

  venueName: '«Zaman» мейрамханасы',
  venueAddr: 'Қарағанды қаласы, Голубые пруды, 18а',
  mapUrl: 'https://2gis.kz/karaganda/firm/70000001040839883',

  scriptUrl: 'https://script.google.com/macros/s/AKfycbyLz1zLDzbqEXHyhkTXNcnQnM35tin5rXz3WEzGRnQKvCFt5gmLGgZol-KGNT7T3U_H-A/exec',

  hosts: 'МЕРХАТ — ТОЛҚЫН',

  assets: {
    hero: 'image_1.jpg',
    bride: 'image_2.jpeg',
    venue: 'assets/venue.webp',
    closing: 'image_2.jpeg'
  }
};

var MONTHS_KK = ['Қаңтар','Ақпан','Наурыз','Сәуір','Мамыр','Маусым','Шілде','Тамыз','Қыркүйек','Қазан','Қараша','Желтоқсан'];
var $ = function(id){ return document.getElementById(id); };
var setText = function(id,v){ var el=$(id); if(el) el.textContent = v; };

/* ═══ INJECT CONFIG ═══ */
setText('groom-name', CONFIG.groom);
setText('bride-name', CONFIG.bride);
setText('invite-groom', CONFIG.groom);
setText('invite-bride', CONFIG.bride);
setText('venue-name', CONFIG.venueName);
setText('venue-addr', CONFIG.venueAddr);
setText('hosts-names', CONFIG.hosts);

$('map-link').href = CONFIG.mapUrl;

var d = CONFIG.eventDate;
setText('d-day', d.day);
setText('d-month', d.month);
setText('d-year', String(d.year).slice(-2));
setText('cal-month', MONTHS_KK[d.month-1] + ' ' + d.year);

$('hero-img').src = CONFIG.assets.hero;
$('hero-img').alt = CONFIG.groom + ' & ' + CONFIG.bride;
$('closing-img').src = CONFIG.assets.closing;
var calSection1 = document.querySelector('.calendar-section');
if(calSection1) calSection1.style.backgroundImage = "url('image_3.jpg')";

/* ═══ CALENDAR ═══ */
(function buildCalendar(){
  var year = d.year, month = d.month - 1, markDay = d.day;
  var first = new Date(year, month, 1);
  var startOffset = (first.getDay() + 6) % 7;
  var daysInMonth = new Date(year, month+1, 0).getDate();
  var daysInPrev = new Date(year, month, 0).getDate();
  var cells = [];
  var i;
  for(i=0; i<startOffset; i++){
    cells.push({d: daysInPrev - startOffset + 1 + i, dim:true});
  }
  for(i=1; i<=daysInMonth; i++){
    cells.push({d:i, dim:false, mark:(i===markDay)});
  }
  while(cells.length % 7 !== 0){
    cells.push({d: cells.length - (startOffset+daysInMonth) + 1, dim:true});
  }
  var html = '';
  for(var r=0; r<cells.length/7; r++){
    html += '<tr>';
    for(var c=0; c<7; c++){
      var cell = cells[r*7+c];
      var cls = cell.dim ? 'dim' : (cell.mark ? 'mark' : '');
      html += '<td class="'+cls+'"><span class="dn">'+cell.d+'</span></td>';
    }
    html += '</tr>';
  }
  $('cal-body').innerHTML = html;
})();

/* ═══ PROGRAM ═══ */
(function buildProgram(){
  var html = '';
  CONFIG.program.forEach(function(p){
    html += '<div class="t-item"><div class="t-dot"></div><div><div class="t-time">'+p.time+'</div><div class="t-what">'+p.text+'</div></div></div>';
  });
  $('program-list').innerHTML = html;
})();

/* ═══ COUNTDOWN ═══ */
(function startCountdown(){
  var pad = function(n){ return String(n).padStart(2,'0'); };
  var target = new Date(d.year+'-'+pad(d.month)+'-'+pad(d.day)+'T'+CONFIG.eventTime+':00');
  function tick(){
    var now = new Date();
    var diff = target - now;
    if(diff < 0) diff = 0;
    var dd = Math.floor(diff / (1000*60*60*24));
    var hh = Math.floor((diff / (1000*60*60)) % 24);
    var mm = Math.floor((diff / (1000*60)) % 60);
    var ss = Math.floor((diff / 1000) % 60);
    setText('cd-days', pad(dd));
    setText('cd-hours', pad(hh));
    setText('cd-min', pad(mm));
    setText('cd-sec', pad(ss));
  }
  tick();
  setInterval(tick, 1000);
})();

/* ═══ SPARKLES ═══ */
(function createSparkles(){
  var container = $('sparkles');
  if(!container) return;
  for(var i=0; i<22; i++){
    var s = document.createElement('div');
    s.className = 'sparkle';
    s.style.left = (Math.random()*100)+'%';
    s.style.top = (Math.random()*55)+'%';
    var size = 2 + Math.random()*4;
    s.style.width = size+'px';
    s.style.height = size+'px';
    s.style.animationDelay = (Math.random()*5)+'s';
    s.style.animationDuration = (2 + Math.random()*3)+'s';
    container.appendChild(s);
  }
})();

/* ═══ MUSIC TOGGLE ═══ */
(function initMusic(){
  var audio = $('bg-music');
  var btn = $('music-toggle');
  if(!audio || !btn) return;

  function startMusic(){
    audio.play().then(function(){ btn.classList.remove('paused'); }).catch(function(){});
  }
  startMusic();

  function onFirstInteraction(){
    startMusic();
    document.removeEventListener('touchstart', onFirstInteraction);
    document.removeEventListener('click', onFirstInteraction);
  }
  document.addEventListener('touchstart', onFirstInteraction, {once:true});
  document.addEventListener('click', onFirstInteraction, {once:true});

  btn.addEventListener('click', function(e){
    e.stopPropagation();
    if(audio.paused){
      audio.play().then(function(){ btn.classList.remove('paused'); }).catch(function(){});
    } else {
      audio.pause();
      btn.classList.add('paused');
    }
  });
})();

/* ═══ RSVP FORM ═══ */
(function initForm(){
  var form = $('rsvp-form');
  var submitBtn = $('submit-btn');
  var attendRadios = document.querySelectorAll('input[name=attend]');
  var guestBox = $('guest-count');
  var modal = $('success-message');
  var closeBtn = $('success-close');

  attendRadios.forEach(function(radio){
    radio.addEventListener('change', function(){
      if($('attend-yes').checked){
        guestBox.classList.add('show');
      } else {
        guestBox.classList.remove('show');
      }
      submitBtn.disabled = false;
    });
  });

  form.addEventListener('submit', function(e){
    e.preventDefault();
    var checked = document.querySelector('input[name=attend]:checked');
    if(!checked){ alert('Қатысуыңызды таңдаңыз'); return; }
    var name = $('rsvp-name').value.trim();
    if(!name){ alert('Атыңызды енгізіңіз'); $('rsvp-name').focus(); return; }

    var guests = '';
    if(checked.id === 'attend-yes'){
      guests = $('guest-select').value;
    }

    var formData = new URLSearchParams();
    formData.append('name', name);
    formData.append('attend', checked.value);
    formData.append('guests', guests);

    var defaultText = submitBtn.textContent;
    submitBtn.disabled = true;
    submitBtn.textContent = 'Жіберілуде…';

    fetch(CONFIG.scriptUrl, {
      method: 'POST',
      body: formData
    })
    .then(function(res){ return res.text(); })
    .then(function(text){
      var data = null;
      try { data = JSON.parse(text); } catch(e){ data = null; }
      if(data && data.ok){
        modal.classList.add('show');
      } else {
        console.error('RSVP error:', text);
        alert('Қате орын алды. Сервер жауап бермеді — кейінірек қайталаңыз.');
      }
    })
    .catch(function(err){
      console.error(err);
      alert('Қате орын алды. Интернетті тексеріңіз немесе кейінірек қайталаңыз.');
    })
    .finally(function(){
      submitBtn.disabled = false;
      submitBtn.textContent = defaultText;
      if($('attend-yes').checked || document.querySelector('input[name=attend]:checked')){
        submitBtn.disabled = false;
      } else {
        submitBtn.disabled = true;
      }
    });
  });

  closeBtn.addEventListener('click', function(){
    modal.classList.remove('show');
    form.reset();
    $('guest-count').classList.remove('show');
    $('submit-btn').disabled = true;
  });
})();

/* ═══ SCROLL REVEAL ═══ */
(function revealOnScroll(){
  var els = document.querySelectorAll('.invite-name,.invite-say,.kicker,.section-title,.reveal,.divider');
  if(!els.length) return;
  if('IntersectionObserver' in window){
    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(en){
        if(en.isIntersecting){
          en.target.classList.add('in');
          io.unobserve(en.target);
        }
      });
    },{threshold:0.25});
    els.forEach(function(el){ io.observe(el); });
  } else {
    els.forEach(function(el){ el.classList.add('in'); });
  }

  // Timeline items animate individually with a small stagger
  var tItems = document.querySelectorAll('.t-item');
  if(tItems.length && 'IntersectionObserver' in window){
    var tio = new IntersectionObserver(function(entries){
      entries.forEach(function(en){
        if(en.isIntersecting){
          en.target.classList.add('in');
          tio.unobserve(en.target);
        }
      });
    },{threshold:0.3});
    tItems.forEach(function(el,i){
      el.style.transitionDelay = (i*0.12)+'s';
      tio.observe(el);
    });
  } else {
    tItems.forEach(function(el){ el.classList.add('in'); });
  }
})();

})();