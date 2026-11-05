// GET /api/availability -> { booked: [{start,end}], generated }
// Junta os iCal do Airbnb/Booking (env) com as reservas diretas. "end" = dia de saída (exclusivo).
const { getBookedRanges } = require('./_shared/store');
const { json } = require('./_shared/util');

exports.handler = async (event) => {
  if (event.httpMethod !== 'GET') return json(405, { error: 'method' });
  try {
    const { ranges, failed } = await getBookedRanges(event);
    return json(200, { booked: ranges, partial: failed > 0, generated: new Date().toISOString() }, {
      'Cache-Control': 'public, max-age=300' // 5 min
    });
  } catch (e) {
    console.error(e);
    return json(500, { error: 'server' });
  }
};
