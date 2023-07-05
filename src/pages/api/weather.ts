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
    const res = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${process.env.OPEN_WEATHER_API_KEY}`
    );

    if (!res.ok) {
      throw new ApplicationError(`Fetch error ${res.statusText}`);
    }

    const data: WeatherData = await res.json();

    // return the necessary data
    const weatherData = {
      windSpeed: data.windSpeed,
      temperature: data.temperature,
      description: data.description,
      humidity: data.humidity,
    };

    return weatherData;
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
