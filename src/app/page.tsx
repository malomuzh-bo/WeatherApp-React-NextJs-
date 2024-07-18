'use client';
import Image from "next/image";
import Navbar from '../components/Navbar'
import 'bootstrap/dist/css/bootstrap.min.css';
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { format, fromUnixTime, parseISO } from "date-fns";
import Container from "@/components/Container";
import { convertKelvinToCelsius } from "@/utilities/converter_K_to_C";
import { metersToKilometers } from "@/utilities/converter_M_to_KM";
import WeatherIcon from "@/components/WeatherIcon";
import WeatherDetails from "@/components/WeatherDetails";
import { convertWindSpeed } from "@/utilities/convertWindSpeed";
import ForecastItem from "@/components/ForecastItem";
import { useAtom } from "jotai";
import { placeAtom } from "./atom";
import { useEffect } from "react";

// Type for the data (API)
interface WeatherData {
	city: any;
  cod: string;
  message: number;
  cnt: number;
  list: WeatherEntry[];
}

interface WeatherEntry {
  dt: number;
  main: MainData;
  weather: Weather[];
  clouds: Clouds;
  wind: Wind;
  visibility: number;
  pop: number;
  sys: Sys;
  dt_txt: string;
  rain?: Rain;
}

interface MainData {
  temp: number;
  feels_like: number;
  temp_min: number;
  temp_max: number;
  pressure: number;
  sea_level: number;
  grnd_level: number;
  humidity: number;
  temp_kf: number;
}

interface Weather {
  id: number;
  main: string;
  description: string;
  icon: string;
}

interface Clouds {
  all: number;
}

interface Wind {
  speed: number;
  deg: number;
  gust: number;
}

interface Sys {
  pod: string;
}

interface Rain {
  "3h": number;
}
//Type for the data (API)

const number = '1234567890'

export default function Home() {
  const [place, setPlace] = useAtom(placeAtom);

  const { isPending, error, data, refetch } = useQuery<WeatherData>({
    queryKey: ['repoData'],
    queryFn: 
    async () => {
      const {data} = await axios.get(`https://api.openweathermap.org/data/2.5/forecast?q=${place}&appid=${process.env.NEXT_PUBLIC_WEATHER_KEY}&cnt=56`);
      return data;
    }
  });

  useEffect(() => {
    refetch();
  }, [place, refetch])

  const firstData = data?.list[0];

	const uniqueDates = [
		... new Set(data?.list.map(
			entry => new Date(entry.dt * 1000).toISOString().split("T")[0]
		))
	];
	const firstDataForEachDate = uniqueDates.map(date => {
		return data?.list.find(entry => {
			const entryDate = new Date(entry.dt * 1000).toISOString().split("T")[0];
			const entryTime = new Date(entry.dt * 1000).getHours();
			return entryDate === date && entryTime >= 6;
	});
	})

  console.log("data", data);

  if (isPending) return (
    <div className="flex items-center min-h-screen justify-center">
      <p className="animate-bounce">Loading...</p>
    </div>
  );

  if (error) return 'An error has occurred: ' + error.message

  return (
    <div className="flex flex-col gap-4 bg-gray-100 min-h-screen">
      <Navbar location={data?.city.name} />
      <main className="px-3 max-w-7xl mx-auto flex flex-col gap-9 w-full pb-10 pt-4">
        {/* today */}
        <section className="space-y-4">
          <div className=" space-y-2">
            <h2 className="flex gap-1 text-2xl items-end">
              {format(parseISO(firstData?.dt_txt ?? ''), 'EEEE')} (
              {format(parseISO(firstData?.dt_txt ?? ''), 'dd.MM.yyyy')}
              )
            </h2>
            <Container className="gap-10 px-6 items-center">
              {/* temperature */}
              <div className="flex flex-col px-4">
                <span className="text-5xl">
                  {convertKelvinToCelsius(firstData?.main.temp ?? 298.4)}°
                </span>
                <p className=" text-xs space-x-1 whitespace-nowrap">
                  <span>Feels like </span>
                  {convertKelvinToCelsius(firstData?.main.feels_like ?? 298.4)}°
                </p>
                <p className=" text-xs space-x-2">
                  <span>
                  {convertKelvinToCelsius(firstData?.main.temp_min ?? 0)}°↓{""}
                  </span>
                  <span>
                  {""}
                  {convertKelvinToCelsius(firstData?.main.temp_max ?? 0)}°↑
                  </span>

                </p>
              </div>
              {/* time and weather */}
              <div className=" flex gap-10 sm:gap-16 overflow-x-auto w-full justify-between pr-3">
                { data?.list.map((d, i) => 
                <div key={i} className="flex flex-col justify-between gap-2 items-center text-xs font-semibold">
                  <p className=" whitespace-nowrap">{format(parseISO(d.dt_txt), "hh:mm a")}</p>
                  <WeatherIcon iconName={d?.weather[0].icon} />
                  <p>{convertKelvinToCelsius(d?.main.temp ?? 0)}°</p>
                </div>
                )}
              </div>
            </Container>
            </div>
            <div className=" flex gap-4">
                {/* left */}
                <Container className=" w-fit justify-center flex-col px-4 items-center">
                  <p className=" capitalize text-center">{firstData?.weather[0].description}</p>
                  <WeatherIcon iconName={firstData?.weather[0].icon ?? ''} />
                </Container>
                {/* right */}
                <Container className="bg-yellow-300/80 px-6 gap-4 justify-between overflow-x-auto">
									<WeatherDetails 
									visability={metersToKilometers(firstData?.visibility ?? 10000)} 
									airPressure={`${firstData?.main.pressure} hPa`}
									humidity={`${firstData?.main.humidity}%`} 
									windSpeed={convertWindSpeed(firstData?.wind.speed ?? 1.64)} 
									sunrise={format(fromUnixTime(data?.city.sunrise ?? 1702949452), "H:mm")} 
									sunset={format(fromUnixTime(data?.city.sunset ?? 1702949452), "H:mm")} />
                </Container>
            </div>
        </section>
        {/* forecast */}
        <section className="flex w-full flex-col gap-4">
          <p className=" text-2xl">Forecast on 7 days</p>
          {firstDataForEachDate.map((d, i) => (
            <ForecastItem 
            key={i}
            description={d?.weather[0].description ?? ""}
            weatherIcon={d?.weather[0].icon ?? "01d"}
            date={format(parseISO(d?.dt_txt ?? ""), "dd.MM")}
            day={format(parseISO(d?.dt_txt ?? ""), "EEEE")}
            feels_like={d?.main.feels_like ?? 0}
            temp={d?.main.temp ?? 0}
            temp_max={d?.main.temp_max ?? 0}
            temp_min={d?.main.temp_min ?? 0}
            airPressure={`${d?.main.pressure ?? 0} hPa`}
            humidity={`${d?.main.humidity}%`}
            sunrise={format(fromUnixTime(data?.city.sunrise ?? 1702517657), "H:mm")}
            sunset={format(fromUnixTime(data?.city.sunset ?? 1702517657), "H:mm")}
            visability={`${metersToKilometers(d?.visibility ?? 10000)} `}
            windSpeed={`${convertWindSpeed(d?.wind.speed ?? 1.64)} `}
             />

          ))}
        </section>
      </main>
    </div>
  );
}
