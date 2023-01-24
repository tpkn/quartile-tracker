/*
 * Quartile Tracker, http://tpkn.me/
 */
function QuartileTracker(video, trackers) {
   if (!(video instanceof Element)) {
      throw new TypeError('Expected a DOM element');
   }
   if (typeof trackers !== 'object') {
      throw new TypeError('Expected an Object');
   }
   
   let duration = 0;
   let current_time = 0;
   let compare_time = 0;
   let tracker, time, pixel, callback;
   
   let auto_reset = true;
   let debug_mode = false;
   
   // Fix 'onended' event issue when 'loop = true'
   let looped = video.loop;
   if (looped) {
      video.loop = false;
   }
   
   // Add 'active' prop to each tracker
   reset();
   
   video.addEventListener('timeupdate', onUpdate);
   video.addEventListener('ended', onEnded);
   
   function onUpdate() {
      duration = video.duration || 0;
      current_time = video.currentTime || 0;
      
      trace('time:', current_time + 's');
      
      for (let i = 0, len = trackers.length; i < len; i++) {
         tracker = trackers[i];
         if (!tracker.active) {
            continue
         }

         time = tracker.time;
         
         // Check if the time is specified as a percentage
         if (typeof time === 'string' && time.indexOf('%') === time.length - 1) {
            compare_time = current_time / duration * 100;
         } else {
            compare_time = current_time;
         }
         
         if (compare_time >= parseInt(time)) {
            
            pixel = tracker.pixel;
            if (typeof pixel !== 'undefined') {
               callPixel(pixel);
            }
            
            callback = tracker.callback;
            if (typeof callback == 'function') {
               callback();
            }
            
            // Disable used tracker
            tracker.active = false;
            
            trace('tracker (', time, '):', pixel);
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
    *
    * @param   {String}  link
    */
   function callPixel(link) {
      let image = new Image();
      image.src = link;
      // Delete the image after the pixel has been called
      image.onload = image.onerror = function() {
         image = null;
      };
   }
   
   /**
    * Reset tracking flags
    */
   function reset() {
      for (let i = 0, len = trackers.length; i < len; i++) {
         trackers[i].active = true;
      }
      trace('- reset -');
   }
   
   /**
    * Stop tracking once and for all
    */
   function destroy() {
      video.removeEventListener('timeupdate', onUpdate);
      video.removeEventListener('ended', onEnded);
      trace('- destroy -');
   }
   
   /**
    * Show/hide events log
    */
   function debug() {
      debug_mode = !debug_mode;
      trace('debug:', debug_mode ? 'on' : 'off');
   }
   
   /**
    * Console.log wrapper
    */
   function trace() {
      if (debug_mode) {
         console.log(Object.values(arguments).join(' '));
      }
   }
   
   return { reset, destroy, debug };
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
