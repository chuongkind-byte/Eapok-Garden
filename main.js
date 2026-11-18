(function(){
  // Mobile menu
  var menuBtn = document.getElementById('menuBtn');
  var navLinks = document.getElementById('navLinks');
  menuBtn.addEventListener('click', function(){
    var open = navLinks.classList.toggle('open');
    menuBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
  });
  navLinks.addEventListener('click', function(e){
    if(e.target.tagName === 'A'){ navLinks.classList.remove('open'); menuBtn.setAttribute('aria-expanded','false'); }
  });

  // Lightbox — collects all zoomable images
  var lb = document.getElementById('lightbox');
  var lbImg = document.getElementById('lbImg');
  var lbCap = document.getElementById('lbCap');
  var currentList = [], currentIdx = 0;

  function openLb(list, idx){
    currentList = list; currentIdx = idx;
    renderLb(); lb.classList.add('open'); document.body.style.overflow = 'hidden';
  }
  function renderLb(){
    var item = currentList[currentIdx];
    lbImg.src = item.src; lbImg.alt = item.alt || item.caption;
    lbCap.textContent = item.caption + '  ·  ' + (currentIdx+1) + ' / ' + currentList.length;
  }
  function closeLb(){ lb.classList.remove('open'); document.body.style.overflow = ''; }
  function step(d){ currentIdx = (currentIdx + d + currentList.length) % currentList.length; renderLb(); }
  document.getElementById('lbClose').addEventListener('click', closeLb);
  document.getElementById('lbPrev').addEventListener('click', function(){ step(-1); });
  document.getElementById('lbNext').addEventListener('click', function(){ step(1); });
  lb.addEventListener('click', function(e){ if(e.target === lb) closeLb(); });
  document.addEventListener('keydown', function(e){
    if(!lb.classList.contains('open')) return;
    if(e.key === 'Escape') closeLb();
    if(e.key === 'ArrowLeft') step(-1);
    if(e.key === 'ArrowRight') step(1);
  });

  // Gallery images -> lightbox (visible ones only)
  var figures = Array.prototype.slice.call(document.querySelectorAll('#gallery figure'));
  figures.forEach(function(fig){
    fig.setAttribute('tabindex', '0');
    fig.setAttribute('role', 'button');
    fig.setAttribute('aria-label', 'Xem ảnh lớn: ' + (fig.getAttribute('data-caption') || ''));
    fig.addEventListener('keydown', function(e){
      if(e.key === 'Enter' || e.key === ' '){ e.preventDefault(); fig.click(); }
    });
    fig.addEventListener('click', function(){
      var visible = figures.filter(function(f){ return !f.classList.contains('hidden'); });
      var list = visible.map(function(f){
        var im = f.querySelector('img');
        return { src: im.getAttribute('src'), alt: im.getAttribute('alt'), caption: f.getAttribute('data-caption') || '' };
      });
      openLb(list, visible.indexOf(fig));
    });
  });

  // Room main photos -> lightbox per room
  document.querySelectorAll('.room').forEach(function(room){
    var main = room.querySelector('.js-room-main');
    main.setAttribute('tabindex', '0');
    main.setAttribute('role', 'button');
    main.setAttribute('aria-label', 'Xem ảnh lớn: ' + (main.getAttribute('data-caption') || main.alt));
    main.addEventListener('keydown', function(e){
      if(e.key === 'Enter' || e.key === ' '){ e.preventDefault(); main.click(); }
    });
    main.addEventListener('click', function(){
      var thumbs = Array.prototype.slice.call(room.querySelectorAll('.room-thumbs button'));
      var list;
      if(thumbs.length){
        list = thumbs.map(function(b){ return { src: b.getAttribute('data-src'), alt: b.getAttribute('data-caption'), caption: b.getAttribute('data-caption') }; });
        var idx = list.findIndex(function(it){ return it.src === main.getAttribute('src'); });
        openLb(list, idx < 0 ? 0 : idx);
      } else {
        openLb([{ src: main.getAttribute('src'), alt: main.getAttribute('alt'), caption: main.getAttribute('data-caption') || '' }], 0);
      }
    });
    // Thumbnail switching
    room.querySelectorAll('.room-thumbs button').forEach(function(btn){
      btn.addEventListener('click', function(){
        main.src = btn.getAttribute('data-src');
        main.setAttribute('data-caption', btn.getAttribute('data-caption'));
        main.alt = btn.getAttribute('data-caption');
        room.querySelectorAll('.room-thumbs button').forEach(function(b){ b.classList.remove('active'); });
        btn.classList.add('active');
      });
    });
  });

  // Gallery filter
  document.querySelectorAll('.filter-row button').forEach(function(btn){
    btn.addEventListener('click', function(){
      document.querySelectorAll('.filter-row button').forEach(function(b){ b.classList.remove('active'); });
      btn.classList.add('active');
      var f = btn.getAttribute('data-filter');
      figures.forEach(function(fig){
        fig.classList.toggle('hidden', f !== 'all' && fig.getAttribute('data-cat') !== f);
      });
    });
  });

  // "Đặt phòng này" buttons preselect room type
  document.querySelectorAll('.js-book').forEach(function(a){
    a.addEventListener('click', function(){
      var sel = document.getElementById('fRoom');
      var target = a.getAttribute('data-room');
      for(var i = 0; i < sel.options.length; i++){
        if(sel.options[i].text === target){ sel.selectedIndex = i; break; }
      }
    });
  });

  // Booking form -> compose request text
  var form = document.getElementById('bookForm');
  function fmtDate(v){
    if(!v) return 'Chưa chọn';
    var p = v.split('-'); return p[2] + '/' + p[1] + '/' + p[0];
  }
  form.addEventListener('submit', function(e){
    e.preventDefault();
    var name = document.getElementById('fName').value.trim();
    var phone = document.getElementById('fPhone').value.trim();
    if(!name || !phone){
      document.getElementById('bookResult').classList.remove('show');
      (name ? document.getElementById('fPhone') : document.getElementById('fName')).focus();
      return;
    }
    var lines = [
      'YÊU CẦU ĐẶT PHÒNG — EAPOK GARDEN',
      'Họ tên: ' + name,
      'Số điện thoại: ' + phone,
      'Ngày nhận phòng: ' + fmtDate(document.getElementById('fIn').value),
      'Ngày trả phòng: ' + fmtDate(document.getElementById('fOut').value),
      'Loại phòng: ' + document.getElementById('fRoom').value,
      'Số khách: ' + (document.getElementById('fGuests').value.trim() || 'Chưa rõ')
    ];
    var note = document.getElementById('fNote').value.trim();
    if(note) lines.push('Ghi chú: ' + note);
    lines.push('Đây là yêu cầu đặt phòng gửi từ website — mong nhân viên Eapok Garden liên hệ lại qua số điện thoại trên để xác nhận. Cảm ơn!');
    document.getElementById('bookText').textContent = lines.join('\n');
    document.getElementById('bookResult').classList.add('show');
    document.getElementById('copyMsg').textContent = '';
    document.getElementById('bookResult').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  });
  form.addEventListener('reset', function(){
    setTimeout(function(){ document.getElementById('bookResult').classList.remove('show'); }, 0);
  });
  document.getElementById('copyBtn').addEventListener('click', function(){
    var text = document.getElementById('bookText').textContent;
    var msg = document.getElementById('copyMsg');
    function done(){ msg.textContent = 'Đã sao chép ✓'; }
    if(navigator.clipboard && navigator.clipboard.writeText){
      navigator.clipboard.writeText(text).then(done, function(){ fallback(); });
    } else { fallback(); }
    function fallback(){
      var ta = document.createElement('textarea');
      ta.value = text; document.body.appendChild(ta); ta.select();
      try { document.execCommand('copy'); done(); } catch(err){ msg.textContent = 'Hãy bôi đen và sao chép thủ công'; }
      document.body.removeChild(ta);
    }
  });
  // Price calculator — pure JS, prices exactly per the published table (VND)
  var PRICES = {
    don:      { label: "Phòng đơn", cap: 2, std: 2, p: { h1: 79000, h2: 129000, h3: 179000, night: 350000, day: 500000 } },
    view:     { label: "Phòng view cánh đồng", cap: 4, std: 2, p: { h1: 99000, h2: 159000, h3: 219000, night: 550000, day: 800000 } },
    bungalow: { label: "Bungalow", cap: 6, std: 4, p: { h1: 119000, h2: 199000, h3: 279000, night: 750000, day: 999000 } },
    master:   { label: "Phòng Master", cap: 6, std: 4, p: { h1: 150000, h2: 250000, h3: 350000, night: 999000, day: 1499000 } }
  };
  var DURS = { h1: "1 giờ", h2: "2 giờ", h3: "3 giờ", night: "Qua đêm (22h – 10h hôm sau)", day: "1 ngày (14h – 12h hôm sau)" };
  function fmtVND(n){ return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ".") + "đ"; }
  var calcForm = document.getElementById("calcForm");
  if(calcForm){
    calcForm.addEventListener("submit", function(e){
      e.preventDefault();
      var rk = document.getElementById("cRoom").value;
      var dk = document.getElementById("cDur").value;
      var room = PRICES[rk];
      var guests = parseInt(document.getElementById("cGuests").value, 10);
      if(!guests || guests < 1) guests = room.std;
      var base = room.p[dk];
      var poolFree = (dk === "night" || dk === "day") && (rk === "bungalow" || rk === "master");
      var pool = poolFree ? 0 : 30000 * guests;
      var lines = [
        room.label + " · " + DURS[dk] + ": " + fmtVND(base),
        poolFree ? "Vé bơi: Miễn phí (ưu đãi qua đêm / 1 ngày tại " + room.label + ")" : "Vé bơi: 30.000đ × " + guests + " người = " + fmtVND(pool)
      ];
      document.getElementById("calcTotal").textContent = "Tổng ước tính: " + fmtVND(base + pool);
      var ul = document.getElementById("calcLines");
      ul.innerHTML = "";
      lines.forEach(function(t){ var li = document.createElement("li"); li.textContent = t; ul.appendChild(li); });
      var warn = document.getElementById("calcWarn");
      if(guests > room.cap){
        warn.style.display = "block";
        warn.textContent = "Lưu ý: " + room.label + " có sức chứa tiêu chuẩn " + room.cap + " người. Có thể thêm nệm (phòng lớn ở tới 8 người) — vui lòng gọi hotline 0356 486 852 để được tư vấn.";
      } else { warn.style.display = "none"; }
      document.getElementById("calcOut").classList.add("show");
    });
  }
})();
