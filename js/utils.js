/**
 * Returns random string. Useful for IDs
 * @param {Number} chars - The string length
 * @return {String}
 */
var getRandomId = function(chars) {
  chars = chars || 15;
  return (Math.random() + 1).toString(36).substring(2, chars);
};

/**
 * Returns random item of passed array
 * @para {Array} arr - The array
 * @return {Mixed}
 */    
var getRandomArrayItem = function(arr) {
  return arr[this.getRandomInt(0, arr.length - 1)];
};

/**
 * Returns random number in range min and max
 * @return {Number}
 */
var getRandomInt = function(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

/**
* Applies or overwrites properties from source to target object
* @param {Object} target Gets the properties from the passed source object
* @param {Object} source The source object, which's properties the target object should get
*/
function extend(target, source) {
  for (var property in source) {
    if (source.hasOwnProperty(property)) {
      target[property] = source[property];
    }
  }
}