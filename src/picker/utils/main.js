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
