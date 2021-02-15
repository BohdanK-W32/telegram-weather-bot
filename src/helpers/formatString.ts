import { HourlyWeatherForecastDataInterface } from './../types/api';
import moment from 'moment-timezone';
import { TimeWithTimezoneType } from 'types';

export const timeString = ({ time, timezone }: TimeWithTimezoneType) => moment.unix(time).tz(timezone).format('HH:mm');
export const getDateString = (date: string, lang: string, format: string) =>
  moment.unix(Number(date)).locale(lang).format(format);

export const getHourlyWeatherString = ({
  data,
  timezone
}: {
  data: HourlyWeatherForecastDataInterface[];
  timezone: string;
}) => {
  let weatherString = '';

  const timeString = (time: number) => moment.unix(time).tz(timezone).format('HH:mm');

  data.map(({ temperature, time, windSpeed, precipIntensity, precipProbability }) => {
    const temp = temperature ? Math.round(temperature) : null;
    weatherString += `<pre>${timeString(time)}  ${temp ? `${temp}°C` : '-----'} ${
      temp && temp < 10 ? ' ' : ''
    } ${windSpeed.toFixed(1)} m/s  ${precipIntensity.toFixed(1)} (${precipProbability * 100}%) mm/hg  </pre>\n`;
  });

  return weatherString;
};
