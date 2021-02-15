export type UserObjectType = {
  first_name: string;
  last_name?: string;
  username?: string;
};

export type TimeWithTimezoneType = {
  time: number;
  timezone: string;
};

export type HourlyWeatherDataType = {
  temperature: number;
  time: number;
  windSpeed: number;
  precipIntensity: number;
  precipProbability: number;
};

export type LocationType = {
  lat: number;
  lng: number;
};

export interface FetchWeatherParametersInterface extends LocationType {
  lang: string;
}

export interface GeneralWeaterDataInterface {
  data: HourlyWeatherDataType[];
  timezone: string;
}
