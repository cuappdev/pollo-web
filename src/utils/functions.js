export const colName = (n) => {
  var ordA = 'A'.charCodeAt(0);
  var ordZ = 'Z'.charCodeAt(0);
  var len = ordZ - ordA + 1;

  var s = '';
  while(n >= 0) {
    s = String.fromCharCode(n % len + ordA) + s;
    n = Math.floor(n / len) - 1;
  }
  return s;
};

export const uuid = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};