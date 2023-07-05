import { useState } from "react";

interface WeatherData {
  temperature: number;
  humidity: number;
  windSpeed: number;
  description: string;
}

export default function Home() {
  const [location, setLocation] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
  }
  return (
    <div className="flex flex-col w-64 mx-auto">
      <h1 className="text-black font-bold text-lg ">Weather</h1>
      <form onSubmit={handleSubmit} className="flex flex-col">
        <input
          type="text"
          value={location}
          className="px-4 py-2 border-2 mt-5 mb-2 border-solid border-[#10a37f] rounded placeholder:text-[#8e8ea0] placeholder:opacity:100"
          onChange={(e) => setLocation(e.target.value)}
        />
        <input
          type="submit"
          value="Get Weather Data"
          className="bg-[#10a37f] text-white rounded px-4 py-2 cursor-pointer hover:bg-[#106852]"
        />
      </form>
    </div>
  );
}
