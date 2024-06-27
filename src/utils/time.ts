import moment from 'moment';

export function parseSeconds(seconds: number) {
  // Get an object that contains corresponding values of time objects such as hours, minutes, and seconds
  const time = moment.duration(seconds, 'seconds');
  const hours = Math.trunc(time.asHours());
  const minutes = time.minutes();
  const ss = time.seconds();
  const ms = time.milliseconds();
  return {
    h: hours,
    m: minutes,
    s: ss,
    ms,
  };
}

export function formatSeconds(seconds: number, digits = 0) {
  const parsed = parseSeconds(seconds);
  let D = ''.padStart(digits, 'S');
  if (digits > 0) {
    D = ':' + D;
  }
  return moment(parsed).format((parsed.h > 0 ? 'hh:mm:ss' : 'mm:ss') + D);
}
