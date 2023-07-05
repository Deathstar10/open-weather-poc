export default function WeatherInfo({
  windSpeed,
  humidity,
  temperature,
  description,
}: {
  windSpeed: number;
  humidity: number;
  temperature: number;
  description: string;
}) {
  return (
    <div className="flex flex-col">
      <h2 className="text-4xl">
        {Math.round((temperature - 273.15) * 100) / 100}&deg;C
      </h2>
      <p>{description}</p>
      <p>Humidity: {humidity}</p>
      <p>Wind Speed: {windSpeed}</p>
    </div>
  );
}
