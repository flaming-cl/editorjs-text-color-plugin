import './components/xy-popover.js';
import MARKER from '../picker/components/icon';
import { handleCSSVariables, setDefaultColorCache, getDefaultColorCache, throttle } from './utils/main';
const ColorCollections = ['#ff1300','#EC7878','#9C27B0','#673AB7','#3F51B5','#0070FF','#03A9F4','#00BCD4','#4CAF50','#8BC34A','#CDDC39','#FFE500','#FFBF00','#FF9800','#795548','#9E9E9E','#5A5A5A','#FFF'];

class ColorPlugin extends HTMLElement {

    static get observedAttributes() { return ['disabled','dir'] }

    constructor(options) {
        super();
        const shadowRoot = this.attachShadow({ mode: 'open' });
        this.colorCollections = options.colorCollections || ColorCollections;
        this.onColorPicked = options.onColorPicked;
        this.defaulColor = handleCSSVariables(options.defaultColor || this.colorCollections[0]);
        this.pluginType = options.type;
        this.hasCustomPicker = options.hasCustomPicker,
        this.customColor = options.customColor;

        shadowRoot.innerHTML = `
        <style>
        :host{
            display:inline-block;
            width:15px;
            font-size:14px;
            border: none;
        }
        :host([block]){
            display:block;
        }

        :host([disabled]){
            pointer-events:none;
        }
        
        :host(:focus-within) xy-popover,:host(:hover) xy-popover{ 
            z-index: 2;
        }
        xy-popover{
            width:100%;
            height:35px;
            margin-right: 3px;
        }
        xy-popover:hover {
            border-radius: 0 5px 5px 0;
            background: rgba(203, 203, 203, 0.49);
        }
        .color-btn {
            border: 1px solid #cab9b9;
            margin: 18px 2px 2px 2px;
            width: 6px;
            height: 6px;
            opacity: 0.9;
            padding: 1px 0 1px 0;
            color: var(--themeColor, #42b983);
            background: var(--themeColor, #42b983);
            font-weight: bolder;
            border-radius: 2px;
        }
        .color-btn:hover {
            opacity: 1;
            z-index: auto;
        }
        xy-popover{
            display:block;
        }
        xy-popcon{
            position: fixed;
            min-width:100%;
        }
        .pop-footer{
            display:flex;
            justify-content:flex-end;
            padding:0 .8em .8em;
        }
        .pop-footer xy-button{
            font-size: .8em;
            margin-left: .8em;
        }
        .color-btn::before{
            content:'';
            position:absolute;
            left:5px;
            top:5px;
            right:5px;
            bottom:5px;
            z-index:-1;
            background: linear-gradient(45deg, #ddd 25%,transparent 0,transparent 75%,#ddd 0 ), linear-gradient(45deg, #ddd 25%, transparent 0, transparent 75%, #ddd 0);
            background-position: 0 0,5px 5px;
            background-size: 10px 10px;
        }
        .color-sign {
           max-width: 220px;
           padding: 10px;
           display:grid;
           cursor: default;
           grid-template-columns: repeat(auto-fit, minmax(15px, 1fr));
           grid-gap: 10px;     
        }
        .color-sign>button {
            position: relative;
            width: 16px;
            height: 16px;
            border-radius: 6px;
            border: 1px solid #b8b9b49e;
            outline: 0;
            opacity: 0.9;
        }
        .color-sign>button:hover {
            cursor: pointer;
            opacity: 1;
        }
        .color-section {
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .color-fire-btn {
            font-size: 17px;
            font-weight: bold;
            height: 28px;
            padding-top: 8px;
            padding-right: 1px;
            margin-left: 3px;
            text-shadow: 2px 0 0 #cab9b9;
            padding-left: 3px;
            border-radius: 5px 0 0 5px;
        }
        .color-fire-btn:hover {
            font-size: 17px;
            font-weight: bold;
            text-shadow: 2px 0 0 #cab9b9;
            background: rgba(203, 203, 203, 0.49);
            border-radius: 5px 0 0 5px;
        }
        .color-fire-btn-text {
            margin-right: 2px;
        }
        </style>
        <section class="color-section">
            <div class="color-fire-btn" id="color-fire-btn">
                ${this.pluginType === 'marker' ? MARKER : '<div class="color-fire-btn-text">A</div>' }
            </div>
            <xy-popover id="popover" ${this.dir ? "dir='" + this.dir + "'" : ""}>
                <xy-button class="color-btn" id="color-btn" ${this.disabled ? "disabled" : ""}>_</xy-button>
                <xy-popcon id="popcon">
                    <div class="color-sign" id="colors">
                        ${this.colorCollections.map(el => '<button style="background-color:' + el + '" data-color=' + el + '></button>').join('')}
                    </div>
                    ${this.hasCustomPicker && (
                        `<div class="color-sign">
                            <button id="custom-picker" />
                        </div>`
                    ) || ''}
                </xy-popcon>
            </xy-popover>
        </section>`;
    }

    focus() {
        this.colorBtn.focus();
    }

    connectedCallback() {
        this.popover = this.shadowRoot.getElementById('popover');
        this.popcon = this.shadowRoot.getElementById('popcon');
        this.colorBtn = this.shadowRoot.getElementById('color-btn');
        this.colors = this.shadowRoot.getElementById('colors');
        this.colors.addEventListener('click',(ev) => {
            const item = ev.target.closest('button');
            if (item) {
                this.nativeclick = true;
                this.value = item.dataset.color;
                this.value = handleCSSVariables(this.value);
                this.onColorPicked(this.value);
            }
        });
        if (this.hasCustomPicker) {
            this.setupCustomPicker();
        }
        this.value = this.defaultvalue;
    }

    disconnectedCallback() {
        if (this.pickerInput) {
            document.body.removeChild(this.pickerInput);
        }
    }

    setupCustomPicker() {
        let isCustomPickerPseudoClick = false;
        this.customPicker = this.shadowRoot.getElementById('custom-picker');
        const customPicker = this.customPicker;
        customPicker.style.backgroundColor = this.customColor;
        this.customPicker.addEventListener('click', (ev) => {
            if (isCustomPickerPseudoClick) {
                isCustomPickerPseudoClick = false;
                return;
            }
            if (this.pickerInput) {
                document.body.removeChild(this.pickerInput);
            }
            this.pickerInput = document.createElement('input');
            const pickerInput = this.pickerInput;
            const rect = customPicker.getBoundingClientRect();
            pickerInput.setAttribute('type', 'color');
            pickerInput.value = this.customColor;
            pickerInput.style.position = 'fixed';
            pickerInput.style.left = `${rect.x}px`;
            pickerInput.style.top = `${rect.y}px`;
            pickerInput.style.pointerEvents = 'none';
            pickerInput.style.zIndex = '1000';
            pickerInput.style.opacity = '0';
            pickerInput.addEventListener('input', throttle(ev => {
                this.nativeclick = true;
                this.value = ev.target.value;
                this.value = handleCSSVariables(this.value);
                this.onColorPicked(this.value);

                customPicker.style.backgroundColor = this.value;
                this.customColor = this.value;

                isCustomPickerPseudoClick = true;
                customPicker.click();
            }, 30))
            document.body.appendChild(pickerInput);
            setTimeout(() => {
                pickerInput.focus();
                pickerInput.click();
            }, 0);
        });
    }

    get defaultvalue() {
        return this.defaulColor;
    }

    get value() {
        return this.$value;
    }

    get type() {
        return this.getAttribute('type');
    }

    get disabled() {
        return this.getAttribute('disabled') !== null;
    }

    get dir() {
        return this.getAttribute('dir');
    }

    set dir(value){
        this.setAttribute('dir', value);
    }

    set disabled(value) {
        if (value === null || value === false) {
            this.removeAttribute('disabled');
        } else {
            this.setAttribute('disabled', '');
        }
    }

    set defaultvalue(value){
        this.setAttribute('defaultvalue', value);
    }

    set value(value) {
        this.$value = value;
        this.colorBtn.style.setProperty(
            '--themeColor',
            this.nativeclick
                ? setDefaultColorCache(value, this.pluginType)
                : getDefaultColorCache(value, this.pluginType)
        );
        if (this.nativeclick) {
            this.nativeclick = false;
            this.dispatchEvent(new CustomEvent('change', {
                detail: {
                    value: this.value,
                }
            }));
        } else {
            if (this.colorPane) {
                this.colorPane.value = this.value;
            } else {
                this.defaultvalue = this.value;
            }
        }
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (name == 'disabled' && this.colorBtn) {
            if (newValue != null) {
                this.colorBtn.setAttribute('disabled', 'disabled');
            } else {
                this.colorBtn.removeAttribute('disabled');
            }
        }
        if (name == 'dir' && this.popover) {
            if (newValue != null) {
                this.popover.dir = newValue;
            }
        }
    }
}

if (!customElements.get('xy-color-picker')) {
    customElements.define('xy-color-picker', ColorPlugin);
}

export {
    ColorPlugin,
}
