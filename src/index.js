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
    this.clickedOnLeft = false;
    this.pluginType = this.config.type || 'text';
    this.parentTag = this.pluginType === 'marker' ? 'MARK' : 'FONT';
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
    this.button = document.createElement('button');
    this.button.type = 'button';
    this.button.classList.add('colorPlugin');
    this.button.classList.add(this.iconClasses.base);
    this.button.appendChild(this.createLeftButton());
    this.button.appendChild(this.createRightButton(this));

    return this.button;
  }

  /**
   * Create left part button
   *
   * @return {HTMLElement}
   */
  createLeftButton() {
    const leftPart = document.createElement('div');
    leftPart.id = 'color-btn';
    leftPart.appendChild(this.createButtonIcon());
    leftPart.addEventListener('click', () => this.clickedOnLeft = true);
    return leftPart;
  }

  /**
   * Create button icon
   *
   * @return {HTMLElement}
   */
  createButtonIcon() {
    const buttonIcon = document.createElement('div');
    buttonIcon.id = 'color-btn-text';
    buttonIcon.innerText = this.pluginType === 'marker' ? '✎' : 'A';
    return buttonIcon;
  }

  /**
   * Create right part button
   *
   * @return {HTMLElement}
   */
  createRightButton(sharedScope) {
    return new Picker.ColorPlugin({
      onColorPicked: function (value) {
        sharedScope.color = value;
      },
      hasCustomPicker: this.hasCustomPicker,
      defaultColor: this.config.defaultColor,
      colorCollections: this.config.colorCollections,
      type: this.pluginType
    });
  }

  /**
   * handle selected fragment
   *
   * @param {Range} range - selected fragment
   */
  surround(range) {
    if (!range) {
      return
    }

    /**
     * clean legacy wrapper generated before editorjs-text-color-plugin v3.0
     */
    const legacySpanWrapper = this.api.selection.findParentTag("SPAN");
    if (legacySpanWrapper) this.unwrap(legacySpanWrapper);

    /**
     * If start or end of selection is in the highlighted block
     */
    const termWrapper = this.api.selection.findParentTag(this.parentTag);

    if (termWrapper) {
      this.unwrap(termWrapper);
    } else {
      this.wrap(range);
    }

    this.clickedOnLeft = false;
  }

  /**
   * Wrap selected fragment
   *
   * @param {Range} range - selected fragment
   * @param {Range} termWrapper - parent of selected fragment
   */
  wrap(range) {
    const selectedText = range.extractContents();
    const newWrapper = document.createElement(this.parentTag);

    newWrapper.appendChild(selectedText);
    range.insertNode(newWrapper);
    if (this.pluginType === 'marker') {
      this.wrapMarker(newWrapper);
    } else {
      this.wrapTextColor(newWrapper);
    }
    this.api.selection.expandToTag(newWrapper);
  }

  /**
   * Wrap selected marker fragment
   *
   * @param newWrapper - wrapper for selected fragment
   */
  wrapMarker(newWrapper) {
    newWrapper.style.backgroundColor = this.color;
    const colorWrapper = this.api.selection.findParentTag('FONT');
    if (colorWrapper) newWrapper.style.color = colorWrapper.style.color;
  }

  /**
   * Wrap selected text color fragment
   *
   * @param {Range} newWrapper - wrapper for selected fragment
   */
  wrapTextColor(newWrapper) {
    newWrapper.style.color = this.color;
  }

  /**
   * Unwrap selected fragment
   *
   * @param {Range} termWrapper - parent of selected fragment
   */
  unwrap(termWrapper) {
    /**
     * Expand selection to all term-tag
     */
    this.api.selection.expandToTag(termWrapper)

    const sel = window.getSelection()
    const range = sel.getRangeAt(0)

    const unwrappedContent = range.extractContents()

    /**
     * Remove empty term-tag
     */
    if (this.clickedOnLeft) {
      this.removeWrapper(termWrapper);
    } else {
      this.updateWrapper(termWrapper);
    }

    /**
     * Insert extracted content
     */
    range.insertNode(unwrappedContent)

    /**
     * Restore selection
     */
    sel.removeAllRanges()
    sel.addRange(range)
  }

  updateWrapper(termWrapper) {
    if (this.pluginType === 'marker') {
      termWrapper.style.backgroundColor = this.color;
    } else {
      termWrapper.style.color = this.color;
    }
  }

  removeWrapper(termWrapper) {
    termWrapper.parentNode.removeChild(termWrapper);
  }

  /**
   * Check and change Term's state for current selection
   */
  checkState() {
    const legacyWrapper = this.api.selection.findParentTag("SPAN");
    const termTag = this.api.selection.findParentTag(this.parentTag);
    let isWrapped = legacyWrapper ? this.handleLegacyWrapper(legacyWrapper, termTag) : termTag;
    this.button.classList.toggle(this.iconClasses.active, !!isWrapped)

    return !!isWrapped;
  }

  /**
   * handle icon active state for legacy wrappers
   */
  handleLegacyWrapper(legacyWrapper, termTag) {
    return this.pluginType === 'marker' ? legacyWrapper : (termTag & legacyWrapper);
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
