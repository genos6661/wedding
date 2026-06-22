/* =====================================================================
   QUEST OF TWO HEARTS — app.js
   Retro RPG Wedding Invitation — Main Logic
   ---------------------------------------------------------------------
   EDIT EVERYTHING IN `weddingData` BELOW TO CUSTOMIZE THE INVITATION.
===================================================================== */

const weddingData = {
  // ----- couple -----
  groomName: "Fathur Rohman Hamid",
  brideName: "Sephia Marcella Salsabil",

  // short display names (used in compact UI like hero cards)
  groomShort: "Fathur",
  brideShort: "Sephia",

  // ----- event -----
  weddingDate: "2026-07-23T04:00:00Z", // ISO format, used for countdown
  weddingDateDisplay: "Kamis, 23 Juli 2026",
  weddingTimeDisplay: "11.00 WIB — selesai",
  venue: "Griya Prasmanan Djawi Mbok Si'in",
  address: "Jl. Balai Desa Pandantoyo, Kec. Kertosono, Kab. Nganjuk, Jawa Timur",
  mapLink: "https://maps.app.goo.gl/7TgQ8cuGzDpy6xSk7",

  // ----- quote -----
  quote: "Dalam setiap kisah cinta yang abadi, selalu ada awal yang sederhana — dua jiwa yang dipertemukan oleh takdir, dan keberanian untuk berkata: aku memilihmu, untuk semua level kehidupan yang akan datang.",

  // ----- short story (each entry = one short paragraph, like a letter) -----
  story: [
    "Pada waktu yang tidak kami duga, dua jalan yang berbeda arah perlahan bertemu di satu titik yang sama.",
    "Bukan kebetulan — begitu kami menyebutnya kini. Sebab setiap pertemuan kecil terasa seperti bagian dari cerita yang sudah diatur sejak awal permainan, membawa makna yang perlahan semakin jelas.",
    "Dari sekadar saling menyapa, tumbuh rasa percaya. Dari percaya, tumbuh keberanian untuk saling memilih, setiap hari, tanpa ragu.",
    "Dan kini, dengan restu Tuhan serta doa orang-orang tercinta, kami melangkah ke babak baru — bukan lagi sebagai dua karakter yang berjalan sendiri, melainkan satu tim yang siap menghadapi perjalanan untuk selamanya."
  ],

  // ----- gallery (4–8 photos). Put files in assets/images/ -----
  gallery: [
    { src: "assets/images/1.png", caption: "First Meeting" },
    { src: "assets/images/2.png", caption: "The Adventure Begins" },
    { src: "assets/images/3.png", caption: "Side Quests Together" },
    { src: "assets/images/4.png", caption: "Leveling Up" },
    { src: "assets/images/5.png", caption: "The Proposal" },
    { src: "assets/images/6.png", caption: "Save The Date" }
  ],

  // ----- couple portrait photos (closing section, side-by-side) -----
  groomPortrait: "assets/images/groom-full.png",
  bridePortrait: "assets/images/bride-full.png",

  // ----- gift / bank info -----
  bankName: "Bank Central Asia (BCA)",
  accountNumber: "4390851958",
  accountHolder: "Fathur Rohman Hamid",

  bankName2: "Bank Rakyat Indonesia (BRI)",
  accountNumber2: "375001004159508",
  accountHolder2: "Sephia Marcella Salsabil",

  // ----- signature (closing) -----
  signatureNames: "Fathur & Sephia"
};

/* =====================================================================
   BOOT TERMINAL SCRIPT LINES
   `cls` controls color: '' default green, 'gold', 'rose'
   `holdMs` (optional) overrides the default pause after this line finishes
   typing — used to make the player-name line linger a bit longer.
===================================================================== */
function buildBootLines(playerName){
  const lines = [
    { text: "INITIALIZING QUEST SYSTEM...", cls: "" },
    { text: "LOADING MEMORY FILES...", cls: "" },
    { text: "MEMORY #01 FOUND ─ First Meeting", cls: "line-good" },
    { text: "MEMORY #02 FOUND ─ Shared Laughter", cls: "line-good" },
    { text: "MEMORY #03 FOUND ─ Countless Promises", cls: "line-good" }
  ];

  if(playerName){
    lines.push({
      text: `WELCOME, ${playerName.toUpperCase()}!`,
      cls: "line-player",
      holdMs: 1600 // linger longer so the player can see their name
    });
  }

  lines.push(
    { text: "LOADING SOULMATE DATA...", cls: "" },
    { text: `SEARCHING FOR... ${weddingData.groomShort} & ${weddingData.brideShort}`, cls: "" },
    { text: "MATCH FOUND ✓", cls: "line-gold" },
    { text: "COMPATIBILITY: 100%", cls: "line-gold" },
    { text: "GENERATING INVITATION PACKAGE...", cls: "" },
    { text: "SUCCESS!", cls: "line-good" },
    { text: "REWARD UNLOCKED", cls: "line-rose" }
  );

  return lines;
}

/* =====================================================================
   STATE
===================================================================== */
let musicStarted = false;
let bootSkipRequested = false;
let currentPlayerName = "";

/* =====================================================================
   BACKGROUND PIXEL STAR NOISE CANVAS
===================================================================== */
function initBgCanvas(){
  const canvas = document.getElementById('bg-noise');
  if(!canvas) return;
  const ctx = canvas.getContext('2d');
  let stars = [];

  function resize(){
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const count = Math.floor((canvas.width * canvas.height) / 9000);
    stars = [];
    for(let i=0;i<count;i++){
      stars.push({
        x: Math.random()*canvas.width,
        y: Math.random()*canvas.height,
        size: Math.random() < 0.85 ? 1 : 2,
        baseAlpha: Math.random()*0.5 + 0.15,
        speed: Math.random()*0.015 + 0.005,
        phase: Math.random()*Math.PI*2
      });
    }
  }

  let t = 0;
  function draw(){
    t += 1;
    ctx.clearRect(0,0,canvas.width,canvas.height);
    ctx.fillStyle = '#0a0e1f';
    ctx.fillRect(0,0,canvas.width,canvas.height);
    for(const s of stars){
      const a = s.baseAlpha + Math.sin(t*s.speed + s.phase)*0.18;
      ctx.fillStyle = `rgba(232,195,74,${Math.max(0,Math.min(1,a))})`;
      ctx.fillRect(s.x, s.y, s.size, s.size);
    }
    requestAnimationFrame(draw);
  }

  window.addEventListener('resize', resize);
  resize();
  draw();
}

/* =====================================================================
   PHASE 0 — PLAYER NAME MODAL
===================================================================== */
function getPlayerNameFromUrl(){
  const search = window.location.search;
  if(!search) return "";

  // regex: tangkap nilai player_name hingga & berikutnya atau akhir string
  // \+ di-replace ke %20 dulu agar decodeURIComponent bisa decode spasi
  const match = search.match(/[?&]player_name=([^&]*)/);
  if(!match) return "";

  try {
    const raw = match[1].replace(/\+/g, '%20');
    return decodeURIComponent(raw).trim();
  } catch(e){
    return match[1].trim();
  }
}

function setPlayerNameInUrl(name){
  // encodeURIComponent encode spasi → %20, & → %26, konsisten di semua browser
  const encoded = encodeURIComponent(name);
  const search  = window.location.search;

  let newSearch;
  if(!search){
    newSearch = '?player_name=' + encoded;
  } else {
    // ganti nilai player_name yang sudah ada, atau tambahkan di akhir
    if(/[?&]player_name=/.test(search)){
      newSearch = search.replace(/([?&]player_name=)[^&]*/, '$1' + encoded);
    } else {
      newSearch = search + '&player_name=' + encoded;
    }
  }

  window.history.replaceState(
    {},
    '',
    window.location.pathname + newSearch + window.location.hash
  );
}

// resolves the player name (from URL or modal), then calls onReady(name)
function initPlayerNameModal(onReady){
  const $modal = $('#player-modal');
  const $form = $('#player-form');
  const $input = $('#player-name-input');

  const urlName = getPlayerNameFromUrl();

  function finish(name){
    currentPlayerName = name;
    $modal.addClass('modal-fade-out');
    setTimeout(() => {
      $modal.addClass('hidden');
      onReady(name);
    }, 350);
  }

  if(urlName){
    // player_name already present in URL: show modal pre-filled,
    // then auto-submit shortly after so it still feels like a confirmation step
    $modal.removeClass('hidden');
    $input.val(urlName);
    $input.prop('disabled', true);
    setTimeout(() => {
      finish(urlName);
    }, 700);
    return;
  }

  // no player_name yet: show empty modal and wait for the user
  $modal.removeClass('hidden');
  setTimeout(() => $input.trigger('focus'), 150);

  $form.on('submit', function(e){
    e.preventDefault();
    const name = $input.val().trim();
    if(!name) {
      $input.trigger('focus');
      return;
    }
    setPlayerNameInUrl(name);
    finish(name);
  });
}

/* =====================================================================
   PHASE 1 — BOOT TERMINAL TYPING SEQUENCE
===================================================================== */
function runBootSequence(){
  const $terminal = $('#boot-terminal');
  const $itemAcquired = $('#item-acquired');
  const bootLines = buildBootLines(currentPlayerName);
  let lineIndex = 0;

  function typeLine(line, callback){
    const $lineEl = $('<div class="boot-line"></div>').appendTo($terminal);
    if(line.cls) $lineEl.addClass(line.cls);
    let charIndex = 0;
    const speed = bootSkipRequested ? 2 : 22;

    function typeChar(){
      if(charIndex <= line.text.length){
        $lineEl.text(line.text.slice(0, charIndex));
        charIndex++;
        setTimeout(typeChar, speed);
      } else {
        // respect a custom hold duration (e.g. player name line lingers longer),
        // but still speed up proportionally if the user requested skip
        const defaultHold = bootSkipRequested ? 30 : 220;
        const hold = line.holdMs
          ? (bootSkipRequested ? Math.min(300, line.holdMs / 4) : line.holdMs)
          : defaultHold;
        setTimeout(callback, hold);
      }
    }
    typeChar();
  }

  function nextLine(){
    if(lineIndex < bootLines.length){
      typeLine(bootLines[lineIndex], () => {
        lineIndex++;
        nextLine();
      });
    } else {
      setTimeout(showItemAcquired, bootSkipRequested ? 100 : 500);
    }
  }

  function showItemAcquired(){
    $terminal.fadeOut(250, () => {
      $itemAcquired.removeClass('hidden');
    });
  }

  nextLine();

  // allow click/tap anywhere to speed up typing
  $('#boot-screen').on('click touchstart', function(){
    bootSkipRequested = true;
  });
}

/* =====================================================================
   PHASE 2 — OPEN SCROLL TRANSITION (boot -> unroll -> main scroll)
===================================================================== */
function openScrollTransition(){
  const $boot = $('#boot-screen');
  const $unrollStage = $('#unroll-stage');
  const $scrollMain = $('#scroll-main');

  playSfx('sfx-confirm');

  // fade out boot screen
  $boot.addClass('boot-fade-out');

  setTimeout(() => {
    $boot.addClass('hidden');
    $unrollStage.removeClass('hidden');
    animateUnroll($unrollStage, () => {
      $unrollStage.addClass('hidden');
      $scrollMain.removeClass('hidden');
      $('html, body').css('overflow', '');
      initScrollAnimations();
      startMusicIfAllowed();
      loadMessages(); // muat ucapan dari ucapan.php begitu scroll terbuka
    });
  }, 850);
}

function animateUnroll($stage, onComplete){
  const fill = $stage.find('.unroll-parchment-fill')[0];
  const rodTop = $stage.find('.unroll-rod-top')[0];
  const rodBottom = $stage.find('.unroll-rod-bottom')[0];
  const flash = $stage.find('.unroll-flash')[0];

  if(typeof gsap === 'undefined'){
    // fallback without GSAP
    $(fill).css({height: '100%'});
    setTimeout(onComplete, 600);
    return;
  }

  const tl = gsap.timeline({
    onComplete: () => {
      setTimeout(onComplete, 200);
    }
  });

  tl.set(fill, { height: 0 })
    .to(fill, {
      height: '100%',
      duration: 1.1,
      ease: 'power2.inOut'
    }, 0)
    .to(rodTop, {
      top: '0%',
      duration: 1.1,
      ease: 'power2.inOut'
    }, 0)
    .to(rodBottom, {
      top: '100%',
      duration: 1.1,
      ease: 'power2.inOut'
    }, 0)
    .to(flash, {
      opacity: 1,
      duration: 0.25,
      ease: 'power1.out'
    }, 0.95)
    .to(flash, {
      opacity: 0,
      duration: 0.55,
      ease: 'power1.in'
    }, 1.2);
}

/* =====================================================================
   POPULATE CONTENT FROM weddingData
===================================================================== */
function populateContent(){
  // opening
  $('#opening-flavor').text(
    `Kami menuliskan catatan perjalanan ini sebagai dua karakter, ${weddingData.groomShort} dan ${weddingData.brideShort} yang akhirnya menemukan akhir cerita yang kami cari sejak awal permainan.`
  );

  // names
  $('#groom-name-display').text(weddingData.groomName);
  $('#bride-name-display').text(weddingData.brideName);

  // quote
  $('#quote-text-display').text(weddingData.quote);

  // story letter
  const $storyLetter = $('#story-letter');
  $storyLetter.empty();
  weddingData.story.forEach(paragraph => {
    $('<p></p>').text(paragraph).appendTo($storyLetter);
  });

  // event info
  $('#event-date-display').text(weddingData.weddingDateDisplay);
  $('#event-time-display').text(weddingData.weddingTimeDisplay);
  $('#event-venue-display').text(weddingData.venue);
  $('#event-address-display').text(weddingData.address);
  $('#map-link-btn').attr('href', weddingData.mapLink);

  // gallery
  const $grid = $('#gallery-grid');
  $grid.empty();
  weddingData.gallery.forEach((item, idx) => {
    const $frame = $(`
      <div class="memory-frame" data-index="${idx}">
        <img src="${item.src}" alt="${item.caption}" loading="lazy"
             onerror="this.closest('.memory-frame').classList.add('memory-frame-fallback')">
        <div class="memory-frame-label">${item.caption}</div>
      </div>
    `);
    $grid.append($frame);
  });

  // gift
  $('#gift-bank-display').text(weddingData.bankName);
  $('#gift-account-display').text(weddingData.accountNumber);
  $('#gift-holder-display').text(weddingData.accountHolder);

  $('#gift-bank-display2').text(weddingData.bankName2);
  $('#gift-account-display2').text(weddingData.accountNumber2);
  $('#gift-holder-display2').text(weddingData.accountHolder2);

  // signature
  $('#signature-names-text').text(weddingData.signatureNames);

  // couple portraits (closing section)
  $('#groom-portrait-img').attr('src', weddingData.groomPortrait);
  $('#bride-portrait-img').attr('src', weddingData.bridePortrait);
  $('#groom-portrait-name').text(weddingData.groomShort || weddingData.groomName);
  $('#bride-portrait-name').text(weddingData.brideShort || weddingData.brideName);

  // page title
  document.title = `${weddingData.groomShort} & ${weddingData.brideShort} — Wedding Invitation`;
}

/* =====================================================================
   SCROLL-DRIVEN ANIMATIONS (GSAP ScrollTrigger)
===================================================================== */
function initScrollAnimations(){
  if(typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined'){
    // graceful fallback: just reveal everything
    $('.chapter, .story-letter p, .ach-row').css({ opacity: 1, transform: 'none' });
    return;
  }
  gsap.registerPlugin(ScrollTrigger);

  // each chapter fades & rises into view
  $('.chapter').each(function(){
    gsap.from(this, {
      opacity: 0,
      y: 36,
      duration: 0.9,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: this,
        start: 'top 82%',
        toggleActions: 'play none none reverse'
      }
    });
  });

  // chapter dividers grow in
  gsap.utils.toArray('.chapter-divider').forEach(div => {
    gsap.from(div, {
      opacity: 0,
      scale: 0.6,
      duration: 0.6,
      ease: 'back.out(2)',
      scrollTrigger: {
        trigger: div,
        start: 'top 90%',
        toggleActions: 'play none none reverse'
      }
    });
  });

  // story letter paragraphs reveal one by one
  gsap.utils.toArray('.story-letter p').forEach((p, i) => {
    gsap.to(p, {
      opacity: 1,
      y: 0,
      duration: 0.7,
      delay: i * 0.12,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: '.story-letter',
        start: 'top 75%',
        toggleActions: 'play none none reverse'
      }
    });
  });

  // achievement rows slide in staggered
  gsap.to('.ach-row', {
    opacity: 1,
    x: 0,
    duration: 0.55,
    stagger: 0.15,
    ease: 'power2.out',
    scrollTrigger: {
      trigger: '.achievement-board',
      start: 'top 85%',
      toggleActions: 'play none none reverse'
    }
  });

  // gallery frames pop in staggered
  gsap.from('.memory-frame', {
    opacity: 0,
    scale: 0.85,
    y: 16,
    duration: 0.5,
    stagger: 0.08,
    ease: 'back.out(1.6)',
    scrollTrigger: {
      trigger: '.gallery-grid',
      start: 'top 85%',
      toggleActions: 'play none none reverse'
    }
  });

  // vine rails grow with scroll progress of whole page
  gsap.to('.vine-rail-left', {
    backgroundPositionY: '600px',
    ease: 'none',
    scrollTrigger: {
      trigger: '.parchment-column',
      start: 'top top',
      end: 'bottom bottom',
      scrub: 0.6
    }
  });
  gsap.to('.vine-rail-right', {
    backgroundPositionY: '-600px',
    ease: 'none',
    scrollTrigger: {
      trigger: '.parchment-column',
      start: 'top top',
      end: 'bottom bottom',
      scrub: 0.6
    }
  });

  // quote box subtle scale-in
  gsap.from('.quote-box', {
    opacity: 0,
    scale: 0.94,
    duration: 0.8,
    ease: 'power2.out',
    scrollTrigger: {
      trigger: '.quote-box',
      start: 'top 80%',
      toggleActions: 'play none none reverse'
    }
  });

  // signature draw-on effect
  initSignatureDraw();
}

/* =====================================================================
   SIGNATURE — animated handwriting using SVG stroke-dashoffset
===================================================================== */
function initSignatureDraw(){
  // simple cursive-like paths approximating two looping signatures
  const path1 = "M10,70 C20,30 40,20 55,55 C65,78 75,40 90,45 C100,48 95,70 110,65 C125,60 130,35 145,40 C158,44 155,68 170,60";
  const path2 = "M210,55 C220,25 235,25 245,50 C252,68 262,40 275,42 C288,44 285,65 298,58 C310,52 312,30 326,35 C338,39 336,60 350,55 C362,51 366,35 380,40";

  const p1 = document.getElementById('signature-path-1');
  const p2 = document.getElementById('signature-path-2');
  if(!p1 || !p2) return;
  p1.setAttribute('d', path1);
  p2.setAttribute('d', path2);

  if(typeof gsap === 'undefined'){
    return;
  }

  [p1, p2].forEach((path, i) => {
    const length = path.getTotalLength();
    gsap.set(path, { strokeDasharray: length, strokeDashoffset: length });
    gsap.to(path, {
      strokeDashoffset: 0,
      duration: 1.6,
      delay: i * 0.5,
      ease: 'power1.inOut',
      scrollTrigger: {
        trigger: '.signature-wrap',
        start: 'top 85%',
        toggleActions: 'play none none reverse'
      }
    });
  });
}

/* =====================================================================
   COUNTDOWN TIMER
===================================================================== */
function initCountdown(){
  const target = new Date(weddingData.weddingDate).getTime();
  const flavorTexts = [
    "Loading XP bar of patience...",
    "Quest timer ticking...",
    "Preparing the final boss: the aisle walk.",
    "Almost there, brave guest!"
  ];
  let flavorIdx = 0;

  function update(){
    const now = Date.now();
    let diff = target - now;
    if(diff < 0) diff = 0;

    const days = Math.floor(diff / (1000*60*60*24));
    const hours = Math.floor((diff / (1000*60*60)) % 24);
    const minutes = Math.floor((diff / (1000*60)) % 60);
    const seconds = Math.floor((diff / 1000) % 60);

    $('#cd-days').text(String(days).padStart(2,'0'));
    $('#cd-hours').text(String(hours).padStart(2,'0'));
    $('#cd-minutes').text(String(minutes).padStart(2,'0'));
    $('#cd-seconds').text(String(seconds).padStart(2,'0'));

    if(diff === 0){
      $('#countdown-flavor').text("THE DAY HAS ARRIVED! ✦");
    }
  }

  update();
  setInterval(update, 1000);

  setInterval(() => {
    flavorIdx = (flavorIdx + 1) % flavorTexts.length;
    if(target - Date.now() > 0){
      $('#countdown-flavor').fadeOut(200, function(){
        $(this).text(flavorTexts[flavorIdx]).fadeIn(200);
      });
    }
  }, 4000);
}

/* =====================================================================
   GALLERY LIGHTBOX
===================================================================== */
function initLightbox(){
  $(document).on('click', '.memory-frame', function(){
    const idx = $(this).data('index');
    const item = weddingData.gallery[idx];
    if(!item) return;

    $('#lightbox-img').attr('src', item.src).attr('alt', item.caption);
    $('#lightbox-caption').text(item.caption);
    $('#lightbox').removeClass('hidden');
    $('body').css('overflow', 'hidden');
    playSfx('sfx-page');
  });

  $(document).on('click', '.portrait-card', function(){
    const url = $(this).data('url');
    const text = $(this).data('caption');
    if(!url) return;

    $('#lightbox-img').attr('src', url).attr('alt', url);
    $('#lightbox-caption').text(text);
    $('#lightbox').removeClass('hidden');
    $('body').css('overflow', 'hidden');
    playSfx('sfx-page');
  });

  function closeLightbox(){
    $('#lightbox').addClass('hidden');
    $('body').css('overflow', '');
  }

  $('#lightbox-close, #lightbox-backdrop').on('click', closeLightbox);
  $(document).on('keydown', function(e){
    if(e.key === 'Escape') closeLightbox();
  });
}

/* =====================================================================
   RSVP FORM
===================================================================== */
function initRsvpForm(){
  let selectedAttendance = null;

  // auto-fill nama dari URL player_name
  const urlName = getPlayerNameFromUrl();
  if(urlName){
    $('#rsvp-name').val(urlName);
  }

  $('.rsvp-option-btn').on('click', function(){
    $('.rsvp-option-btn').removeClass('active');
    $(this).addClass('active');
    selectedAttendance = $(this).data('value');
    playSfx('sfx-confirm');
  });

  $('#rsvp-form').on('submit', function(e){
    e.preventDefault();

    const name       = $('#rsvp-name').val().trim();
    const message    = $('#rsvp-message').val().trim();
    const $submitBtn = $(this).find('.rsvp-submit-btn');

    if(!name){
      $('#rsvp-name').trigger('focus');
      return;
    }
    if(!selectedAttendance){
      $('#rsvp-attendance').css('outline', '2px solid var(--rose)');
      setTimeout(() => $('#rsvp-attendance').css('outline', 'none'), 700);
      return;
    }

    $submitBtn.prop('disabled', true).text('SENDING...');

    $.ajax({
      url: 'ucapan.php',
      method: 'POST',
      contentType: 'application/json',
      data: JSON.stringify({ name, attendance: selectedAttendance, message }),
      success: function(res){
        if(res.status === 'ok'){
          $('#rsvp-success').removeClass('hidden');
          playSfx('sfx-confirm');
          $('#rsvp-form')[0].reset();
          // isi ulang nama setelah reset
          if(urlName) $('#rsvp-name').val(urlName);
          $('.rsvp-option-btn').removeClass('active');
          selectedAttendance = null;
          loadMessages();
          setTimeout(() => $('#rsvp-success').addClass('hidden'), 5000);
        }
      },
      error: function(xhr){
        const res = xhr.responseJSON;
        const msg = (res && res.message) ? res.message : 'Gagal mengirim pesan. Coba lagi.';
        alert(msg);
      },
      complete: function(){
        $submitBtn.prop('disabled', false).html(
          '<span class="pixel-btn-arrow">▶</span> SEND MESSAGE'
        );
      }
    });
  });
}

/* =====================================================================
   LOAD & RENDER UCAPAN dari ucapan.php (GET → ucapan.json)
===================================================================== */
function loadMessages(){
  const $list    = $('#message-list');
  const $count   = $('#message-count');
  const $loading = $('#message-loading');
  const urlName  = getPlayerNameFromUrl(); // nama dari URL untuk cek kepemilikan

  $loading.removeClass('hidden');

  $.ajax({
    url: 'ucapan.php',
    method: 'GET',
    dataType: 'json',
    success: function(res){
      $loading.addClass('hidden');

      if(!res.entries || res.entries.length === 0){
        $list.html('<p class="message-empty">// no messages yet — be the first adventurer to write one.</p>');
        $count.text('');
        return;
      }

      $count.text('(' + res.total + ')');
      $list.empty();

      res.entries.forEach(function(entry, idx){
        const date  = formatMessageDate(entry.created_at);
        const badge = entry.attendance === 'hadir'
          ? '<span class="msg-badge msg-badge-hadir">✦ Hadir</span>'
          : '<span class="msg-badge msg-badge-tidak">✕ Tidak Hadir</span>';
        const msgText = entry.message
          ? '<p class="msg-text">' + escapeHtml(entry.message) + '</p>'
          : '';

        // tampilkan tombol delete hanya jika nama URL cocok dengan nama pengirim
        const isOwner = urlName &&
          urlName.trim().toLowerCase() === entry.name.trim().toLowerCase();
        const deleteBtn = isOwner
          ? `<button class="msg-delete-btn" data-id="${escapeHtml(entry.id)}" title="Hapus ucapan ini">✕</button>`
          : '';

        const $card = $(`
          <div class="msg-card" data-id="${escapeHtml(entry.id)}" style="animation-delay:${idx * 0.06}s">
            <div class="msg-card-header">
              <span class="msg-name">${escapeHtml(entry.name)}</span>
              ${badge}
              ${deleteBtn}
            </div>
            ${msgText}
            <span class="msg-date">${date}</span>
          </div>
        `);
        $list.append($card);
      });
    },
    error: function(){
      $loading.addClass('hidden');
      $list.html('<p class="message-empty">// could not load messages. Make sure ucapan.php is reachable.</p>');
    }
  });
}

/* =====================================================================
   DELETE UCAPAN
===================================================================== */
function deleteMessage(id){
  const urlName = getPlayerNameFromUrl();
  if(!urlName) return;

  $.ajax({
    url: 'ucapan.php',
    method: 'DELETE',
    contentType: 'application/json',
    data: JSON.stringify({ id, player_name: urlName }),
    success: function(res){
      if(res.status === 'ok'){
        // animasi hilang lalu reload
        $(`[data-id="${id}"]`).css({ transition: 'opacity 0.3s', opacity: 0 });
        setTimeout(() => loadMessages(), 320);
        playSfx('sfx-confirm');
      }
    },
    error: function(xhr){
      const res = xhr.responseJSON;
      const msg = (res && res.message) ? res.message : 'Gagal menghapus.';
      alert(msg);
    }
  });
}

// helper: format ISO date menjadi teks pendek ramah
function formatMessageDate(isoString){
  if(!isoString) return '';
  try{
    const d = new Date(isoString);
    const pad = n => String(n).padStart(2,'0');
    return `${pad(d.getDate())}/${pad(d.getMonth()+1)}/${d.getFullYear()} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
  } catch(e){
    return isoString;
  }
}

// helper: escape HTML untuk mencegah XSS saat render teks dari server
function escapeHtml(str){
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

// delegated handler untuk tombol delete di message board
$(document).on('click', '.msg-delete-btn', function(e){
  e.stopPropagation();
  const id = $(this).data('id');
  if(!id) return;
  deleteMessage(id);
});

/* =====================================================================
   GIFT TREASURE CHEST
===================================================================== */
function initGiftChest(){
  $('#treasure-chest').on('click', function(){
    if($(this).hasClass('opened')) return;
    $(this).addClass('opened');
    const useEl = document.querySelector('#chest-svg use');
    if(useEl){
      useEl.setAttribute('href', '#sprite-chest-open');
      useEl.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', '#sprite-chest-open');
    }
    $('#chest-hint').text('// treasure revealed');
    $('.gift-card').removeClass('hidden');
    playSfx('sfx-confirm');
  });

  $('#copy-account-btn').on('click', function(){
    const accountNumber = weddingData.accountNumber;
    copyToClipboard(accountNumber);
    $('#copy-toast').removeClass('hidden');
    playSfx('sfx-confirm');
    setTimeout(() => $('#copy-toast').addClass('hidden'), 2200);
  });

  $('#copy-account-btn2').on('click', function(){
    const accountNumber2 = weddingData.accountNumber2;
    copyToClipboard(accountNumber2);
    $('#copy-toast2').removeClass('hidden');
    playSfx('sfx-confirm');
    setTimeout(() => $('#copy-toast2').addClass('hidden'), 2200);
  });
}

function copyToClipboard(text){
  if(navigator.clipboard && navigator.clipboard.writeText){
    navigator.clipboard.writeText(text).catch(() => {
      fallbackCopy(text);
    });
  } else {
    fallbackCopy(text);
  }
}

function fallbackCopy(text){
  const $temp = $('<textarea>').val(text).appendTo('body').select();
  try { document.execCommand('copy'); } catch(e) { /* no-op */ }
  $temp.remove();
}

/* =====================================================================
   AUDIO
===================================================================== */
function playSfx(id){
  const el = document.getElementById(id);
  if(!el) return;
  try{
    el.currentTime = 0;
    el.volume = 0.5;
    const p = el.play();
    if(p && p.catch) p.catch(() => {});
  } catch(e){ /* asset may be missing — fail silently */ }
}

function startMusicIfAllowed(){
  const music = document.getElementById('bg-music');
  if(!music) return;
  music.volume = 0.35;
  const playPromise = music.play();
  if(playPromise && playPromise.then){
    playPromise.then(() => {
      musicStarted = true;
      $('#music-toggle').addClass('is-playing');
    }).catch(() => {
      // autoplay blocked — wait for user gesture
      musicStarted = false;
    });
  }
}

function initMusicToggle(){
  $('#music-toggle').on('click', function(){
    const music = document.getElementById('bg-music');
    if(!music) return;
    if(music.paused){
      music.play().then(() => {
        musicStarted = true;
        $(this).addClass('is-playing');
      }).catch(() => {});
    } else {
      music.pause();
      musicStarted = false;
      $(this).removeClass('is-playing');
    }
  });
}

/* =====================================================================
   INIT
===================================================================== */
$(function(){
  initBgCanvas();
  populateContent();
  initCountdown();
  initLightbox();
  initRsvpForm();
  initGiftChest();
  initMusicToggle();

  // player name must resolve first (URL or modal) before the boot
  // terminal starts typing, so we can greet the player by name.
  initPlayerNameModal(function(/* name */){
    runBootSequence();
  });

  $(document).on('click', '#open-scroll-btn', function(){
    openScrollTransition();
  });
});


function downloadICS({
    title,
    description,
    location,
    startDate,
    endDate,
    filename = 'wedding-invitation'
}) {

    const formatDate = (date) => {
        return date.toISOString()
            .replace(/[-:]/g, '')
            .split('.')[0] + 'Z';
    };

    const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Wedding Invitation//EN
CALSCALE:GREGORIAN
METHOD:PUBLISH
BEGIN:VEVENT
UID:${Date.now()}@wedding-invitation
DTSTAMP:${formatDate(new Date())}
DTSTART:${formatDate(startDate)}
DTEND:${formatDate(endDate)}
SUMMARY:${title}
DESCRIPTION:${description}
LOCATION:${location}
STATUS:CONFIRMED
SEQUENCE:0
END:VEVENT
END:VCALENDAR`;

    const blob = new Blob(
        [icsContent],
        { type: 'text/calendar;charset=utf-8' }
    );

    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');

    link.href = url;
    link.download = `${filename}.ics`;

    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);

    URL.revokeObjectURL(url);
}

function addToGoogleCalendar() {

    const title = encodeURIComponent(
        'Wedding of Fathur & Sephia'
    );

    const details = encodeURIComponent(
        'Thank you for being part of our journey.'
    );

    const location = encodeURIComponent(
        'Kertosono, Nganjuk, Jawa Timur'
    );

    const start = '20260723T110000Z';
    const end = '20260723T190000Z';

    const url =
        'https://calendar.google.com/calendar/render?action=TEMPLATE' +
        '&text=' + title +
        '&dates=' + start + '/' + end +
        '&details=' + details +
        '&location=' + location;

    window.open(url, '_blank');
}

$('#save-date-btn').click(function () {

    addToGoogleCalendar();

    // downloadICS({
    //     title: 'Wedding of Fathur & Sephia',
    //     description: 'Thank you for being part of our journey.',
    //     location: 'Kertosono, Nganjuk',
    //     startDate: new Date('2026-07-23T11:00:00+07:00'),
    //     endDate: new Date('2026-07-23T19:00:00+07:00'),
    //     filename: 'Fathur-Sephia-Wedding'
    // });

});