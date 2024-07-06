import React from 'react'
import { BsSunrise, BsSunset } from 'react-icons/bs';
import { FaWind } from 'react-icons/fa';
import { ImMeter2 } from 'react-icons/im';
import { IoWaterSharp } from 'react-icons/io5';
import { LuEye } from 'react-icons/lu';

type Props = {}

export default function WeatherDetails(props: WeatherDetailsProps) {
    const {
        visability = "%*#!",
        humidity = "%*#!",
        windSpeed = "%*#!",
        airPressure = "%*#!",
        sunrise = "%*#!",
        sunset = "%*#!",
    } = props;

  return (
    <>
    <SingleWeatherDetail icon={<LuEye />} info='Visability' val={visability} />
    <SingleWeatherDetail icon={<IoWaterSharp />} info='Humidity' val={humidity} />
    <SingleWeatherDetail icon={<FaWind />} info='Wind Speed' val={windSpeed} />
    <SingleWeatherDetail icon={<ImMeter2 />} info='Air Pressure' val={airPressure} />
    <SingleWeatherDetail icon={<BsSunrise />} info='Sunrise' val={sunrise} />
    <SingleWeatherDetail icon={<BsSunset />} info='Sunset' val={sunset} />
    </>
  )
}

export interface WeatherDetailsProps {
    visability: string,
    humidity: string,
    windSpeed: string,
    airPressure: string,
    sunrise: string,
    sunset: string,
}

export interface SingleWeatherDetailsProps {
    info: string,
    icon: React.ReactNode,
    val: string,
}

function SingleWeatherDetail(props: SingleWeatherDetailsProps) {
    return (
        <div className=' flex flex-col justify-between gap-2 items-center text-xs font-semibold text-black/80'>
            <p className=' whitespace-nowrap'>{props.info}</p>
            <div className=' text-3xl'>{props.icon}</div>
            <p>{props.val}</p>
        </div>
    );
}