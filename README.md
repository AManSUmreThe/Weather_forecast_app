# Weather Forecast App

A simple weather app that shows current conditions and a 7-day forecast for cities worldwide. Built with vanilla JavaScript and Tailwind CSS, using the [WeatherAPI.com](https://www.weatherapi.com/) forecast API.

## Features

- **Country and city selection** ? Choose from a curated list of countries and cities via dropdowns
- **Current weather** ? Location, local time, temperature (?C), condition, and weather icon
- **7-day forecast** ? Daily cards with date, condition icon, description, and max/min temperatures
- **Weather alerts** ? Displays active alerts when returned by the API
- **Themed UI** ? Teal/blue palette and card layout styled with Tailwind CSS

## Tech stack

- HTML, CSS, JavaScript (ES modules)
- [Tailwind CSS v4](https://tailwindcss.com/) for styling
- [WeatherAPI.com](https://www.weatherapi.com/) ? Forecast API (`/v1/forecast.json`)

## Prerequisites

- [Node.js](https://nodejs.org/) (v18 or later recommended)
- A free [WeatherAPI.com](https://www.weatherapi.com/signup.aspx) API key

## Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd WeatherApp
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Add your API key**  
   Create `src/js/getapikey.mjs` (this file is gitignored) and export your WeatherAPI key:
   ```javascript
   const key = "YOUR_WEATHERAPI_KEY_HERE";
   export default key;
   ```  
   Get a key at [weatherapi.com/signup](https://www.weatherapi.com/signup.aspx).

4. **Build CSS**
   ```bash
   npx @tailwindcss/cli -i ./src/input.css -o ./src/output.css
   ```
   Re-run this after changing `src/input.css` or theme/styles.

5. **Run a local server**  
   The app uses `fetch()` for the API and for `locations.json`, so it must be served over HTTP (not opened as `file://`). For example:
   ```bash
   npx serve src
   ```
   Then open the URL shown (e.g. `http://localhost:3000`) in your browser.

## Project structure

```
WeatherApp/
??? README.md
??? package.json
??? src/
    ??? index.html          # Main page and layout
    ??? input.css           # Tailwind import + @theme palette
    ??? output.css          # Generated CSS (from Tailwind build)
    ??? js/
        ??? api.js          # getForecast(location) ? WeatherAPI client
        ??? app.js          # UI logic, dropdowns, render current/forecast/alerts
        ??? getapikey.mjs   # API key (create locally, gitignored)
        ??? locations.json  # Static list of countries and cities
```

## Adding custom locations (locations.json)

The country and city dropdowns are filled from `src/js/locations.json`. You can add your own countries and cities by editing this file.

**Format:** The file is a JSON array of objects. Each object has:

- `country` ? Full country name (e.g. `"India"`, `"United Kingdom"`).
- `cities` ? Array of city name strings (e.g. `["Nagpur", "Mumbai", "Delhi"]`).

**Example ? add a new country:**

```json
{
  "country": "Portugal",
  "cities": ["Lisbon", "Porto", "Faro", "Coimbra"]
}
```

Append this object to the existing array in `locations.json` (after the last `},` add a comma, then paste the new object).

**Example ? add cities to an existing country:**

Open `locations.json`, find the object for that country, and add more strings to its `cities` array:

```json
"cities": ["Nagpur", "Mumbai", "Delhi", "Bangalore", "Jaipur", "Ahmedabad"]
```

**Tips:**

- Keep valid JSON (commas between array elements and objects, no trailing comma after the last item).
- Use city names that [WeatherAPI.com](https://www.weatherapi.com/) recognizes (e.g. as in their [Search API](https://www.weatherapi.com/docs/#apis-search)); the app sends `"City, Country"` for the forecast request.
- Country names appear in the dropdown in alphabetical order; city order is as in the array.

## package.json and `"type": "module"`

The project uses **ES modules** (`import` / `export`) in JavaScript. In `package.json` you should have:

```json
"type": "module"
```

**Why this is needed:**

- Without `"type": "module"`, Node.js treats `.js` files as **CommonJS** (e.g. `require()`). Code that uses `import` or `export` is then invalid in that context and can trigger parsing or runtime warnings.
- Setting `"type": "module"` tells Node that `.js` (and `.mjs`) files in this package are **ES modules**, so `import`/`export` are allowed and the CommonJS-related warning goes away.

The API key is in `getapikey.mjs` (`.mjs` is always treated as ES module regardless of `package.json`), and `api.js` imports it; having `"type": "module"` in `package.json` keeps the whole project consistent and avoids module parsing warnings.

## API

The app calls WeatherAPI.com **Forecast API**:

- **Endpoint:** `https://api.weatherapi.com/v1/forecast.json`
- **Parameters:** `key`, `q` (location, e.g. city name or "City, Country"), `days=7`, `aqi=no`, `alerts=yes`
- **Response:** Current weather, 7-day forecast (with condition icons), and optional alerts

Weather condition icons are loaded from the API (e.g. `//cdn.weatherapi.com/weather/64x64/...`); the app prepends `https:` when rendering.

## License

This project is for educational use. Weather data is provided by [WeatherAPI.com](https://www.weatherapi.com/); see their terms of use for API usage.
