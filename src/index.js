/**
 * Build styles
 */
const Picker = require('./picker');
require('./index.css').toString();

/**
 * Text Color Tool for Editor.js
 */
class Color {

  static get CSS() {
    return 'color-plugin';
  };

  /**
   * @param {{api: object}}  - Editor.js API
   */
  constructor({ config, api }) {
    this.api = api;
    this.color = 'red';
    this.config = config;

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
    this.tag = 'color';

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
      colorCollections: this.config.colorCollections
    });
    this.button.appendChild(colorPicker);
    this.api.listeners.on(this.button, 'click', (ev) => {
      _this.colorBtnClicked = ev.target.id === 'color-fire-btn';
    }, false);
    return this.button;
  }

  /**
   * Coloring selected fragment
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
   * Wrap selection with term-tag
   *
   * @param {Range} range - selected fragment
   */
  coloring(range) {
    /**
     * Create a wrapper for highlighting
     */
    let colorer = document.createElement(this.tag);
    colorer.classList.add(Color.CSS);

    /**
     * SurroundContent throws an error if the Range splits a non-Text node with only one of its boundary points
     * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/Range/surroundContents}
     *
     * // range.surroundContents(span);
     */
    colorer.appendChild(range.extractContents());

    this.unwrap(colorer);

    colorer.style.color = this.color;

    range.insertNode(colorer);
    /**
     * Expand (add) selection to highlighted block
     */
    this.api.selection.expandToTag(colorer);
  }

  /**
   * Unwrap term-tag
   *
   * @param {HTMLElement} termWrapper - term wrapper tag
   */
  unwrap(colorer) {
    /**
     * Expand selection to all term-tag
     */
    if (colorer.children.length) {
      colorer.innerHTML = colorer.innerHTML.replace(/<\/?color[^>]*>/g,"");
    }
  }

  /**
   * Check and change Term's state for current selection
   */
  checkState() {
    const termTag = this.api.selection.findParentTag(this.tag, Color.CSS);

    this.button.classList.toggle(this.iconClasses.active, !!termTag);
  }

  /**
   * Sanitizer rule
   * @return {{color: {class: string}}}
   */
  static get sanitize() {
    return {
      color: {
        class: Color.CSS
      }
    };
  }
}

module.exports = Color;
