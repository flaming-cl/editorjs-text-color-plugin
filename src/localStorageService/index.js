const localStorageFontKey = 'editorFontColor';

/**
 *
 * @returns {string[]}
 * Get list of colors stored in local storage
 */
export const getColorsFromLocalStorage = () => {
    const colorsAsString = localStorage.getItem(localStorageFontKey);
    try {
        if (colorsAsString) {
            return JSON.parse(colorsAsString);
        }
        return [];
    } catch (e) {
        return [];
    }
}

/**
 *
 * @param color {string}
 * @param maxCacheSize {number}
 * Save the color to local storage array of saved colours.
 * We only store up to 10 entries at a time
 */
export const setColorInLocalStorage = (color, maxCacheSize) => {
    const currentLocalStorageColors = getColorsFromLocalStorage();
    if (currentLocalStorageColors.length === maxCacheSize) {
        currentLocalStorageColors.pop();
    }
    if (!currentLocalStorageColors.includes(color)) {
        currentLocalStorageColors.unshift(color);
    }
    localStorage.setItem(localStorageFontKey, JSON.stringify(currentLocalStorageColors));
}