export function ErrorMsg({ error }) {
  if (!error) return null;

  const mensaje = typeof error === 'string'
    ? error
    : error?.response?.data?.error || error?.message || 'Ocurrió un error inesperado.';

  return (
    <div className="alert alert-danger d-flex align-items-center" role="alert">
      <i className="fa-solid fa-circle-exclamation me-2"></i>
      <span>{mensaje}</span>
    </div>
  );
}

export function SuccessMsg({ mensaje }) {
  if (!mensaje) return null;
  return (
    <div className="alert alert-success d-flex align-items-center" role="alert">
      <i className="fa-solid fa-circle-check me-2"></i>
      <span>{mensaje}</span>
    </div>
  );
}
