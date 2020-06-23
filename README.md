![](https://badgen.net/badge/Editor.js/v2.0/blue)

# Text Color Tool

A simple tool for coloring text-fragments for the [Editor.js](https://editorjs.io).  

![image](https://user-images.githubusercontent.com/51183663/85190761-28853300-b2ee-11ea-9c11-13c3dbdef842.png)

## Installation

### Install via NPM

Get the package

```shell
npm i --save-dev editorjs-text-color-plugin
```

Include module at your application

```javascript
const Color = require('editorjs-text-color-plugin');
```

## Usage

Add a new Tool to the `tools` property of the Editor.js initial config.

```javascript
var editor = EditorJS({
  ...
  
  tools: {
    ...

    Color: {
      class: Color,
      config: {
         colorCollections: ['#FF1300','#EC7878','#9C27B0','#673AB7','#3F51B5','#0070FF','#03A9F4','#00BCD4','#4CAF50','#8BC34A','#CDDC39'],
         defaultColor: '#FF1300',
         type: 'text', 
      }     
    },
    Marker: {
      class: Color,
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

| Field  | Type     | Description      |
| ------ | -------- | ---------------- |
| colorCollections  | `array` | colors available in the palette |
| defaultColor  | `string` | default color |
| type  | `string` | set ths plugin as a marker or a text color tool |

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

<marker class="marker-plugin" style="background: rgb(0, 188, 212);">Plugin</marker>

## Credits
UI Built Based on https://github.com/XboxYan/xy-ui by XboxYan  
Marker Icon made by <a href="http://www.freepik.com" title="Freepik">Freepik</a> from <a href="https://www.flaticon.com/" title="Flaticon"> www.flaticon.com</a>

## License
[MIT](https://github.com/flaming-cl/editorjs-text-color-plugin/blob/master/LICENSE)
