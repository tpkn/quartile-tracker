/*!
 * Quartile Tracker, http://tpkn.me/
 */

function videoQuartileTracker(video, trackers){
   if(!(video instanceof Element))  throw new TypeError('Expected a DOM element');
   if(typeof trackers !== 'object') throw new TypeError('Expected an Object');

   var duration = 0;
   var current_time = 0;
   var compare_time = 0;
   var tracker, time, pixel, callback;

   var auto_reset = true;
   var debug_mode = false;

   // Add 'active' prop to each tracker
   reset();


   video.addEventListener('timeupdate', onUpdate);
   video.addEventListener('ended', onEnded);

   function onUpdate(){
      duration = video.duration || 0;
      current_time = video.currentTime || 0;

      for(var i = 0, len = trackers.length; i < len; i++){
         tracker = trackers[i];
         time = tracker.time;

         // Check if the time is specified as a percentage
         if(typeof time === 'string' && time.indexOf('%') === time.length - 1){
            compare_time = current_time / duration * 100;
         }else{
            compare_time = current_time;
         }

         if(compare_time >= parseInt(time) && tracker.active){
            
            pixel = tracker.pixel;
            if(typeof pixel !== 'undefined'){
               callPixel(pixel);
            }

            callback = tracker.callback;
            if(typeof callback == 'function'){
               callback();
            }
            
            // Disable used tracker
            tracker.active = false;

            if(debug_mode) console.log(time, '=>', pixel);
         }
      }
   }

   /**
    * Reset tracker when video ends
    */
   function onEnded(){
      if(auto_reset){
         reset();
      }
   }

   /**
    * Call tracking pixel
    * 
    * @param   {String}  link
    */
   function callPixel(link){
      var image = new Image(); 
      image.src = link; 
      // Delete the image after the pixel has been called
      image.onload = image.onerror = function(){
         image = null;
      };
   }

   /**
    * Reset tracking flags
    */
   function reset(){
      for(var i = 0, len = trackers.length; i < len; i++){
         trackers[i].active = true;
      }

      if(debug_mode) console.log('- reset -');
   }

   /**
    * Stop tracking once and for all
    */
   function destroy(){
      video.removeEventListener('timeupdate', onUpdate);
      video.removeEventListener('ended', onEnded);

      if(debug_mode) console.log('- destroy -');
   }

   /**
    * Show/hide events log
    */
   function debug(){
      debug_mode = !debug_mode;

      console.log('debug:', debug_mode ? 'on' : 'off');
   }

   return { reset: reset, destroy: destroy, debug: debug };
}
