![](https://badgen.net/badge/Editor.js/v2.0/blue)

# Text Color Tool

A simple tool [Demo](https://flaming-cl.github.io/editorPlugin) to color text-fragments for [Editor.js](https://editorjs.io).  

![image](https://user-images.githubusercontent.com/51183663/85190761-28853300-b2ee-11ea-9c11-13c3dbdef842.png)

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
<script src="https://cdn.jsdelivr.net/npm/editorjs-text-color-plugin@1.1.4/dist/bundle.js"></script>
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
      }       
    },
  },
  
  ...
});
```

## Config Params (optional)

| Field  | Type     | Description                                                                                       |
| ------ | -------- |---------------------------------------------------------------------------------------------------|
| colorCollections  | `array` | Colors available in the palette. CSS variables, for example var(--main-text-color), are supported |
| defaultColor  | `string` | Default color. CSS variables supported.                                                           |
| type  | `string` | Set the plugin as a marker or a text color tool                                                   |

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
| Field  | Type        | Description                                           |
|--------|-------------|-------------------------------------------------------|
| V1.1.5 | Mar-25-2022 | CSS variable Support for colorCollection/defaultColor |

## Credits
UI Built Based on https://github.com/XboxYan/xy-ui by XboxYan  
Marker Icon made by <a href="http://www.freepik.com" title="Freepik">Freepik</a> from <a href="https://www.flaticon.com/" title="Flaticon"> www.flaticon.com</a>

## License
[MIT](https://github.com/flaming-cl/editorjs-text-color-plugin/blob/master/LICENSE)
