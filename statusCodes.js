export function getStatusMessage(statusCode) {
  switch (statusCode) {
    case 200:
      return 'OK';
    case 400:
      return 'Bad Request';
    case 404:
      return 'Not Found';
    case 401:
      return 'Unauthorized';
    case 405:
      return 'Method Not Allowed';
    case 500:
      return 'Internal Server Error';
  }
  return 'OK';
};
