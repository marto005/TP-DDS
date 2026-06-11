export function Loading({ texto = 'Cargando...' }) {
  return (
    <div className="d-flex justify-content-center align-items-center py-5">
      <div className="spinner-border text-primary me-3" role="status">
        <span className="visually-hidden">Cargando...</span>
      </div>
      <span className="text-muted">{texto}</span>
    </div>
  );
}

export function LoadingInline() {
  return (
    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
  );
}
