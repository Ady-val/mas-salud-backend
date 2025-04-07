export const HTTP_MESSAGES = {
  CLIENT_ERROR: {
    NO_TOKEN_PROVIDED: 'No token provided',
    INVALID_TOKEN: 'Invalid token',
    INVALID_SESSION: 'Invalid session',
    INVALID_CREDENTIALS: 'Invalid credentials',
    NOT_FOUND: 'Not found',
  },
  SERVER_ERROR: {
    INTERNAL_SERVER_ERROR: 'Internal server error',
    INVALID_REQUEST: 'Invalid request',
  },
  BENEFICIARIES_ERROR: {
    CURP_EXISTS: 'Beneficiary with this CURP already exists',
    CURP_NOT_FOUND: 'Beneficiary with this CURP not found',
  },
  PRODUCTS_ERROR: {
    ALREADY_EXISTS: 'Product already exists',
    NOT_FOUND: 'Product not found',
  },
};
