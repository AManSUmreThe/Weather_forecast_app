import key from "./getapikey.mjs";

const BASE_URL = "https://api.weatherapi.com/v1/forecast.json";
const FORECAST_DAYS = 7;

export async function getForecast(location) {
    if (!location || typeof location !== "string") return null;
    const params = new URLSearchParams({
        key,
        q: location.trim(),
        days: FORECAST_DAYS,
        aqi: "no",
        alerts: "yes",
    });
    const url = `${BASE_URL}?${params.toString()}`;
    try {
        const response = await fetch(url);
        if (!response.ok) {
            const errData = await response.json().catch(() => ({}));
            throw new Error(errData.error?.message || `HTTP ${response.status}`);
        }
        return await response.json();
    } catch (err) {
        console.error(err);
        throw err;
    }
}
