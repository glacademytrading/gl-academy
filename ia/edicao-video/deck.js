/* ==========================================================================
   GL Hub Academy · motor dos decks

   Navegação: → / espaço / PageDown avança · ← / PageUp volta · Home / End
   M ou I = índice de slides · F = tela cheia · N = notas (fala)
   P = janela do apresentador · G = modo gravação · H = esconde a moldura
   URL: aula-1.html#3 abre direto no slide 3

   Marcações nos slides:
   - data-title="..."                    nome do slide no índice
   - data-step="1" (em qualquer elemento) aparece no clique 1, 2, 3...
   - data-leave="2"                      some a partir do clique 2
   - data-step-class="1:marcado,2:limpo" (no slide) aplica classes por clique
   - data-count="11:09" data-from="25:48" anima o número ao entrar no slide
   - <aside class="notes">               a fala do slide (tecla N / P)
   - .photo-slot data-photo / data-video  espaço reservado para foto ou vídeo
   ========================================================================== */

(function () {
    const body = document.body;
    const slides = Array.from(document.querySelectorAll('.slide'));
    const total = slides.length;
    const pad = (n) => String(n).padStart(2, '0');

    const course = 'Edição de vídeo com o <b>Claude Code</b>';
    const lesson = body.dataset.lesson || '';
    const title = body.dataset.title || '';
    const prevHref = body.dataset.prev || '';
    const nextHref = body.dataset.next || '';

    // ---------------------------------------------------------------- moldura
    const topbar = document.createElement('header');
    topbar.className = 'topbar';
    topbar.innerHTML = `
        <a class="wordmark" href="index.html#1" aria-label="GL Hub Academy">
            <img class="wm-crest" src="brand/gl-crest-96.png" alt="">
            <span class="wm-gl">GL</span>
            <span class="wm-sep"></span>
            <span class="wm-stack"><span class="wm-hub">HUB</span><span class="wm-academy">ACADEMY</span></span>
        </a>
        <div class="topbar-course">${course}</div>
        <div class="topbar-actions">
            <button class="icon-btn" data-act="toc" title="Índice (M)">☰ <span class="label">Slides</span></button>
            <button class="icon-btn" data-act="notes" title="Notas da fala (N)">✎ <span class="label">Notas</span></button>
            <button class="icon-btn" data-act="fs" title="Tela cheia (F)">⛶</button>
        </div>`;
    body.prepend(topbar);

    const bottombar = document.createElement('footer');
    bottombar.className = 'bottombar';
    bottombar.innerHTML = `
        <div class="bottom-label">${lesson ? `<b>${lesson}</b>` : ''}${title}</div>
        <div class="progress"><div class="progress-fill"></div></div>
        <div class="bottom-right">
            <div class="counter"><b class="cur">01</b> / ${pad(total)}</div>
            <div class="nav-btns">
                <button class="icon-btn" data-act="prev" aria-label="Anterior">‹</button>
                <button class="icon-btn" data-act="next" aria-label="Próximo">›</button>
            </div>
        </div>`;
    body.append(bottombar);

    const toc = document.createElement('div');
    toc.className = 'toc';
    toc.innerHTML = `
        <button class="icon-btn toc-close" data-act="toc">✕ Fechar</button>
        <div class="toc-grid">${slides.map((s, i) => `
            <button class="toc-item" data-go="${i + 1}"><span>${pad(i + 1)}</span>${s.dataset.title || 'Slide ' + (i + 1)}</button>`).join('')}
        </div>`;
    body.append(toc);

    const notesPanel = document.createElement('div');
    notesPanel.className = 'notes-panel';
    body.append(notesPanel);

    const fill = bottombar.querySelector('.progress-fill');
    const cur = bottombar.querySelector('.cur');

    // ---------------------------------------------------------------- passos dentro do slide
    const maxStep = (s) => Math.max(+s.dataset.steps || 0, ...Array.from(s.querySelectorAll('[data-step]'), (el) => +el.dataset.step || 0));

    function applyStep(s, step) {
        s.querySelectorAll('[data-step]').forEach((el) => {
            const shown = step >= +el.dataset.step;
            const left = el.dataset.leave && step >= +el.dataset.leave;
            el.classList.toggle('step-on', shown && !left);
            el.classList.toggle('step-gone', !!left);
        });
        for (let k = 1; k <= 9; k++) s.classList.toggle('s' + k, step >= k && k <= maxStep(s));
        const map = (s.dataset.stepClass || '').split(',').filter(Boolean).map((p) => p.split(':'));
        map.forEach(([n, cls]) => s.classList.toggle(cls.trim(), step >= +n));
        s.querySelectorAll('[data-step]').forEach((el) => {
            if (el.classList.contains('step-on')) runCounters(el);
        });
    }

    // ---------------------------------------------------------------- contadores
    function parseCount(v) {
        if (v.includes(':')) {
            const [m, s] = v.split(':').map(Number);
            return { value: m * 60 + s, fmt: (x) => `${Math.floor(x / 60)}:${pad(Math.round(x) % 60)}` };
        }
        const thousands = /\.\d{3}$/.test(v);
        const n = Number(v.replace(/\./g, '').replace(',', '.'));
        return { value: n, fmt: (x) => (thousands ? Math.round(x).toLocaleString('pt-BR') : String(Math.round(x))) };
    }

    function runCounters(scope) {
        scope.querySelectorAll('[data-count]').forEach((el) => {
            if (!/\d/.test(el.dataset.count)) return;
            const to = parseCount(el.dataset.count);
            const from = parseCount(el.dataset.from || (el.dataset.count.includes(':') ? '0:00' : '0'));
            const dur = (+el.dataset.dur || 1.6) * 1000;
            const t0 = performance.now();
            const tick = (t) => {
                const k = Math.min(1, (t - t0) / dur);
                const e = 1 - Math.pow(1 - k, 3);
                el.textContent = to.fmt(from.value + (to.value - from.value) * e);
                if (k < 1) requestAnimationFrame(tick);
                else el.textContent = el.dataset.count;
            };
            requestAnimationFrame(tick);
        });
    }

    // ---------------------------------------------------------------- placar dos checklists
    function updateScores(s) {
        s.querySelectorAll('.score').forEach((sc) => {
            const n = s.querySelectorAll('.check.req.ok').length;
            const of = s.querySelectorAll('.check.req').length;
            sc.querySelector('b').textContent = n;
            sc.classList.toggle('full', n === of);
        });
    }

    // índices das linhas animadas (--i) e total (--n)
    document.querySelectorAll('.panel').forEach((p) => {
        const rows = p.querySelectorAll('.p-row');
        rows.forEach((r, i) => r.style.setProperty('--i', i));
        p.style.setProperty('--n', rows.length);
    });

    // ---------------------------------------------------------------- navegação
    let index = -1;
    let step = 0;

    function readHash() {
        const n = parseInt(location.hash.replace('#', ''), 10);
        return Number.isFinite(n) ? Math.min(Math.max(n, 1), total) - 1 : 0;
    }

    function go(i, atStep = 0) {
        if (i < 0 || i >= total) return;
        const changed = i !== index;
        slides.forEach((s, k) => {
            s.classList.toggle('is-active', k === i);
            s.classList.toggle('is-prev', k < i);
        });
        const s = slides[i];
        if (changed) {
            s.scrollTop = 0;
            runCounters(s);
            slides.forEach((o) => o !== s && o.querySelectorAll('video').forEach((v) => v.pause()));
            s.querySelectorAll('video[data-auto]').forEach((v) => v.play().catch(() => {}));
        }
        index = i;
        step = atStep;
        applyStep(s, step);
        cur.textContent = pad(i + 1);
        fill.style.width = ((i + 1) / total) * 100 + '%';
        toc.querySelectorAll('.toc-item').forEach((t, k) => t.classList.toggle('is-current', k === i));
        if (readHash() !== i || !location.hash) history.replaceState(null, '', '#' + (i + 1));
        renderNotes();
    }

    function next() {
        if (step < maxStep(slides[index])) go(index, step + 1);
        else if (index < total - 1) go(index + 1);
        else if (nextHref) location.href = nextHref;
    }

    function prev() {
        if (step > 0) go(index, step - 1);
        else if (index > 0) go(index - 1, maxStep(slides[index - 1]));
        else if (prevHref) location.href = prevHref;
    }

    const toggleToc = (force) => toc.classList.toggle('is-open', force);

    function toggleFullscreen() {
        if (!document.fullscreenElement) document.documentElement.requestFullscreen?.();
        else document.exitFullscreen?.();
    }

    // ---------------------------------------------------------------- notas e apresentador
    let presenter = null;
    const notesOf = (i) => slides[i]?.querySelector('.notes')?.innerHTML || '<i>Sem notas neste slide.</i>';

    function renderNotes() {
        notesPanel.innerHTML = `<div class="notes-head">Fala · slide ${pad(index + 1)}</div>${notesOf(index)}`;
        if (presenter && !presenter.closed) {
            const d = presenter.document;
            d.getElementById('p-cur').textContent = `${pad(index + 1)} / ${pad(total)} · ${slides[index].dataset.title || ''}`;
            d.getElementById('p-step').textContent = maxStep(slides[index]) ? `clique ${step} de ${maxStep(slides[index])}` : '';
            d.getElementById('p-notes').innerHTML = notesOf(index);
            d.getElementById('p-next').textContent = slides[index + 1] ? `Próximo: ${slides[index + 1].dataset.title || ''}` : (nextHref ? 'Próximo: próxima aula' : 'Fim');
        }
    }

    function openPresenter() {
        presenter = window.open('', 'gl-apresentador', 'width=760,height=640');
        if (!presenter) return;
        const d = presenter.document;
        d.open();
        d.write(`<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><title>Apresentador · ${lesson}</title>
            <style>
                body{margin:0;padding:28px;background:#0a0907;color:#f5f1e8;font:18px/1.6 Inter,system-ui,sans-serif}
                .top{display:flex;justify-content:space-between;font:500 13px ui-monospace,monospace;letter-spacing:.12em;color:#d4af37;text-transform:uppercase}
                #p-notes{margin-top:22px;font-size:22px;line-height:1.6}
                #p-notes b{color:#d4af37}
                #p-next{margin-top:26px;padding-top:16px;border-top:1px solid #3a3122;color:#a8a195;font-size:15px}
                #p-clock{font:600 28px ui-monospace,monospace;color:#f1d88a}
                button{background:#1d1810;color:#f5f1e8;border:1px solid #5a4a26;border-radius:10px;padding:10px 18px;font-size:15px;cursor:pointer;margin-right:8px}
            </style></head><body>
            <div class="top"><span id="p-cur"></span><span id="p-step"></span></div>
            <div style="display:flex;justify-content:space-between;align-items:center;margin-top:14px">
                <div><button id="p-prev">‹ Voltar</button><button id="p-go">Avançar ›</button></div>
                <span id="p-clock">00:00</span>
            </div>
            <div id="p-notes"></div><div id="p-next"></div></body></html>`);
        d.close();
        d.getElementById('p-prev').onclick = prev;
        d.getElementById('p-go').onclick = next;
        d.addEventListener('keydown', onKey);
        const t0 = Date.now();
        const clock = setInterval(() => {
            if (presenter.closed) return clearInterval(clock);
            const s = Math.floor((Date.now() - t0) / 1000);
            d.getElementById('p-clock').textContent = `${pad(Math.floor(s / 60))}:${pad(s % 60)}`;
        }, 1000);
        renderNotes();
    }

    // ---------------------------------------------------------------- eventos
    document.addEventListener('click', (e) => {
        const act = e.target.closest('[data-act]');
        if (act) {
            const a = act.dataset.act;
            if (a === 'next') next();
            if (a === 'prev') prev();
            if (a === 'toc') toggleToc();
            if (a === 'fs') toggleFullscreen();
            if (a === 'notes') body.classList.toggle('show-notes');
            return;
        }
        const chk = e.target.closest('.check.toggle');
        if (chk) {
            chk.classList.toggle('ok');
            updateScores(chk.closest('.slide'));
            return;
        }
        if (e.target.closest('[data-advance]')) { next(); return; }
        const goto = e.target.closest('[data-go]');
        if (goto) {
            toggleToc(false);
            go(parseInt(goto.dataset.go, 10) - 1);
        }
    });

    function onKey(e) {
        if (e.target.closest && e.target.closest('input, textarea, [contenteditable]')) return;
        if (e.metaKey || e.ctrlKey || e.altKey) return;
        switch (e.key) {
            case 'ArrowRight': case 'PageDown': case ' ': e.preventDefault(); next(); break;
            case 'ArrowLeft': case 'PageUp': e.preventDefault(); prev(); break;
            case 'Home': go(0); break;
            case 'End': go(total - 1); break;
            case 'm': case 'M': case 'i': case 'I': toggleToc(); break;
            case 'f': case 'F': toggleFullscreen(); break;
            case 'n': case 'N': body.classList.toggle('show-notes'); break;
            case 'p': case 'P': openPresenter(); break;
            case 'h': case 'H': body.classList.toggle('no-chrome'); break;
            case 'g': case 'G':
                body.classList.toggle('rec-mode');
                body.classList.toggle('no-chrome', body.classList.contains('rec-mode'));
                break;
            case 'Escape': toggleToc(false); body.classList.remove('show-notes'); break;
        }
    }

    document.addEventListener('keydown', onKey);

    // swipe no celular
    let touchX = null, touchY = null;
    document.addEventListener('touchstart', (e) => {
        touchX = e.touches[0].clientX;
        touchY = e.touches[0].clientY;
    }, { passive: true });
    document.addEventListener('touchend', (e) => {
        if (touchX === null) return;
        const dx = e.changedTouches[0].clientX - touchX;
        const dy = e.changedTouches[0].clientY - touchY;
        if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy) * 1.5) (dx < 0 ? next : prev)();
        touchX = touchY = null;
    }, { passive: true });

    window.addEventListener('hashchange', () => {
        if (readHash() !== index) go(readHash());
    });

    // modo gravação: o cursor some quando fica parado
    let idleTimer;
    document.addEventListener('mousemove', () => {
        body.classList.remove('idle');
        clearTimeout(idleTimer);
        idleTimer = setTimeout(() => body.classList.add('idle'), 1500);
    });

    // ---------------------------------------------------------------- slots de foto e vídeo
    // <figure class="photo-slot" data-photo="fotos/x.jpg" data-video="videos/x.mp4" data-label="...">
    // Se o arquivo existir, ele aparece; senão fica o espaço reservado com o nome do arquivo.
    document.querySelectorAll('.photo-slot').forEach((slot) => {
        const photo = slot.dataset.photo;
        const video = slot.dataset.video;
        const label = slot.dataset.label || 'Adicionar foto';
        slot.insertAdjacentHTML('beforeend', `
            <div class="ph">
                <div class="ph-icon">＋</div>
                <div class="ph-label">${label}</div>
                ${[video, photo].filter(Boolean).map((f) => `<div class="ph-file">${f}</div>`).join('')}
            </div>`);
        if (photo) {
            const img = new Image();
            img.alt = label;
            img.onload = () => { if (!slot.querySelector('video.ready')) { slot.prepend(img); slot.classList.add('has-photo'); } };
            img.src = photo;
        }
        if (video) {
            const v = document.createElement('video');
            Object.assign(v, { muted: true, loop: true, playsInline: true, preload: 'metadata' });
            v.dataset.auto = '';
            if (photo) v.poster = photo;
            v.addEventListener('loadeddata', () => {
                v.classList.add('ready');
                slot.querySelector('img')?.remove();
                slot.prepend(v);
                slot.classList.add('has-photo', 'has-video');
                if (slot.closest('.slide')?.classList.contains('is-active')) v.play().catch(() => {});
            }, { once: true });
            // clique no vídeo: liga o som / pausa
            slot.addEventListener('click', (e) => {
                if (!v.classList.contains('ready')) return;
                e.stopPropagation();
                if (v.muted) { v.muted = false; v.currentTime = 0; v.play(); }
                else if (v.paused) v.play();
                else v.pause();
            });
            v.src = video;
        }
    });

    // ---------------------------------------------------------------- copiar código / prompt
    document.querySelectorAll('.code, .prompt').forEach((block) => {
        const pre = block.querySelector('pre');
        if (!pre) return;
        const btn = document.createElement('button');
        btn.className = 'copy-btn';
        btn.textContent = 'Copiar';
        btn.addEventListener('click', async (e) => {
            e.stopPropagation();
            try {
                await navigator.clipboard.writeText(pre.innerText.trim());
                btn.textContent = 'Copiado ✓';
            } catch {
                btn.textContent = 'Selecione e copie';
            }
            setTimeout(() => (btn.textContent = 'Copiar'), 1600);
        });
        block.append(btn);
    });

    go(readHash());
})();
