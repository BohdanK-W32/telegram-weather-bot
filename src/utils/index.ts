import moment from 'moment-timezone';
import { UserObjectType } from 'types';
import { WeatherApiResponseInterface } from 'types/api';

export const getFullNameWithUsername = (user: UserObjectType) =>
  `${user.first_name}${user.last_name ? ` ${user.last_name}` : ''}${user.username ? ` (@${user.username})` : ''}`;

export const filterTodayHourly = ({ hourly: { data }, timezone }: WeatherApiResponseInterface) => {
  const allHours = data.filter(({ time }) => moment.unix(time).isBetween(moment(), moment().endOf('day')));

  const everyTwoHours = allHours.filter(({ time }) =>
    Number(moment.unix(time).tz(timezone).format('H')) % 2 ? false : true
  );

  return everyTwoHours;
};

export const filterTomorrowHourly = ({ hourly: { data }, timezone }: WeatherApiResponseInterface) => {
  const allHours = data.filter(({ time }) =>
    moment.unix(time).isBetween(moment().endOf('day'), moment().add(1, 'd').endOf('day'))
  );

  const everyTwoHours = allHours.filter(({ time }) =>
    Number(moment.unix(time).tz(timezone).format('H')) % 2 ? false : true
  );

  return everyTwoHours;
};
