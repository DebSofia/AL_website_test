// Parser iCal mínimo (só VEVENT / DTSTART / DTEND) e gerador de feed .ics.
// Datas devolvidas como 'YYYY-MM-DD'; o fim é EXCLUSIVO (dia de saída).

const { addDays } = require('./pricing');

const lisbonDate = (d) =>
  new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Lisbon', year: 'numeric', month: '2-digit', day: '2-digit' }).format(d);

// Converte "20261224", "20261224T150000", "20261224T150000Z" para YYYY-MM-DD
function parseIcalDate(value) {
  const m = /^(\d{4})(\d{2})(\d{2})(?:T(\d{2})(\d{2})(\d{2})?(Z)?)?/.exec((value || '').trim());
  if (!m) return null;
  if (m[7] === 'Z') { // UTC -> data em Lisboa
    return lisbonDate(new Date(Date.UTC(+m[1], +m[2] - 1, +m[3], +m[4], +m[5], +(m[6] || 0))));
  }
  return `${m[1]}-${m[2]}-${m[3]}`; // VALUE=DATE, flutuante ou com TZID: usa a data tal como está
}

function parseICal(text) {
  const lines = String(text).replace(/\r\n?/g, '\n').replace(/\n[ \t]/g, '').split('\n'); // "unfold"
  const events = [];
  let cur = null;
  for (const line of lines) {
    if (line === 'BEGIN:VEVENT') { cur = {}; continue; }
    if (line === 'END:VEVENT') {
      if (cur && cur.start && !cur.cancelled) {
        let end = cur.end;
        if (!end || end <= cur.start) end = addDays(cur.start, 1); // sem fim / mesmo dia = 1 noite
        events.push({ start: cur.start, end });
      }
      cur = null; continue;
    }
    if (!cur) continue;
    const idx = line.indexOf(':');
    if (idx < 0) continue;
    const name = line.slice(0, idx).split(';')[0].toUpperCase();
    const val = line.slice(idx + 1);
    if (name === 'DTSTART') cur.start = parseIcalDate(val);
    else if (name === 'DTEND') cur.end = parseIcalDate(val);
    else if (name === 'STATUS' && val.trim().toUpperCase() === 'CANCELLED') cur.cancelled = true;
  }
  return events;
}

// Junta intervalos sobrepostos/contíguos
function mergeRanges(ranges) {
  const sorted = ranges.filter((r) => r.start && r.end).map((r) => ({ start: r.start, end: r.end })).sort((a, b) => (a.start < b.start ? -1 : 1));
  const out = [];
  for (const r of sorted) {
    const last = out[out.length - 1];
    if (last && r.start <= last.end) { if (r.end > last.end) last.end = r.end; }
    else out.push(r);
  }
  return out;
}

const overlaps = (ranges, a, b) => ranges.some((r) => a < r.end && r.start < b);

const esc = (s) => String(s).replace(/([,;\\])/g, '\\$1').replace(/\n/g, '\\n');
const compact = (d) => d.replace(/-/g, '');

function buildICS(bookings, host = 'casa-da-ribeira') {
  const stamp = new Date().toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
  const out = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Casa da Ribeira//Reservas diretas//PT', 'CALSCALE:GREGORIAN', 'METHOD:PUBLISH', 'X-WR-CALNAME:Reservas diretas'];
  for (const b of bookings) {
    out.push('BEGIN:VEVENT', `UID:${esc(b.id)}@${host}`, `DTSTAMP:${stamp}`,
      `DTSTART;VALUE=DATE:${compact(b.start)}`, `DTEND;VALUE=DATE:${compact(b.end)}`,
      `SUMMARY:${esc(b.summary || 'Reserva direta')}`, 'TRANSP:OPAQUE', 'END:VEVENT');
  }
  out.push('END:VCALENDAR');
  return out.join('\r\n') + '\r\n';
}

module.exports = { parseICal, parseIcalDate, mergeRanges, overlaps, buildICS };
