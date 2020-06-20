/**
 * Build styles
 */
const Picker = require('./picker');
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
    this.color = this.config.defaultColor;
    this.pluginType = this.config.type || 'text';
    this.tagClassName = this.pluginType === 'marker'
        ? 'marker-plugin'
        : 'color-plugin';

    /**
     * Toolbar Button
     *
     * @type {HTMLElement|null}
     */
    this.button = null;

    /**
     * Tag represented the term
     *
     * @type {string}
     */
    this.tag = this.pluginType === 'marker' ? 'marker' : 'color';


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
    this.button.className = 'text-color-btn';
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
    if (!range) {
      return;
    }

    /**
     * If start or end of selection is in the highlighted block
     */
    this.coloring(range);
  }

  /**
   * color selected fragment (will overwrite existing color tags)
   *
   * @param {Range} range - selected fragment
   */
  coloring(range) {
    /**
     * Create a wrapper for text coloring
     */
    let colorer = document.createElement(this.tag);
    colorer.classList.add(this.tagClassName);
    colorer.appendChild(range.extractContents());

    this.overwriteOldColorTags(colorer);

    if (this.pluginType === 'marker') {
      colorer.style.background = this.color;
    } else {
      colorer.style.color = this.color;
    }

    range.insertNode(colorer);
    /**
     * Expand (add) selection to highlighted block
     */
    this.api.selection.expandToTag(colorer);
  }

  /**
   * overwrite existing color tags
   *
   * @param {HTMLElement} colorer - new color tag
   */
  overwriteOldColorTags(colorer) {
    /**
     * Expand selection to all term-tag
     */
    if (colorer.children.length) {
      colorer.innerHTML = this.pluginType === 'marker'
          ? colorer.innerHTML.replace(/<\/?marker[^>]*>/g,"")
          : colorer.innerHTML.replace(/<\/?color[^>]*>/g,"");
    }
  }

  /**
   * Check and change Term's state for current selection
   */
  checkState() {
    const termTag = this.api.selection.findParentTag(this.tag, this.tagClassName);

    this.button.classList.toggle(this.iconClasses.active, !!termTag);
  }

  /**
   * Sanitizer rule
   * @return {{color: {class: string}}}
   */
  static get sanitize() {
    return {
      color: {
        class: 'color-plugin'
      },
      marker: {
        class: 'marker-plugin'
      }
    };
  }
}

module.exports = Color;
