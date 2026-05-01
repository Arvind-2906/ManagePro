export const normalizeApiBaseUrl = (value) => {
  if (!value) {
    return '';
  }

  return value.replace(/\/?api\/v1\/?$/i, '').replace(/\/$/, '');
};