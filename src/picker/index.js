import './components/xy-popover.js';
import { parseToHSVA, HSVaColor } from './utils/main';
import MARKER from '../picker/components/icon';
const ColorCollections = ['#ff1300','#EC7878','#9C27B0','#673AB7','#3F51B5','#0070FF','#03A9F4','#00BCD4','#4CAF50','#8BC34A','#CDDC39','#FFE500','#FFBF00','#FF9800','#795548','#9E9E9E','#5A5A5A','#FFF'];

class ColorPlugin extends HTMLElement {

    static get observedAttributes() { return ['disabled','dir'] }

    constructor(options) {
        super();
        const shadowRoot = this.attachShadow({ mode: 'open' });
        this.colorCollections = options.colorCollections || ColorCollections;
        this.onColorPicked = options.onColorPicked;
        this.defaulColor = options.defaulColor || '#ff1300';
        this.pluginType = options.type;

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
            height:100%;
        }
        xy-popover:hover {
           cursor: pointer;
        }
        .color-btn {
            border: 1px solid #cab9b9;
            margin: 7px 2px 2px 2px;
            width: 6px;
            height: 6px;
            opacity: 0.9;
            padding: 1px 0 1px 0;
            color: var(--themeColor,#42b983);
            background: var(--themeColor,#42b983);
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
            background:linear-gradient( 45deg, #ddd 25%,transparent 0,transparent 75%,#ddd 0 ),linear-gradient( 45deg, #ddd 25%,transparent 0,transparent 75%,#ddd 0 );
            background-position:0 0,5px 5px;
            background-size:10px 10px;
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
            width: 100%;
            padding-bottom: 0;
            padding-top: 100%;
            border-radius: 4px;
            border: 0;
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
            margin-left: 1px;
            text-shadow: 2px 0 0 #cab9b9;
        }
        </style>
        <section class="color-section">
            <div class="color-fire-btn" id="color-fire-btn">
                ${this.pluginType === 'marker' ? MARKER : 'A' }
            </div>
            <xy-popover id="popover" ${this.dir ? "dir='" + this.dir + "'" : ""}>
                <xy-button class="color-btn" id="color-btn" ${this.disabled ? "disabled" : ""}>_</xy-button>
                <xy-popcon id="popcon">
                    <div class="color-sign" id="colors">${this.colorCollections.map(el => '<button style="background-color:' + el + '" data-color=' + el + '></button>').join('')}</div>
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
        this.colors.addEventListener('click',(ev)=>{
            const item = ev.target.closest('button');
            if(item){
                this.nativeclick = true;
                this.value = item.dataset.color;
                this.onColorPicked(this.value);
            }
        })
        this.value = this.defaultvalue;
    }

    get defaultvalue() {
        return this.defaulColor;
    }

    get value() {
        return this.$value;
    }

    get color() {
        return HSVaColor(...parseToHSVA(this.$value).values);
    }

    get type() {
        return this.getAttribute('type');
    }

    get disabled() {
        return this.getAttribute('disabled')!==null;
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
        this.colorBtn.style.setProperty('--themeColor',value);
        this.$value = value;
        if(this.nativeclick){
            this.nativeclick = false;
            this.dispatchEvent(new CustomEvent('change', {
                detail: {
                    value: this.value,
                    color: this.color
                }
            }));
        } else {
            if(this.colorPane){
                this.colorPane.value = this.value;
            }else{
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
