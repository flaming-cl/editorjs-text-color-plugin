const TEXT_COLOR_CACHE = 'editor-js-text-color-cache';

/**
 * Convert CSS variables to color string.
 * @param colorValue original value provided by users
 * @returns string color string
 */
export function handleCSSVariables(colorValue) {
    if (isColorVariable(colorValue)) {
        const variableName = extractVariableName(colorValue);
        return getCSSPropertyValue(variableName);
    }
    return colorValue;
}

function extractVariableName(colorValue) {
    const regexResult = /\((.*?)\)/.exec(colorValue);
    if (regexResult) return regexResult[1];
}

function getCSSPropertyValue(variableName) {
    return window.getComputedStyle(document.documentElement).getPropertyValue(variableName);
}

function isColorVariable(colorValue) {
    return isString(colorValue) && colorValue.includes('--');
}

function isString(stringInput) {
    return typeof stringInput === 'string' || stringInput instanceof String;
}

export function throttle(fn, delay) {
    let id;
    return (...args) => {
        if (!id) {
            id = setTimeout(() => {
                fn(...args);
                id = null;
            }, delay)
        }
    }
}

/**
 * Cache the latest text/marker color
 * @param string defaultColor
 * @returns string defaultColor
 */
export function setDefaultColorCache(defaultColor, pluginType) {
    sessionStorage.setItem(`${TEXT_COLOR_CACHE}-${pluginType}`, JSON.stringify(defaultColor));
    return defaultColor;
}

/**
 * Get cached text/marker color
 * @param string defaultColor
 * @returns string cachedDefaultColor/defaultColor
 */
export function getDefaultColorCache(defaultColor, pluginType) {
    const cachedDefaultColor = sessionStorage.getItem(`${TEXT_COLOR_CACHE}-${pluginType}`);
    return cachedDefaultColor ? JSON.parse(cachedDefaultColor) : defaultColor;
}

/**
 * Cache custom color
 * @param string customColor, string pluginType
 */
export function setCustomColorCache(customColor, pluginType) {
    sessionStorage.setItem(`${TEXT_COLOR_CACHE}-${pluginType}-custom`, JSON.stringify(customColor));
}

/**
 * Get cached custom color
 * @param string customColor, string pluginType
 * @returns string cachedCustomColor
 */
export function getCustomColorCache(pluginType) {
    const cachedCustomColor = sessionStorage.getItem(`${TEXT_COLOR_CACHE}-${pluginType}-custom`);
    return cachedCustomColor ? JSON.parse(cachedCustomColor) : null;
}
