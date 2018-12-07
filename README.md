# Quartile Tracker
Easy way to track video quartiles



## Installation
```html
<script type="text/javascript" src="quartile-tracker.min.js"></script>
```



## API

new QuartileTracker(video, trackers)


### video   
**Type**: _Object_   


### trackers
**Type**: _Array_   
- `time` _Number | String_ Can be a seconds or percent
- `pixel` _String_ This link would be called when `time` has come
- `callback` _Function_ Also you can call some callback function


### qt.reset()
**Type**: _Function_   
Reenable all trackers


### qt.destroy()
**Type**: _Function_   
Remove all listeners and stop tracking


### qt.debug()
**Type**: _Function_   
Show/hide events log



## Usage
```javascript
function someCallback(){
   console.log('yey!');
}

var video = document.getElementById('video');
var trackers = [
   { time: '1s', callback: someCallback },
   { time: '25%', pixel: 'https://localhost/pixel1.gif' },
   { time: 10, pixel: 'https://localhost/pixel2.gif' },
];

var qt = new QuartileTracker(video, trackers);
qt.debug();
```








