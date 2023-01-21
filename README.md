![](https://badgen.net/badge/Editor.js/v2.26.4/blue)

# Editor.js Text Color Tool

A simple tool [Demo](https://flaming-cl.github.io/editorPlugin) to color text-fragments for [Editor.js](https://editorjs.io).  

![readme](https://user-images.githubusercontent.com/51183663/213845281-99c84d59-230f-4f15-a8d5-b345b112f1b4.png)

## Installation

### Install via NPM

Get the package

```shell
npm i --save-dev editorjs-text-color-plugin
```

Import the plugin

```javascript
const ColorPlugin = require('editorjs-text-color-plugin');
```

### Load from CDN
```html
<script src="https://cdn.jsdelivr.net/npm/editorjs-text-color-plugin@1.12.1/dist/bundle.js"></script>
```

## Usage

Add the plugin to Editor.js: editing the `tools` property in your Editor.js config.

```javascript
var editor = EditorJS({
  ...
  
  tools: {
    ...

    Color: {
      class: ColorPlugin, // if load from CDN, please try: window.ColorPlugin
      config: {
         colorCollections: ['#EC7878','#9C27B0','#673AB7','#3F51B5','#0070FF','#03A9F4','#00BCD4','#4CAF50','#8BC34A','#CDDC39', '#FFF'],
         defaultColor: '#FF1300',
         type: 'text', 
      }     
    },
    Marker: {
      class: ColorPlugin, // if load from CDN, please try: window.ColorPlugin
      config: {
         defaultColor: '#FFBF00',
         type: 'marker',
         icon: `<svg fill="#000000" height="200px" width="200px" version="1.1" id="Icons" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 32 32" xml:space="preserve"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <g> <path d="M17.6,6L6.9,16.7c-0.2,0.2-0.3,0.4-0.3,0.6L6,23.9c0,0.3,0.1,0.6,0.3,0.8C6.5,24.9,6.7,25,7,25c0,0,0.1,0,0.1,0l6.6-0.6 c0.2,0,0.5-0.1,0.6-0.3L25,13.4L17.6,6z"></path> <path d="M26.4,12l1.4-1.4c1.2-1.2,1.1-3.1-0.1-4.3l-3-3c-0.6-0.6-1.3-0.9-2.2-0.9c-0.8,0-1.6,0.3-2.2,0.9L19,4.6L26.4,12z"></path> </g> <g> <path d="M28,29H4c-0.6,0-1-0.4-1-1s0.4-1,1-1h24c0.6,0,1,0.4,1,1S28.6,29,28,29z"></path> </g> </g></svg>`
        }       
    },
  },
  
  ...
});
```

## Config Params (optional)

| Field            | Type      | Description                                                                                                                            |
|------------------|-----------|----------------------------------------------------------------------------------------------------------------------------------------|
| colorCollections | `array`   | Colors available in the palette.   CSS variables, for example var(--main-text-color), are supported                                    |
| defaultColor     | `string`  | Default color (if you do not set up a default color, it will be the first color of your color collections).   CSS variables supported. |
| type             | `string`  | Set the plugin as a marker or a text color tool                                                                                        |
| customPicker     | `boolean` | Whether to show a random color picker in the palette, defaults to `false`.                                                             |
| icon             | `string`  | SVG string to replace default button icons.                                                                                     |

## Output data

Colored text will be wrapped with a `color` tag with an `color-plugin` class.

```json
{
    "type" : "text",
    "data" : {
        "text" : "<font color="#00bcd4">Color</font><span style="background-color: rgb(236, 120, 120);"><font color="#ffffff">Plugin</font></span>."
    },
}
```

## Recent Updates
| Field   | Type        | Description                                                                                                                                                                   |
|---------|-------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| V1.12.1 | Mar-25-2022 | CSS variable Support for colorCollection/defaultColor.   This version supports the newest version of Editor.js (v2.23.2). Previous versions support Editor.js (v2.0)          |
| V1.13.1 | May-1-2022  | Thanks to HaoCherHong's contribution, we add a custom color picker in this version.                                                                                           |
| V2.0.0  | Jan-20-2023 | Add new features: 1. clean applied text/marker color. When the left area of the plugin color turns blue, it means applied color can be cleaned now. 2. Allow customized icons |

## Credits
UI Built Based on https://github.com/XboxYan/xy-ui by XboxYan  

## License
[MIT](https://github.com/flaming-cl/editorjs-text-color-plugin/blob/master/LICENSE)
