![](https://badgen.net/badge/Editor.js/v2.0/blue)

# Text Color Tool

A simple tool for coloring text-fragments for the [Editor.js](https://editorjs.io).  

![image](https://user-images.githubusercontent.com/51183663/85031683-8d873e80-b1b1-11ea-83d7-50e65dc0f952.png)

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
      colorCollections: ['#ff1300','#EC7878','#9C27B0'],
      defaultColor: '#ff1300',
    }
  },
  
  ...
});
```

## Config Params (optional)

| Field  | Type     | Description      |
| ------ | -------- | ---------------- |
| colorCollections  | `array` | colors available in the palette |
| defaultColor  | `string` | default color |

## Output data

Colored text will be wrapped with a `color` tag with an `color-plugin` class.

```json
{
    "type" : "text",
    "data" : {
        "text" : "sqrt(75 / 3) + <color class='color-plugin'>det([[-1, 2], [3, 1]]) - sin(pi / 4)^2</color>"
    }
}
```

## Credits
UI Built Based on https://github.com/XboxYan/xy-ui by XboxYan
Marker Icon made by <a href="http://www.freepik.com" title="Freepik">Freepik</a> from <a href="https://www.flaticon.com/" title="Flaticon"> www.flaticon.com</a>

## License
[MIT](https://github.com/flaming-cl/editorjs-text-color-plugin/blob/master/LICENSE)
