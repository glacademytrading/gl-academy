let currentStep = 1;
const totalSteps = 9;
const leadData = {};

// RASTREAMENTO DE ANÚNCIOS (preencha os IDs para ativar; vazio = desligado)
const TRACKING = {
    META_PIXEL_ID: '', // ex: '123456789012345'
    GA4_ID: ''         // ex: 'G-XXXXXXXXXX'
};

// ATRIBUIÇÃO: DE QUAL PILAR DE MARKETING VEIO O LEAD
// Convenção: utm_medium = pilar. Ex: ?utm_source=instagram&utm_medium=conteudo&utm_campaign=q4-2026
const PILARES = {
    conteudo: 'Conteúdo', organico: 'Conteúdo', social: 'Conteúdo', bio: 'Conteúdo',
    pago: 'Tráfego pago', cpc: 'Tráfego pago', paid: 'Tráfego pago', ads: 'Tráfego pago',
    influenciador: 'Divulgação', afiliado: 'Divulgação',
    imprensa: 'Imprensa', press: 'Imprensa',
    rp: 'Relações públicas', comunidade: 'Relações públicas', parceria: 'Relações públicas',
    evento: 'Relações públicas', indicacao: 'Relações públicas',
    vendas: 'Vendas', prospeccao: 'Vendas'
};
const ATTR_PARAMS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'ref'];
const ATTR_WINDOW_DAYS = 30;

// O acesso ao storage fica dentro do try: com cookies bloqueados até ler window.localStorage lança erro
function readStore(storageName, key) {
    try { return JSON.parse(window[storageName].getItem(key)); } catch (e) { return null; }
}

function writeStore(storageName, key, value) {
    try { window[storageName].setItem(key, JSON.stringify(value)); } catch (e) { /* navegação privada */ }
}

function normalize(text) {
    return (text || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').trim();
}

function derivePilar(touch) {
    const medium = normalize(touch.utm_medium);
    if (PILARES[medium]) return PILARES[medium];
    if (medium) return `Outro (${touch.utm_medium})`;
    if (touch.ref) return 'Relações públicas';
    if (/instagram|youtube|youtu\.be|tiktok|linkedin|tradingview|linktr\.ee|google|bing/.test(touch.referrer)) return 'Conteúdo';
    return 'Não identificado';
}

function captureAttribution() {
    const params = new URLSearchParams(window.location.search);
    const touch = { date: new Date().toISOString(), referrer: '' };
    ATTR_PARAMS.forEach(p => {
        const value = params.get(p);
        if (value) touch[p] = value.trim().slice(0, 120);
    });
    try {
        const host = document.referrer ? new URL(document.referrer).hostname : '';
        if (host !== window.location.hostname) touch.referrer = host;
    } catch (e) { /* referrer inválido */ }

    // Primeiro contato nunca é sobrescrito; último contato vale por 30 dias
    const isNewTouch = ATTR_PARAMS.some(p => touch[p]) || touch.referrer;
    if (!readStore('localStorage', 'gl_first_touch')) writeStore('localStorage', 'gl_first_touch', touch);
    let active = touch;
    if (isNewTouch) {
        writeStore('localStorage', 'gl_last_touch', touch);
    } else {
        const last = readStore('localStorage', 'gl_last_touch');
        const ageDays = last ? (Date.now() - new Date(last.date).getTime()) / 86400000 : Infinity;
        if (ageDays <= ATTR_WINDOW_DAYS) active = last;
    }
    active.pilar = derivePilar(active);

    const first = readStore('localStorage', 'gl_first_touch') || touch;
    active.firstTouch = `${derivePilar(first)} | ${first.utm_source || first.referrer || 'direto'} | ${(first.date || '').slice(0, 10)}`;
    return active;
}

const attribution = captureAttribution();

// ID ÚNICO DO LEAD: agrupa os e-mails parciais da mesma pessoa e vira o código de indicação
function getLeadId() {
    const saved = readStore('sessionStorage', 'gl_lead_id');
    if (saved) return saved;
    const id = `GL-${Date.now().toString(36).slice(-4)}${Math.random().toString(36).slice(2, 5)}`.toUpperCase();
    writeStore('sessionStorage', 'gl_lead_id', id);
    return id;
}

leadData.lead_id = getLeadId();

// PRIORIDADE PARA O VENDEDOR TÉCNICO (A = contatar primeiro, C = nutrir com conteúdo)
const SCORE = {
    experience: { 'Menos de 6 meses': 0, '6 meses a 1 ano': 1, '1 a 3 anos': 2, 'Mais de 3 anos': 2 },
    capital: { 'Menos de R$ 3.000': 0, 'R$ 3.000-R$ 5.000': 1, 'R$ 5.000-R$ 20.000': 2, 'R$ 20.000-R$ 50.000': 3, 'Acima de R$ 50.000': 3 },
    goal: { 'Já vivo de trading': 1 }
};

function qualifyLead() {
    if (!leadData.experience) return { tier: 'Novo', label: 'Em qualificação' };
    const score = (SCORE.experience[leadData.experience] || 0)
        + (SCORE.capital[leadData.capital] || 0)
        + (SCORE.goal[leadData.goal] || 0)
        + (leadData.appointment_time ? 2 : 0);
    const tier = score >= 5 ? 'A' : score >= 3 ? 'B' : 'C';
    return { tier, label: `${tier} (${score} de 8 pts)` };
}

function loadTracking() {
    if (TRACKING.META_PIXEL_ID) {
        !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
        n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
        n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
        t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,
        document,'script','https://connect.facebook.net/en_US/fbevents.js');
        fbq('init', TRACKING.META_PIXEL_ID);
        fbq('track', 'PageView');
    }
    if (TRACKING.GA4_ID) {
        const tag = document.createElement('script');
        tag.async = true;
        tag.src = `https://www.googletagmanager.com/gtag/js?id=${TRACKING.GA4_ID}`;
        document.head.appendChild(tag);
        window.dataLayer = window.dataLayer || [];
        window.gtag = function () { dataLayer.push(arguments); };
        gtag('js', new Date());
        gtag('config', TRACKING.GA4_ID);
    }
}

// Eventos: Lead (dados enviados), Schedule (call agendada), QuizStep (etapa vista)
const GA4_EVENTS = { Lead: 'generate_lead', Schedule: 'agendamento_call', QuizStep: 'quiz_etapa' };

function trackEvent(name, params = {}) {
    if (window.fbq && name !== 'QuizStep') fbq('track', name);
    if (window.gtag) gtag('event', GA4_EVENTS[name], { pilar: attribution.pilar, ...params });
}

function updateProgress() {
    const pct = ((currentStep - 1) / (totalSteps - 1)) * 100;
    document.getElementById('progressBar').style.width = pct + '%';
}

function showStep(step) {
    document.querySelectorAll('.step').forEach(s => s.classList.remove('active'));
    document.getElementById(`step${step}`).classList.add('active');
    
    const btnBack = document.getElementById('btnBack');
    if (step > 1 && step < totalSteps) {
        btnBack.style.display = 'block';
    } else {
        btnBack.style.display = 'none';
    }

    updateProgress();
    window.scrollTo(0, 0);
    trackEvent('QuizStep', { etapa: step });
}

function nextStep() {
    if (currentStep < totalSteps) {
        currentStep++;
        showStep(currentStep);
    }
}

function prevStep() {
    if (currentStep > 1) {
        currentStep--;
        showStep(currentStep);
    }
}

const whatsappInput = document.getElementById('whatsapp');
whatsappInput.addEventListener('input', (e) => {
    let x = e.target.value.replace(/\D/g, '').match(/(\d{0,2})(\d{0,5})(\d{0,4})/);
    e.target.value = !x[2] ? x[1] : '(' + x[1] + ') ' + x[2] + (x[3] ? '-' + x[3] : '');
});

// ENVIO REAL DE LEADS POR E-MAIL (FORMSUBMIT)
function notifyLead(status = "Parcial") {
    const qualification = qualifyLead();
    fetch("https://formsubmit.co/ajax/glacademytrading@glacademytrading.com", {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify({
            _subject: `NOVO LEAD GL ACADEMY - ${leadData.name || 'Contato Inicial'} (${status}) · ${qualification.tier} · ${attribution.pilar} · ${leadData.lead_id}`,
            LeadID: leadData.lead_id,
            Nome: leadData.name,
            Email: leadData.email,
            WhatsApp: leadData.whatsapp,
            Experiencia: leadData.experience || 'Não preenchido',
            Desafio: leadData.challenge || 'Não preenchido',
            Capital: leadData.capital || 'Não preenchido',
            ObjetivoRenda: leadData.goal || 'Não preenchido',
            DataAgendamento: leadData.appointment_date || 'Não agendado',
            HoraAgendamento: leadData.appointment_time || 'Não agendado',
            FusoHorario: leadData.timezone || 'Não informado',
            StatusDoLead: status,
            Prioridade: qualification.label,
            Pilar: attribution.pilar,
            Origem: attribution.utm_source || attribution.referrer || 'direto',
            Midia: attribution.utm_medium || '-',
            Campanha: attribution.utm_campaign || '-',
            Peca: attribution.utm_content || '-',
            Termo: attribution.utm_term || '-',
            CodigoIndicacao: attribution.ref || '-',
            PrimeiroContato: attribution.firstTouch
        })
    })
    .then(response => response.json())
    .then(data => console.log('Lead enviado!', data))
    .catch(error => console.error('Erro:', error));
}

function validateStep2() {
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const wa = document.getElementById('whatsapp').value.trim();

    // 1. Validação de Nome 
    if (name.length < 3) {
        alert('Por favor, insira o seu nome completo.');
        return;
    }

    // 2. Validação Estrita de E-mail
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        alert('Por favor, insira um e-mail válido (exemplo@email.com).');
        return;
    }

    // 3. Validação Estrita de WhatsApp (DDD + 9 dígitos ou 8 dígitos)
    const rawWa = wa.replace(/\D/g, ''); 
    if (rawWa.length < 10 || rawWa.length > 11) {
        alert('Por favor, insira um número de WhatsApp válido com DDD (ex: 11 99999-9999).');
        return;
    }

    leadData.name = name;
    leadData.email = email;
    leadData.whatsapp = wa;
    
    // ENVIAR IMEDIATAMENTE (Passo 2 concluído)
    notifyLead("Inicial/Contato");
    trackEvent('Lead');

    nextStep();
}

function selectOption(key, value) {
    leadData[key] = value;
    notifyLead("Atualização/Qualificação");
    nextStep();
}

let selectedDate = null;
let selectedTime = null;
let currentMonthDate = new Date();

function renderCalendar() {
    const grid = document.getElementById('calendarGrid');
    const monthYear = document.getElementById('currentMonth');
    grid.innerHTML = '';

    const year = currentMonthDate.getFullYear();
    const month = currentMonthDate.getMonth();
    
    const months = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];
    monthYear.textContent = `${months[month]} ${year}`;

    const weekdays = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
    weekdays.forEach(day => {
        const d = document.createElement('div');
        d.className = 'calendar-day header';
        d.textContent = day;
        grid.appendChild(d);
    });

    const firstDay = new Date(year, month, 1).getDay();
    const lastDate = new Date(year, month + 1, 0).getDate();

    for (let i = 0; i < firstDay; i++) {
        const d = document.createElement('div');
        d.className = 'calendar-day empty';
        grid.appendChild(d);
    }

    const today = new Date();
    today.setHours(0,0,0,0);

    for (let i = 1; i <= lastDate; i++) {
        const dateObj = new Date(year, month, i);
        const dayDiv = document.createElement('div');
        dayDiv.className = 'calendar-day active';
        dayDiv.textContent = i;

        if (dateObj.getDay() === 0 || dateObj < today) {
            dayDiv.classList.add('disabled');
        } else {
            dayDiv.onclick = () => {
                document.querySelectorAll('.calendar-day').forEach(el => el.classList.remove('selected'));
                dayDiv.classList.add('selected');
                selectedDate = dateObj;
                renderTimeSlots();
            };
        }
        grid.appendChild(dayDiv);
    }
}

function changeMonth(delta) {
    currentMonthDate.setMonth(currentMonthDate.getMonth() + delta);
    renderCalendar();
}

function renderTimeSlots() {
    const slotsGrid = document.getElementById('slotsGrid');
    const container = document.getElementById('time-slots');
    slotsGrid.innerHTML = '';
    container.classList.remove('hidden');

    const slots = ["09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00", "20:00"];
    
    slots.forEach(time => {
        const btn = document.createElement('div');
        btn.className = 'time-slot';
        btn.textContent = time;
        btn.onclick = () => {
            document.querySelectorAll('.time-slot').forEach(el => el.classList.remove('selected'));
            btn.classList.add('selected');
            selectedTime = time;
            document.getElementById('confirmAgendamento').classList.remove('hidden');
        };
        slotsGrid.appendChild(btn);
    });
}

function formatUTC(date, time) {
    const [h, m] = time.split(':');
    const d = new Date(date);
    d.setHours(parseInt(h), parseInt(m), 0);
    return d.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
}

function finishBooking() {
    leadData.appointment_date = selectedDate.toLocaleDateString('pt-BR');
    leadData.appointment_time = selectedTime;
    try {
        leadData.timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    } catch (e) { /* navegador antigo */ }

    notifyLead("Concluído/Agendado");
    trackEvent('Schedule');
    setupCalendarButtons();
    nextStep();
}

function setupCalendarButtons() {
    const eventName = "Call 1x1 - GL Academy";
    const description = `Olá ${leadData.name}, esta é a sua call estratégica agendada.`;
    const location = "Link do Meet enviado por WhatsApp";
    
    const startUTC = formatUTC(selectedDate, selectedTime);
    const [h, m] = selectedTime.split(':');
    const endDate = new Date(selectedDate);
    endDate.setHours(parseInt(h), parseInt(m) + 30, 0);
    const endUTC = endDate.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';

    document.getElementById('googleCalendarBtn').href = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(eventName)}&dates=${startUTC}/${endUTC}&details=${encodeURIComponent(description)}&location=${encodeURIComponent(location)}`;

    const icsContent = `BEGIN:VCALENDAR\nVERSION:2.0\nBEGIN:VEVENT\nDTSTART:${startUTC}\nDTEND:${endUTC}\nSUMMARY:${eventName}\nDESCRIPTION:${description}\nLOCATION:${location}\nEND:VEVENT\nEND:VCALENDAR`;
    const appleBtn = document.getElementById('appleCalendarBtn');
    appleBtn.href = "data:text/calendar;charset=utf8," + encodeURIComponent(icsContent);
    appleBtn.download = "agendamento-gl.ics";
}

// INDICAÇÃO: o lead convida um amigo com link rastreado (ref = LeadID de quem indicou)
function shareInvite() {
    const url = `${window.location.origin}${window.location.pathname}?utm_source=convite&utm_medium=indicacao&utm_campaign=convite-amigo&ref=${encodeURIComponent(leadData.lead_id)}`;
    const message = 'Conheça o GL Model, o modelo de negociação da GL Academy. Dá para agendar uma call 1x1 gratuita por aqui:';
    if (navigator.share) {
        navigator.share({ title: 'GL Academy', text: message, url }).catch(() => {});
        return;
    }
    window.open(`https://wa.me/?text=${encodeURIComponent(`${message} ${url}`)}`, '_blank');
}

renderCalendar();
updateProgress();
loadTracking();
