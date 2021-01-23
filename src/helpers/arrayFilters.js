export const filterTomorrowHourly = ({ data, timezone }) => {
  const allHours = data.filter(({ time }) =>
    moment.unix(time).isBetween(moment().endOf('day'), moment().add(1, 'd').endOf('day'))
  );
  const everyTwoHours = allHours.filter(({ time }) =>
    Number(moment.unix(time).tz(timezone).format('H')) % 2 ? false : true
  );

  return everyTwoHours;
};
