/**
 * Build styles
 */
const Picker = require('./picker');
const { getDefaultColorCache } = require('./picker/utils/main');
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
    this.color = getDefaultColorCache(this.config.defaultColor, this.pluginType);

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
      active: this.api.styles.inlineToolButtonActive
    };
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
      onColorPicked: function (value) { _this.color = value; },
      defaultColor: this.config.defaultColor,
      colorCollections: this.config.colorCollections,
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
