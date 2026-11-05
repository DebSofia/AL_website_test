// GET /calendar.ics -> feed iCal só com as RESERVAS DIRETAS (+ bloqueios manuais).
// Importar este URL no Airbnb e no Booking.com evita overbooking. Não inclui
// reservas vindas dos portais (evita "ecos" entre calendários).
const { getDirectBookings } = require('./_shared/store');
const { buildICS } = require('./_shared/ical');

exports.handler = async (event) => {
  const token = process.env.ICAL_EXPORT_TOKEN;
  if (token && (event.queryStringParameters || {}).token !== token) return { statusCode: 403, body: 'Forbidden' };
  try {
    const list = await getDirectBookings(event);
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'text/calendar; charset=utf-8', 'Cache-Control': 'public, max-age=300', 'Content-Disposition': 'inline; filename="calendar.ics"' },
      body: buildICS(list)
    };
  } catch (e) {
    console.error(e);
    return { statusCode: 500, body: 'Error' };
  }
};
