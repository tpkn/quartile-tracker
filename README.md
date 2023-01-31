# Quartile Tracker
Easy way to track video quartiles

 

## API

```text
new QuartileTracker(video, trackers[, options])
```


### video   
**Type**: _Object_   


### trackers
**Type**: _Array_   

Array of trackers with following options:
- `time` _Number | String_ Can be a seconds or percent
- `pixel` _String_ This link would be called when `time` has come
- `callback` _Function_ Also you can call some callback function


### options
**Type**: _Object_   


### options.auto_rest
**Type**: _Boolean_   
**Default**: `true`   

Reenable all trackers after end of videos




## Methods


### reset()

Reenables all trackers


### debug()

Turns on/off events log



### destroy()




## Usage
```javascript
function someCallback(){
   console.log('yey!');
}

var video = document.getElementById('video');
var trackers = [
   { time: '1s', callback: () => {
      console.log('1s callback');
   }},
   { time: '25%', pixel: 'https://localhost/pixel1.gif' },
   { time: 10, pixel: 'https://localhost/pixel2.gif' },
];

var qt = new QuartileTracker(video, trackers);
qt.debug();
```








