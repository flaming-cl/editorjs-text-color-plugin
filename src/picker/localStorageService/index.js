class LocalStorageService {
    /**
     *
     * @returns {*[]|any}
     * Get list of colors stored in local storage
     */
    static getColorsFromLocalStorage() {
        const colorsAsString = localStorage.getItem(LocalStorageService.localStorageFontKey);
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
     * Save the color to local storage array of saved colours.
     * We only store up to 10 entries at a time
     */
    static setColorInLocalStorage(color) {
        const currentLocalStorageColors = LocalStorageService.getColorsFromLocalStorage();
        if (currentLocalStorageColors.length === 10) {
            currentLocalStorageColors.pop();
        }
        if (!currentLocalStorageColors.includes(color)) {
            currentLocalStorageColors.unshift(color);
        }
        localStorage.setItem(LocalStorageService.localStorageFontKey, JSON.stringify(currentLocalStorageColors));
    }

    static get localStorageFontKey() {
        return 'editorFontColor';
    }
}

export default LocalStorageService;
