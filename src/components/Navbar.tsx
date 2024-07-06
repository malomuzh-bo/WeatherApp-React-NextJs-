'use client';

import React from 'react'
import { TiWeatherCloudy } from "react-icons/ti";
import { CiLocationArrow1 } from "react-icons/ci";
import Search from './Search';
import axios from 'axios';
import { useAtom } from 'jotai';
import { placeAtom } from '@/app/atom';
import { MdOutlineLocationOn } from 'react-icons/md';

type Props = { location?: string }
const API_KEY = process.env.NEXT_PUBLIC_WEATHER_KEY;
const sleep = ms => new Promise(r => setTimeout(r, ms));


export default function Navbar({location}: Props) {
  const [city, setCity] = React.useState("");
  const [error, setError] = React.useState("");
//
  const [suggestions, setSuggestions] = React.useState<string[]>([]);
  const [showSuggestion, setShowSuggestion] = React.useState(false)
//
  const [place, setPlace] = useAtom(placeAtom);
//
  async function handleInputChange(value: string) {
    setCity(value);
    if (value.length >= 3) {
      try {
        const response = await axios.get(`https://api.openweathermap.org/data/2.5/find?q=${value}&appid=${API_KEY}`);
        const suggestions = response.data.list.map((item:any) => item.name);
        setSuggestions(suggestions);
        setError("");
        setShowSuggestion(true);
      } catch (error) {
        setSuggestions([]);
        setShowSuggestion(false);
      }
    }
    else {
      setSuggestions([]);
      setShowSuggestion(false);
    }
  }
  function handleSuggestionClick(value:string) {
    setCity(value);
    setShowSuggestion(false);
  }
  async function handleSubmitSearch(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (suggestions.length == 0) {
      setError("Location not found");
      await sleep(3000);
      setError("");
    }
    else{
      setError("");
      setPlace(city);
      setShowSuggestion(false);
    }
  }
    

  return (
    <nav className='shadow-sm sticky top-0 left-0 z-50 bg-white'>
        <div className='h-[80px] w-full flex justify-between items-center max-w-7xl px-3 mx-auto'>
            <section className='flex items-center justify-center gap-2'>
                <h2 className='text-gray-500 text-3xl'>iWeather</h2>
                <TiWeatherCloudy className='text-3xl mt-1 text-blue-300' />
            </section>
            <section className='flex gap-2 items-center'>
              <CiLocationArrow1 className='text-3xl hover:opacity-60 cursor-pointer transition-all' />
              <MdOutlineLocationOn className=' text-3xl' />
              <p className=' text-slate-900/80 text-sm'>{location}</p>
              <div className=' relative'>
                <Search value={city}
                onSubmit={handleSubmitSearch} 
                onChange={(e) => handleInputChange(e.target.value)}
                />
                <SuggestionsBox {...{suggestions, 
                  showSuggestion, 
                  handleSuggestionClick, 
                  error}} />
              </div>
            </section>
        </div>
      </nav>
  )
}

function SuggestionsBox({
  suggestions, 
  showSuggestion, 
  handleSuggestionClick, 
  error} : {
    suggestions: string[], 
    showSuggestion: boolean, 
    handleSuggestionClick: (item:string) => void, 
    error: string})  {
  return (
    <>{ ((showSuggestion && suggestions.length > 1) || error) &&  (
      <ul className=' mb-4 bg-white absolute border top-[44px] left-0 border-gray-300 rounded-md min-w-[200px] flex flex-col gap-1 p-2'>
        { error && suggestions.length < 1 && (<li className=' to-red-500 p-1'>{error}</li>)}
        {suggestions.map((item, i) => (
          <li key={i} onClick={() => handleSuggestionClick(item)} className=' cursor-pointer p-1 rounded hover:bg-gray-200'>
            {item}
          </li>
        ))}
      </ul>
    )}
    </>
  );
}