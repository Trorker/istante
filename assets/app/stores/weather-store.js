import { reactive } from '../app/vue.js';
import { readJSON, writeJSON } from '../services/storage/storage.js';
import { fetchWeather } from '../services/weather/weather-service.js';
import { useSettingsStore } from './settings-store.js';
const cached = readJSON('weather-cache', null);
const state = reactive({ data: cached, loading: false, error: '' });
export function useWeatherStore() {
    const refresh = async (force = false) => {
        const s = useSettingsStore().state;
        if (!s.weather || !Number.isFinite(+s.weatherLat) || !Number.isFinite(+s.weatherLon))
            return;
        if (!force && state.data?.fetchedAt && Date.now() - state.data.fetchedAt < 15 * 60 * 1000)
            return;
        state.loading = true;
        state.error = '';
        try {
            state.data = await fetchWeather(+s.weatherLat, +s.weatherLon);
            writeJSON('weather-cache', state.data);
        }
        catch (error) {
            state.error = error.message;
        }
        finally {
            state.loading = false;
        }
    };
    return { state, refresh };
}
