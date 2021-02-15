import request from 'helpers/request';
import { FetchWeatherParametersInterface } from 'types';
import { WeatherApiResponseInterface } from 'types/api';

const fetchWeather = async ({
  lat,
  lng,
  lang = 'en'
}: FetchWeatherParametersInterface): Promise<WeatherApiResponseInterface | undefined> => {
  try {
    const res = await request(`${lat},${lng}?lang=${lang}&units=si&exclude=minutely,alerts,flag]`);
    const data: WeatherApiResponseInterface = res.data;

    return data;
  } catch (err) {
    console.error(new Error(err));
  }
};

export default fetchWeather;
