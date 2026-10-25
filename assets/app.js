const $ = (selector) => document.querySelector(selector);

const icons = {
  chart: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/></svg>`,
  flag: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 22V4m0 0c6-4 8 4 14 0v10c-6 4-8-4-14 0"/></svg>`,
  bulb: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 18h6M10 22h4M8.5 15.5A7 7 0 1 1 15.5 15.5C14.5 16.4 14 17 14 18h-4c0-1-.5-1.6-1.5-2.5Z"/></svg>`
};

async function loadSite() {
  try {
    const response = await fetch('data/site.json', { cache: 'no-store' });
    if (!response.ok) throw new Error('Unable to load site data');
    const data = await response.json();
    renderSite(data);
  } catch (error) {
    console.error(error);
    document.body.insertAdjacentHTML('afterbegin', '<div class="bg-red-50 px-4 py-3 text-center text-sm font-semibold text-red-700">Could not load data/site.json. Run this website through a local or web server instead of opening index.html directly.</div>');
  }
}

function renderSite(data) {
  const { event, themes, speakers, organizers, host, agenda } = data;

  $('#eventTitle').textContent = event.title;
  $('#eventSubtitle').textContent = event.subtitle;
  $('#eventDescription').textContent = event.description;
  $('#eventDate').textContent = event.date;
  $('#eventDay').textContent = event.day;
  $('#eventTime').textContent = event.time;
  $('#eventTimezone').textContent = event.timezone;
  $('#eventMode').textContent = event.mode;
  $('#audienceText').textContent = `Bringing together ${event.audience}.`;
  $('#posterImage').src = event.poster;
  $('#registerButton').href = event.registrationUrl || '#';

  $('#themesGrid').innerHTML = themes.map(item => `
    <article class="card card-hover p-6">
      <div class="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-50 text-tealx [&>svg]:h-6 [&>svg]:w-6">${icons[item.icon] || icons.bulb}</div>
      <h3 class="text-xl font-black text-navy">${item.title}</h3>
      <p class="mt-1 font-bold text-tealx">${item.subtitle}</p>
      <p class="mt-4 leading-7 text-slate-600">${item.description}</p>
    </article>
  `).join('');

  $('#speakersGrid').innerHTML = speakers.map(person => `
    <article class="speaker-card card card-hover overflow-hidden">
      <div class="speaker-photo-wrap">
        <img class="speaker-photo" src="${person.photo}" alt="${escapeHtml(person.name)}">
      </div>
      <div class="speaker-body p-5">
        <h3 class="text-sm font-black text-navy">${escapeHtml(person.name)}</h3>
        <p class="mt-1 text-sm font-bold text-tealx">${escapeHtml(person.designation)}</p>
        <p class="mt-1 text-xs leading-5 text-slate-500">${escapeHtml(person.affiliation)}</p>
      </div>
    </article>
  `).join('');

  $('#agendaSummary').textContent = agenda.summary;
  $('#agendaList').innerHTML = agenda.sessions.map((item, index) => `
    <article class="card flex gap-4 p-5 sm:gap-5">
      <div class="flex h-10 min-w-10 items-center justify-center rounded-full bg-navy text-sm font-black text-white">${index + 1}</div>
      <div>
        <h3 class="text-lg font-black text-navy">${escapeHtml(item.title)}</h3>
        <p class="mt-2 leading-7 text-slate-600">${escapeHtml(item.description)}</p>
      </div>
    </article>
  `).join('');


$('#organizersGrid').innerHTML = organizers.map(person => `
  <article class="card card-hover flex items-center gap-4 p-4">
    <img class="h-32 w-28 shrink-0 rounded-xl object-center" src="${person.photo}" alt="${escapeHtml(person.name)}" loading="lazy">
    <div class="min-w-0">
      <h3 class="text-base font-bold text-navy">${escapeHtml(person.name)}</h3>
      <p class="mt-1 text-sm font-semibold text-tealx">${escapeHtml(person.post)}</p>
      <p class="mt-1 text-sm leading-5 text-slate-500">${escapeHtml(person.organization)}</p>
    </div>
  </article>
`).join('');


  $('#hostTitle').textContent = host.title;
  $('#hostOrganization').textContent = host.organization;
  $('#hostLocation').textContent = host.location;
  $('#hostEmail').textContent = host.email;
  $('#hostEmail').href = `mailto:${host.email}`;
  $('#year').textContent = new Date().getFullYear();
}

function escapeHtml(value = '') {
  return String(value).replace(/[&<>'"]/g, (char) => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[char]));
}

$('#menuButton').addEventListener('click', () => $('#mobileMenu').classList.toggle('hidden'));
document.querySelectorAll('#mobileMenu a').forEach(link => link.addEventListener('click', () => $('#mobileMenu').classList.add('hidden')));

loadSite();
