import { getForecast } from "./api.js";

const countrySelect = document.getElementById("country-select");
const citySelect = document.getElementById("city-select");
const searchBtn = document.getElementById("search-btn");
const errorMessage = document.getElementById("error-message");
const alertsSection = document.getElementById("alerts-section");
const currentWeather = document.getElementById("current-weather");
const forecastSection = document.getElementById("forecast-section");
const forecastGrid = document.getElementById("forecast-grid");

let locationsData = [];

function showError(msg) {
    errorMessage.textContent = msg;
    errorMessage.classList.remove("hidden");
}

function clearError() {
    errorMessage.classList.add("hidden");
    errorMessage.textContent = "";
}

function formatDate(dateStr) {
    const d = new Date(dateStr + "T12:00:00");
    return d.toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" });
}

function iconUrl(icon) {
    if (!icon) return "";
    return icon.startsWith("//") ? "https:" + icon : icon;
}

async function loadLocations() {
    try {
        const res = await fetch(new URL("./locations.json", import.meta.url));
        if (!res.ok) throw new Error("Failed to load locations");
        locationsData = await res.json();
    } catch (e) {
        console.error(e);
        showError("Could not load location list.");
        return;
    }

    const countries = [...new Set(locationsData.map((item) => item.country))].sort();
    countrySelect.innerHTML = '<option value="">Select country</option>';
    countries.forEach((country) => {
        const opt = document.createElement("option");
        opt.value = country;
        opt.textContent = country;
        countrySelect.appendChild(opt);
    });

    citySelect.innerHTML = '<option value="">Select city</option>';
    citySelect.disabled = true;
    searchBtn.disabled = true;
}

function onCountryChange() {
    const country = countrySelect.value;
    citySelect.innerHTML = '<option value="">Select city</option>';
    citySelect.disabled = !country;
    searchBtn.disabled = true;

    if (!country) return;

    const entry = locationsData.find((item) => item.country === country);
    if (!entry || !entry.cities) return;

    entry.cities.forEach((city) => {
        const opt = document.createElement("option");
        opt.value = city;
        opt.textContent = city;
        citySelect.appendChild(opt);
    });
}

function getLocationQuery() {
    const country = countrySelect.value;
    const city = citySelect.value;
    if (!city) return null;
    return country ? `${city}, ${country}` : city;
}

async function runSearch() {
    const location = getLocationQuery();
    if (!location) {
        showError("Please select a country and city.");
        return;
    }

    clearError();
    try {
        const data = await getForecast(location);
        renderCurrent(data);
        renderForecast(data);
        renderAlerts(data);
    } catch (err) {
        showError(err.message || "Could not load forecast.");
    }
}

function onCityChange() {
    searchBtn.disabled = !getLocationQuery();
}

function renderCurrent(data) {
    if (!data || !data.location || !data.current) return;

    const loc = data.location;
    const cur = data.current;
    const cond = cur.condition || {};

    document.getElementById("current-location").textContent = `${loc.name}${loc.region ? ", " + loc.region : ""}, ${loc.country}`;
    document.getElementById("current-datetime").textContent = loc.localtime || "";
    document.getElementById("current-temp").textContent = `${cur.temp_c} °C`;
    document.getElementById("current-condition").textContent = cond.text || "";

    const iconWrap = document.getElementById("current-icon-wrap");
    iconWrap.innerHTML = "";
    if (cond.icon) {
        const img = document.createElement("img");
        img.src = iconUrl(cond.icon);
        img.alt = cond.text || "Weather";
        img.className = "w-16 h-16";
        iconWrap.appendChild(img);
    }

    currentWeather.classList.remove("hidden");
}

function renderForecast(data) {
    if (!data || !data.forecast || !data.forecast.forecastday) return;

    forecastGrid.innerHTML = "";
    const days = data.forecast.forecastday;

    days.forEach((fd) => {
        const day = fd.day || {};
        const cond = day.condition || {};
        const card = document.createElement("div");
        card.className = "rounded-xl bg-white border border-slate-200 shadow-sm p-4 flex flex-col items-center text-center";
        card.innerHTML = `
            <p class="font-medium text-slate-700">${formatDate(fd.date)}</p>
            <img src="${iconUrl(cond.icon)}" alt="${cond.text || ""}" class="w-12 h-12 my-2" />
            <p class="text-sm text-slate-600">${cond.text || ""}</p>
            <p class="text-slate-800 mt-1"><span class="font-semibold">${day.maxtemp_c ?? ""}°</span> / <span>${day.mintemp_c ?? ""}°</span></p>
        `;
        forecastGrid.appendChild(card);
    });

    forecastSection.classList.remove("hidden");
}

function renderAlerts(data) {
    const alerts = data?.alerts?.alert;
    if (!alerts || !Array.isArray(alerts) || alerts.length === 0) {
        alertsSection.classList.add("hidden");
        alertsSection.innerHTML = "";
        return;
    }

    alertsSection.innerHTML = "<strong>Alerts</strong><ul class=\"mt-2 space-y-1 list-disc list-inside\">" +
        alerts.map((a) => `<li>${a.headline || a.event || "Alert"}${a.severity ? " (" + a.severity + ")" : ""}</li>`).join("") +
        "</ul>";
    alertsSection.classList.remove("hidden");
}

countrySelect.addEventListener("change", onCountryChange);
citySelect.addEventListener("change", onCityChange);
searchBtn.addEventListener("click", runSearch);

loadLocations();
