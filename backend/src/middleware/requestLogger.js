/**
 * Global Request Logger Middleware
 * Uses res.on('finish') to log HTTP requests, status codes, and response times
 */
const requestLogger = (req, res, next) => {
  const start = Date.now();
  const { method, originalUrl } = req;

  res.on('finish', () => {
    const duration = Date.now() - start;
    const statusCode = res.statusCode;
    const timestamp = new Date().toISOString();

    // Visual formatting based on status code
    let statusText = `${statusCode}`;
    if (statusCode >= 500) {
      statusText = `\x1b[31m${statusCode}\x1b[0m`; // Red
    } else if (statusCode >= 400) {
      statusText = `\x1b[33m${statusCode}\x1b[0m`; // Yellow
    } else if (statusCode >= 300) {
      statusText = `\x1b[36m${statusCode}\x1b[0m`; // Cyan
    } else {
      statusText = `\x1b[32m${statusCode}\x1b[0m`; // Green
    }

    console.log(
      `[${timestamp}] ${method} ${originalUrl} -> ${statusText} (${duration}ms)`
    );
  });

  next();
};

export default requestLogger;
