![](https://badgen.net/badge/Editor.js/v2.26.4/blue)

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
      }       
    },
  },
  
  ...
});
```

## Config Params (optional)

| Field  | Type     | Description                                                                                                                            |
| ------ | -------- |----------------------------------------------------------------------------------------------------------------------------------------|
| colorCollections  | `array` | Colors available in the palette.   CSS variables, for example var(--main-text-color), are supported                                    |
| defaultColor  | `string` | Default color (if you do not set up a default color, it will be the first color of your color collections).   CSS variables supported. |
| type  | `string` | Set the plugin as a marker or a text color tool                                                                                        |
| customPicker  | `boolean` | Whether to show a custom color picker in the palette, defaults to `false`.                                                                                        |

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
| Field   | Type        | Description                                                                                                                                                                                                         |
|---------|-------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| V1.12.1 | Mar-25-2022 | CSS variable Support for colorCollection/defaultColor.   This version supports the newest version of Editor.js (v2.23.2). Previous versions support Editor.js (v2.0)                                                |
| V1.13.1 | May-1-2022  | Thanks to HaoCherHong's contribution, we add a custom color picker in this version.                                                                                                                                 |
| V1.2.0  | Jan-20-2023 | Add new feature: clean selected text/marker color. Note: this version is compatible with the latest Editor.js V2.26.4. If you found your marker text is not exported, you need to update Editor.js to support that. |

## Credits
UI Built Based on https://github.com/XboxYan/xy-ui by XboxYan  

## License
[MIT](https://github.com/flaming-cl/editorjs-text-color-plugin/blob/master/LICENSE)
