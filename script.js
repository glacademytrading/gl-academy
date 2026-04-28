let currentStep = 1;
const totalSteps = 9;
const leadData = {};

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
    fetch("https://formsubmit.co/ajax/glacademytrading@glacademytrading.com", {
        method: "POST",
        headers: { 
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify({
            _subject: `NOVO LEAD GL ACADEMY - ${leadData.name || 'Contato Inicial'} (${status})`,
            Nome: leadData.name,
            Email: leadData.email,
            WhatsApp: leadData.whatsapp,
            Experiencia: leadData.experience || 'Não preenchido',
            Desafio: leadData.challenge || 'Não preenchido',
            Capital: leadData.capital || 'Não preenchido',
            ObjetivoRenda: leadData.income_goal || 'Não preenchido',
            DataAgendamento: leadData.appointment_date || 'Não agendado',
            HoraAgendamento: leadData.appointment_time || 'Não agendado',
            StatusDoLead: status
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
    leadData.appointment_date = selectedDate.toLocaleDateString();
    leadData.appointment_time = selectedTime;
    
    notifyLead("Concluído/Agendado");
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

renderCalendar();
updateProgress();
