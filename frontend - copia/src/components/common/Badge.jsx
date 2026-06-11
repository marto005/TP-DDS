export function BadgeEstado({ estado }) {
  const config = {
    abierta:      { bg: 'bg-info text-dark',    icon: 'fa-circle-dot' },
    asignada:     { bg: 'bg-primary text-white', icon: 'fa-user-check' },
    en_proceso:   { bg: 'bg-warning text-dark',  icon: 'fa-spinner' },
    resuelta:     { bg: 'bg-success text-white', icon: 'fa-circle-check' },
    cancelada:    { bg: 'bg-secondary text-white', icon: 'fa-ban' },
  };
  const { bg, icon } = config[estado] || { bg: 'bg-light text-dark', icon: 'fa-question' };
  const label = estado?.replace('_', ' ') || 'desconocido';

  return (
    <span className={`badge badge-estado ${bg}`}>
      <i className={`fa-solid ${icon} me-1`}></i>
      {label}
    </span>
  );
}

export function BadgePrioridad({ prioridad }) {
  const config = {
    baja:    'bg-light text-secondary border',
    media:   'bg-info text-dark',
    alta:    'bg-orange text-dark',
    urgente: 'bg-danger text-white',
  };
  // Orange no existe en Bootstrap, usamos inline
  const inlineStyle = prioridad === 'alta' ? { background: '#fd7e14', color: '#fff' } : {};
  const cls = prioridad === 'alta'
    ? 'badge badge-prioridad'
    : `badge badge-prioridad ${config[prioridad] || ''}`;

  return (
    <span className={cls} style={inlineStyle}>
      {prioridad === 'urgente' && <i className="fa-solid fa-triangle-exclamation me-1"></i>}
      {prioridad || '-'}
    </span>
  );
}

export function BadgeCriticidad({ criticidad }) {
  const config = {
    baja:  'bg-success-subtle text-success',
    media: 'bg-warning-subtle text-warning',
    alta:  'bg-danger-subtle text-danger',
  };
  return (
    <span className={`badge ${config[criticidad] || 'bg-light text-dark'}`}>
      {criticidad || '-'}
    </span>
  );
}
