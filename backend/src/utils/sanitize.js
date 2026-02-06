// src/utils/sanitize.js
/**
 * Sanitize user input to prevent NoSQL injection
 * Removes MongoDB operators from input strings
 */

/**
 * Sanitize a single value
 * @param {*} value - Value to sanitize
 * @returns {*} Sanitized value
 */
export const sanitizeValue = (value) => {
  if (typeof value === 'string') {
    // Remove any MongoDB operators
    return value.replace(/^\$/, '');
  }
  
  if (typeof value === 'object' && value !== null) {
    // If it's an object, sanitize recursively
    if (Array.isArray(value)) {
      return value.map(sanitizeValue);
    }
    
    const sanitized = {};
    for (const key in value) {
      // Remove keys that start with $
      if (!key.startsWith('$')) {
        sanitized[key] = sanitizeValue(value[key]);
      }
    }
    return sanitized;
  }
  
  return value;
};

/**
 * Sanitize an object of user inputs
 * @param {Object} input - Object containing user inputs
 * @returns {Object} Sanitized object
 */
export const sanitizeInput = (input) => {
  if (!input || typeof input !== 'object') {
    return input;
  }
  
  const sanitized = {};
  for (const key in input) {
    sanitized[key] = sanitizeValue(input[key]);
  }
  
  return sanitized;
};

/**
 * Sanitize email input
 * @param {string} email - Email to sanitize
 * @returns {string} Sanitized email
 */
export const sanitizeEmail = (email) => {
  if (typeof email !== 'string') {
    return '';
  }
  
  // Remove MongoDB operators and trim
  return email.replace(/^\$/, '').trim().toLowerCase();
};

/**
 * Sanitize username input
 * @param {string} username - Username to sanitize
 * @returns {string} Sanitized username
 */
export const sanitizeUsername = (username) => {
  if (typeof username !== 'string') {
    return '';
  }
  
  // Remove MongoDB operators, trim, and lowercase
  return username.replace(/^\$/, '').trim().toLowerCase();
};

/**
 * Validate and sanitize MongoDB ObjectId
 * @param {string} id - ID to validate
 * @returns {string} Sanitized ID
 */
export const sanitizeObjectId = (id) => {
  if (typeof id !== 'string') {
    return '';
  }
  
  // Only allow alphanumeric characters (valid ObjectId format)
  return id.replace(/[^a-f0-9]/gi, '');
};

export default sanitizeInput;