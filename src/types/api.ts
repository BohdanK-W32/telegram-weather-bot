type IconType =
  | 'clear-day'
  | 'clear-night'
  | 'rain'
  | 'snow'
  | 'sleet'
  | 'wind'
  | 'fog'
  | 'cloudy'
  | 'partly-cloudy-day'
  | 'partly-cloudy-night'
  | 'hail'
  | 'thunderstorm'
  | 'tornado';

type PrecipTypeType = 'rain' | 'snow' | 'sleet';

interface BaseWeatherForecastDataInterface {
  cloudCover?: number;
  dewPoint?: number;
  humidity?: number;
  icon?: IconType;
  ozone?: number;
  precipIntensity?: number;
  precipIntensityError?: number;
  precipProbability?: number;
  precipType?: PrecipTypeType;
  pressure?: number;
  summary?: string;
  time: number;
  uvIndex?: number;
  visibility?: number;
  windBearing?: number;
  windGust?: number;
  windSpeed?: number;
  nearestStormDistance?: number;
}

interface CurrentlyWeatherForecastDataInterface extends BaseWeatherForecastDataInterface {
  apparentTemperature?: number;
  nearestStormBearing?: number;
  nearestStormDistance?: number;
  precipAccumulation?: number;
  temperature?: number;
}

export interface HourlyWeatherForecastDataInterface extends BaseWeatherForecastDataInterface {
  apparentTemperature?: number;
  precipAccumulation?: number;
  temperature?: number;
}

interface DailyWeatherForecastDataInterface extends BaseWeatherForecastDataInterface {
  apparentTemperatureHigh?: number;
  apparentTemperatureHighTime?: number;
  apparentTemperatureLow?: number;
  apparentTemperatureLowTime?: number;
  apparentTemperatureMax?: number;
  apparentTemperatureMaxTime?: number;
  apparentTemperatureMin?: number;
  apparentTemperatureMinTime?: number;
  moonPhase?: number;
  precipAccumulation?: number;
  precipIntensityMax?: number;
  precipIntensityMaxTime?: number;
  sunriseTime: number;
  sunsetTime: number;
  temperatureHigh?: number;
  temperatureHighTime?: number;
  temperatureLow?: number;
  temperatureLowTime?: number;
  temperatureMax?: number;
  temperatureMaxTime?: number;
  temperatureMin?: number;
  temperatureMinTime?: number;
  uvIndexTime?: number;
  windGustTime?: number;
}

export interface HourlyWeatherForecastInterface {
  summary: string;
  icon: IconType;
  data: HourlyWeatherForecastDataInterface[];
}

export interface DailyWeatherForecastInterface {
  data: DailyWeatherForecastDataInterface[];
}

export interface WeatherApiResponseInterface {
  latiude: number;
  longtude: number;
  timezone: string;
  time: number;
  currently: CurrentlyWeatherForecastDataInterface;
  hourly: {
    summary: string;
    icon: IconType;
    data: HourlyWeatherForecastDataInterface[];
  };
  daily: {
    data: DailyWeatherForecastDataInterface[];
  };
}
