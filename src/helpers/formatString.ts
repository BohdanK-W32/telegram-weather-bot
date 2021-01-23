import moment from 'moment-timezone';

export const timeString = ({ time, timezone }) => moment.unix(time).tz(timezone).format('HH:mm');

export const getDateString = (date, lang, format) => moment.unix(date).locale(lang).format(format);

export const getHourlyWeatherString = ({ data, timezone }) => {
  let weatherString = '';
  const timeString = time => moment.unix(time).tz(timezone).format('HH:mm');
  data.map(({ temperature, time, windSpeed, precipIntensity, precipProbability }) => {
    const temp = Math.round(temperature);
    weatherString += `<pre>${timeString(time)}  ${temp}°C ${temp < 10 ? ' ' : ''} ${windSpeed.toFixed(
      1
    )} m/s  ${precipIntensity.toFixed(1)} (${precipProbability * 100}%) mm/hg  </pre>\n`;
  });

  return weatherString;
};
