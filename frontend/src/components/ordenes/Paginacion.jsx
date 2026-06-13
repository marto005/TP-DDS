export function Paginacion({ pagina, totalPaginas, onCambiar }) {
  if (totalPaginas <= 1) return null;

  const paginas = [];
  for (let i = 1; i <= totalPaginas; i++) paginas.push(i);

  return (
    <nav className="mt-3">
      <ul className="pagination pagination-sm justify-content-center mb-0">
        <li className={`page-item ${pagina === 1 ? 'disabled' : ''}`}>
          <button className="page-link" onClick={() => onCambiar(pagina - 1)}>
            <i className="fa-solid fa-chevron-left"></i>
          </button>
        </li>
        {paginas.map(p => (
          <li key={p} className={`page-item ${p === pagina ? 'active' : ''}`}>
            <button className="page-link" onClick={() => onCambiar(p)}>{p}</button>
          </li>
        ))}
        <li className={`page-item ${pagina === totalPaginas ? 'disabled' : ''}`}>
          <button className="page-link" onClick={() => onCambiar(pagina + 1)}>
            <i className="fa-solid fa-chevron-right"></i>
          </button>
        </li>
      </ul>
    </nav>
  );
}
