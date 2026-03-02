export function isAdminRequest(request) {
  const headerPassword = request.headers.get('x-admin-password');
  const queryPassword = new URL(request.url).searchParams.get('password');
  const provided = headerPassword || queryPassword;

  return Boolean(process.env.ADMIN_PASSWORD && provided === process.env.ADMIN_PASSWORD);
}
