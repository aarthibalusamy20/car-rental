const errorHandler = (err, req, res, next) => {
  // Make statusCode mutable using let instead of const
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal Server Error';

  // Handle specific error types
  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = Object.values(err.errors).map(val => val.message).join(', ');
  } else if (err.name === 'CastError') {
    statusCode = 400;
    message = `Invalid ${err.path}: ${err.value}`;
  } else if (err.code === 11000) {
    statusCode = 409; // Conflict
    const field = Object.keys(err.keyValue)[0];
    message = `Duplicate field value: ${field}. Please use another value.`;
  } else if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Invalid token. Please log in again.';
  } else if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Your token has expired. Please log in again.';
  }

  const errorResponse = {
    success: false,
    error: message,
    ...(process.env.NODE_ENV === 'development' && { 
      stack: err.stack,
      type: err.name,
      path: err.path,
      value: err.value
    })
  };

  // Only log errors in development and production (not in test environment)
  if (process.env.NODE_ENV !== 'test') {
    console.error(`[${new Date().toISOString()}] ${req.method} ${req.path}`, {
      status: statusCode,
      error: message,
      ...(process.env.NODE_ENV === 'development' && { 
        stack: err.stack,
        type: err.name,
        path: err.path,
        value: err.value
      }),
      ...(process.env.NODE_ENV === 'development' && req.body && { body: req.body })
    });
  }

  // Send response
  res.status(statusCode).json(errorResponse);
};

module.exports = errorHandler;