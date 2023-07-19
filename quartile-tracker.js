/*
 * Quartile Tracker, http://tpkn.me/
 */
function QuartileTracker(video, trackers, options = {}) {
   if (!(video instanceof Element)) {
      throw new TypeError('Expected a DOM element');
   }
   if (typeof trackers !== 'object') {
      throw new TypeError('Expected an Object');
   }
   
   let {
      threshold = 1,
      auto_reset = true,
      verbose = false
   } = options;
   
   let duration = 0;
   let current_time = 0;
   let compare_time = 0;
   
   // Fix 'onended' event issue when 'loop = true'
   let looped = video.loop;
   if (looped) {
      video.loop = false;
   }
   
   // Validate and prepare 'optimized' trackers config
   let config = [];
   for (let i = 0, len = trackers.length; i < len; i++) {
      let tracker = Object.assign({}, trackers[i]);
      if (!tracker.hasOwnProperty('time')) {
         throw new Error('[QT] tracker #' + (i + 1) + ' does not have the \'time\' property set!');
      }
      if (!tracker.hasOwnProperty('pixel') && !tracker.hasOwnProperty('callback')) {
         throw new Error('[QT] tracker #' + (i + 1) + ' does not have neither \'pixel\' nor \'callback\' property set!');
      }
      
      let { time, pixel, callback } = tracker;
      
      // Pre-parse possible stringified time and check if its valid number
      let parsed_time = parseFloat(time);
      if (isNaN(parsed_time) || parsed_time < 0) {
         throw new Error('[QT] tracker #' + (i + 1) + ' has invalid time format: unparsable number or it\'s less than 0!');
      }
      
      // Pre-define some flags to avoid unnecessary computations in each call of 'timeupdate' event
      tracker.in_percent = (typeof time === 'string' && time.indexOf('%') === time.length - 1);
      tracker.has_pixel = (typeof pixel === 'string');
      tracker.has_callback = (typeof callback === 'function');
      tracker.time = parsed_time;
      
      config.push(tracker);
   }
   
   video.addEventListener('timeupdate', onUpdate);
   video.addEventListener('ended', onEnded);
   
   function onUpdate() {
      duration = video.duration;
      current_time = video.currentTime;
      
      for (let i = 0, len = config.length; i < len; i++) {
         let tracker = config[i];
         if (tracker.active === false) {
            continue
         }
         
         let {
            time, pixel, callback,
            in_percent, has_pixel, has_callback
         } = tracker;
         
         // Check if the time is specified as a percentage
         if (in_percent && duration > 0) {
            compare_time = current_time / duration * 100;
         } else {
            compare_time = current_time;
         }
         
         if (
            (threshold <= 0 && compare_time >= time) ||
            (threshold > 0 && compare_time >= time && compare_time <= (time + (in_percent ? threshold * 100 / duration : threshold)))
         ) {
            if (has_pixel) {
               callPixel(pixel);
            }
            if (has_callback) {
               callback();
            }
            
            // Disable used tracker
            tracker.active = false;
            
            trace('tracker (' + (time + (in_percent ? '%' : 'sec')) + '):', pixel);
         }
      }
   }
   
   /**
    * Reset tracker when video ends
    */
   function onEnded() {
      if (auto_reset) {
         reset();
      }
      if (looped) {
         video.play();
      }
   }
   
   /**
    * Call tracking pixel
    * @param   {String}  link
    */
   function callPixel(link) {
      let image = new Image();
      image.src = link;
      image.onload = image.onerror = function() {
         image = null;
      };
   }
   
   /**
    * Reset tracking flags
    */
   function reset() {
      for (let i = 0, len = config.length; i < len; i++) {
         config[i].active = true;
      }
      trace('all trackers are reset');
   }
   
   /**
    * Stop tracking once and for all
    */
   function destroy() {
      video.removeEventListener('timeupdate', onUpdate);
      video.removeEventListener('ended', onEnded);
      trace('destroyed');
   }
   
   /**
    * Console.log wrapper
    */
   function trace() {
      if (verbose) {
         console.log('[QT]', Object.values(arguments).join(' '));
      }
   }
   
   return { reset, destroy };
}

if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
   module.exports = QuartileTracker;
} else {
   if (typeof define === 'function' && define.amd) {
      define([], function() {
         return QuartileTracker;
      });
   } else {
      window.QuartileTracker = QuartileTracker;
   }
}
