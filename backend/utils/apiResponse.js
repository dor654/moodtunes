/**
 * Standard API response formatter
 */
class ApiResponse {
  /**
   * Success response
   * @param {*} data - Response data
   * @param {string} message - Success message
   * @param {number} statusCode - HTTP status code
   * @returns {Object} Formatted response
   */
  static success(data = null, message = 'Success', statusCode = 200) {
    return {
      success: true,
      statusCode,
      message,
      data,
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Error response
   * @param {string} message - Error message
   * @param {number} statusCode - HTTP status code
   * @param {*} errors - Detailed errors
   * @returns {Object} Formatted error response
   */
  static error(message = 'Internal Server Error', statusCode = 500, errors = null) {
    return {
      success: false,
      statusCode,
      message,
      errors,
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Validation error response
   * @param {Array} errors - Validation errors
   * @param {string} message - Error message
   * @returns {Object} Formatted validation error response
   */
  static validationError(errors, message = 'Validation failed') {
    return {
      success: false,
      statusCode: 400,
      message,
      errors: errors.map(err => ({
        field: err.path || err.param,
        message: err.msg || err.message,
        value: err.value,
      })),
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Unauthorized response
   * @param {string} message - Error message
   * @returns {Object} Formatted unauthorized response
   */
  static unauthorized(message = 'Unauthorized') {
    return ApiResponse.error(message, 401);
  }

  /**
   * Forbidden response
   * @param {string} message - Error message
   * @returns {Object} Formatted forbidden response
   */
  static forbidden(message = 'Forbidden') {
    return ApiResponse.error(message, 403);
  }

  /**
   * Not found response
   * @param {string} message - Error message
   * @returns {Object} Formatted not found response
   */
  static notFound(message = 'Resource not found') {
    return ApiResponse.error(message, 404);
  }

  /**
   * Conflict response
   * @param {string} message - Error message
   * @returns {Object} Formatted conflict response
   */
  static conflict(message = 'Resource already exists') {
    return ApiResponse.error(message, 409);
  }
}

module.exports = ApiResponse;