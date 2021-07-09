# Inview-CSS-Variables

A script to set css variables and data attributes to a dom element if this is visible in the viewport. 

## Demo 
https://mkoeppen.github.io/inview-css-variables/test/index-cjs.html

## Quick start

Download <a href="https://raw.githubusercontent.com/mkoeppen/inview-css-variables/main/build/inview-css-variables.min.js" target="_blank" ref="noopener noreferer">inview-css-variables.min.js</a>

Load script file
```html
<script src="~/static/js/inview-css-variables.min.js"></script>
```

### Via NPM

Install package via NPM
```js
npm install inview-css-variables
```

Import Script
```js
import InViewCssVariables from "inview-css-variables";
```

## Usage

Add class to DOM elements
```html
<div class="m-inview-css"></div>
```

Init after document loaded
```js
new InViewCssVariables()
```

Overwrite default options
```js
new InViewCssVariables({
    baseClass: 'm-inview-css',
    positionTrackClass: 'm-inview-css--track-scroll-position',
    aboveViewportVariable: '--percentage-above-viewport',
    belowViewportVariable: '--percentage-below-viewport',
    inViewportVariable: '--in-view',
})
```

RESULT: 
```html
<div class="m-inview-css" data-is-in-view="true" data-was-in-view="true"></div>
```



### Get position variables
```html
<div class="m-inview-css m-inview-css--track-scroll-position"></div>
```

RESULT:
```html
<div class="m-inview-css" data-is-in-view="true" data-was-in-view="true" style="--percentage-above-viewport:0; --percentage-below-viewport:0.548833; --in-view:0.225583;"></div>
```