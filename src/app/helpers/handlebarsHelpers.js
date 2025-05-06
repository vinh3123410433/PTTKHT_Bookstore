// Helpers for Handlebars templates
const helpers = {
  // Check if an array includes a value
  includes: function(array, value) {
    if (!array) return false;
    return array.includes(value);
  },
  
  // Logical OR helper
  or: function() {
    for (let i = 0; i < arguments.length - 1; i++) {
      if (arguments[i]) {
        return true;
      }
    }
    return false;
  },
  
  // Format date to locale string
  formatDate: function(date) {
    if (!date) return '';
    const d = new Date(date);
    return d.toLocaleDateString('vi-VN');
  },
  
  // Format date value for input fields
  formatDateValue: function(date) {
    if (!date) return '';
    const d = new Date(date);
    return d.toISOString().split('T')[0];
  },
  
  // Equality check
  eq: function(a, b) {
    return a === b;
  }
};

export default helpers;