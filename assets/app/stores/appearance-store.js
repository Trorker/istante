import { reactive } from '../app/vue.js';
import { readJSON, writeJSON, readLegacyJSON } from '../services/storage/storage.js';
const legacyPhoto = readLegacyJSON('photo', '');
const state = reactive({
    photo: readJSON('photo', typeof legacyPhoto === 'string' ? legacyPhoto : ''),
    photoName: readJSON('photo-name', '')
});
function validDataUrl(value) {
    return typeof value === 'string' && /^data:image\/(?:jpeg|png|webp);base64,/i.test(value) && value.length <= 12000000;
}
export function useAppearanceStore() {
    const setPhoto = async (file) => {
        if (!file || !/^image\/(jpeg|png|webp)$/i.test(file.type))
            throw new Error('Usa una fotografia JPG, PNG o WEBP.');
        if (file.size > 8 * 1024 * 1024)
            throw new Error('La fotografia non può superare 8 MB.');
        const data = await new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = () => reject(new Error('Non riesco a leggere la fotografia.'));
            reader.readAsDataURL(file);
        });
        if (!validDataUrl(data))
            throw new Error('Formato fotografia non valido.');
        state.photo = data;
        state.photoName = String(file.name || 'fotografia').slice(0, 120);
        writeJSON('photo', state.photo);
        writeJSON('photo-name', state.photoName);
    };
    const clearPhoto = () => {
        state.photo = '';
        state.photoName = '';
        writeJSON('photo', '');
        writeJSON('photo-name', '');
    };
    return { state, setPhoto, clearPhoto };
}
