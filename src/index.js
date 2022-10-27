/**
 * Build styles
 */
const Picker = require('./picker');
const { getDefaultColorCache, handleCSSVariables } = require('./picker/utils/main');
require('./index.css').toString();

/**
 * Text Color Tool for Editor.js
 */
class Color {

  /**
   * @param {{api: object}}  - Editor.js API
   */
  constructor({ config, api }) {
    this.api = api;
    this.config = config;
    this.pluginType = this.config.type || 'text';
    this.hasCustomPicker = this.config.customPicker || false;
    this.color = handleCSSVariables(
        getDefaultColorCache(this.config.defaultColor, this.pluginType)
    );

    /**
     * Toolbar Button
     *
     * @type {HTMLElement|null}
     */
    this.button = null;
    /**
     * CSS classes
     */
    this.iconClasses = {
      base: this.api.styles.inlineToolButton,
      active: this.api.styles.inlineToolButtonActive,

    };
  }

  static get localStorageFontKey() {
    return 'editorFontColor';
  }
  /**
   * Specifies Tool as Inline Toolbar Tool
   *
   * @return {boolean}
   */
  static get isInline() {
    return true;
  }

  /**
   * Create button element for Toolbar
   *
   * @return {HTMLElement}
   */
  render() {
    const _this = this;
    this.button = document.createElement('button');
    this.button.type = 'button';
    this.button.classList.add('colorPlugin');
    this.button.classList.add(this.iconClasses.base);
    const colorPicker = new Picker.ColorPlugin({
      onColorPicked: function (value) {
        _this.color = value;
        _this.setColorInLocalStorage(value)
        },
      hasCustomPicker: this.hasCustomPicker,
      defaultColor: this.config.defaultColor,
      colorCollections: this.config.colorCollections.concat(_this.getColorsFromLocalStorage()),
      type: this.pluginType
    });

    this.button.appendChild(colorPicker);

    return this.button;
  }

  /**
   * handle selected fragment
   *
   * @param {Range} range - selected fragment
   */
  surround(range) {
    if (this.pluginType === 'marker') {
      document.execCommand('backColor', false, this.color);
    } else {
      document.execCommand('foreColor', false, this.color);
    }
  }

  /**
   * Check and change Term's state for current selection
   */
  checkState() {
  }

  /**
   *
   * @returns {*[]|any}
   * Get list of colors stored in local storage
   */
  getColorsFromLocalStorage() {
    const colorsAsString = localStorage.getItem(Color.localStorageFontKey);
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
  setColorInLocalStorage(color) {
    const currentLocalStorageColors = this.getColorsFromLocalStorage();
    if (currentLocalStorageColors.length === 10) {
      currentLocalStorageColors.pop();
    }
    if (!currentLocalStorageColors.includes(color)) {
      currentLocalStorageColors.unshift(color);
    }
    localStorage.setItem(Color.localStorageFontKey, JSON.stringify(currentLocalStorageColors));
  }

  /**
   * Sanitizer rule
   * @return {{color: {class: string}}}
   */
  static get sanitize() {
    return {
      font: true,
      span: true
    };
  }
}

module.exports = Color;
