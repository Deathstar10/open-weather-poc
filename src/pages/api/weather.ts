import type { NextApiRequest, NextApiResponse } from "next";
import { z } from "zod";
import { ApplicationError, UserError } from "@/common/errors";

interface WeatherData {
  temperature: number;
  humidity: number;
  windSpeed: number;
  description: string;
}

interface Error {
  error: string;
  data: any;
}

const weatherAPISchema = z.object({
  main: z.object({
    temp: z.number(),
    feels_like: z.number(),
    temp_min: z.number(),
    temp_max: z.number(),
    pressure: z.number(),
    humidity: z.number(),
  }),
  wind: z.object({
    speed: z.number(),
  }),
  weather: z
    .object({
      id: z.number(),
      main: z.string(),
      description: z.string(),
    })
    .array(),
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<WeatherData | Error>
) {
  try {
    // validate the location at the runtime using zod
    const mySchema = z.string();

    const location = mySchema.parse(req.body.location);

    // check for valid place from the user input
    if (location.trim().length === 0) {
      throw new UserError("Enter a valid location");
    }

    // fetch the data from the open weather API
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${process.env.OPEN_WEATHER_API_KEY}`
    );

    if (!response.ok) {
      throw new ApplicationError(`Fetch error ${response.statusText}`);
    }

    const data = await response.json();

    // we need to take our data and parse it into our required fields
    const parsedData = weatherAPISchema.parse(data);

    // return the necessary data
    const weatherData = {
      windSpeed: parsedData.wind.speed,
      temperature: parsedData.main.temp,
      description: parsedData.weather[0].description,
      humidity: parsedData.main.humidity,
    };

    res.status(200).json(weatherData);
  } catch (err) {
    if (err instanceof ApplicationError) {
      res.status(500).json({ error: err.message, data: err.data });
    } else if (err instanceof UserError) {
      res.status(400).json({ error: err.message, data: err.data });
    } else {
      console.error(err);
      res.status(500).json({ data: err, error: "" });
    }
  }
}
