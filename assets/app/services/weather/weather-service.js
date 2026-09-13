const WMO = {
    0: ['Sereno', 'clear'], 1: ['Prevalentemente sereno', 'partly'], 2: ['Parzialmente nuvoloso', 'partly'], 3: ['Coperto', 'clouds'],
    45: ['Nebbia', 'fog'], 48: ['Nebbia', 'fog'], 51: ['Pioviggine', 'rain'], 53: ['Pioviggine', 'rain'], 55: ['Pioviggine', 'rain'],
    61: ['Pioggia', 'rain'], 63: ['Pioggia', 'rain'], 65: ['Pioggia intensa', 'rain'], 66: ['Pioggia gelata', 'rain'], 67: ['Pioggia gelata', 'rain'],
    71: ['Neve', 'snow'], 73: ['Neve', 'snow'], 75: ['Neve intensa', 'snow'], 77: ['Nevischio', 'snow'], 80: ['Rovesci', 'rain'], 81: ['Rovesci', 'rain'], 82: ['Rovesci forti', 'rain'],
    85: ['Rovesci di neve', 'snow'], 86: ['Rovesci di neve', 'snow'], 95: ['Temporale', 'storm'], 96: ['Temporale', 'storm'], 99: ['Temporale', 'storm']
};
export async function fetchWeather(lat, lon) {
    if (!Number.isFinite(+lat) || !Number.isFinite(+lon))
        throw new Error('Coordinate meteo non configurate.');
    const params = new URLSearchParams({ latitude: lat, longitude: lon, current: 'temperature_2m,apparent_temperature,weather_code,wind_speed_10m', daily: 'sunrise,sunset,temperature_2m_max,temperature_2m_min', timezone: 'auto', forecast_days: '2' });
    const response = await fetch(`https://api.open-meteo.com/v1/forecast?${params}`, { cache: 'no-store' });
    if (!response.ok)
        throw new Error(`Meteo non disponibile (${response.status})`);
    const data = await response.json();
    const code = data.current?.weather_code ?? 0;
    const [label, kind] = WMO[code] || ['Condizioni variabili', 'partly'];
    return {
        temperature: Math.round(data.current?.temperature_2m ?? 0), apparent: Math.round(data.current?.apparent_temperature ?? 0),
        wind: Math.round(data.current?.wind_speed_10m ?? 0), code, label, kind,
        min: Math.round(data.daily?.temperature_2m_min?.[0] ?? 0), max: Math.round(data.daily?.temperature_2m_max?.[0] ?? 0),
        sunrise: data.daily?.sunrise?.[0] || '', sunset: data.daily?.sunset?.[0] || '', fetchedAt: Date.now()
    };
}
