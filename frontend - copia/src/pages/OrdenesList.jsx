import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Layout } from '../components/Layout';
import { OrdenFiltros } from '../components/ordenes/OrdenFiltros';
import { OrdenTabla } from '../components/ordenes/OrdenTabla';
import { Paginacion } from '../components/ordenes/Paginacion';
import { Loading } from '../components/common/Loading';
import { ErrorMsg } from '../components/common/ErrorMsg';
import { ordenesService } from '../services/ordenesService';
import { activosService } from '../services/activosService';

export function OrdenesList() {
  const { esAdmin, esSolicitante } = useAuth();
  const [resultado, setResultado] = useState({ ordenes: [], total: 0, pagina: 1, totalPaginas: 1 });
  const [activos, setActivos] = useState([]);
  const [tecnicos, setTecnicos] = useState([]);
  const [filtros, setFiltros] = useState({ page: 1, limit: 10, sortBy: 'fechaCreacion', order: 'desc' });
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  // Cargar activos y técnicos una sola vez
  useEffect(() => {
    activosService.listar().then(setActivos).catch(console.error);
  }, []);

  // Cargar órdenes cuando cambien filtros
  const cargarOrdenes = useCallback(async (params) => {
    setCargando(true);
    setError(null);
    try {
      const data = await ordenesService.listar(params);
      setResultado(data);
      // Extraer técnicos únicos de las órdenes para el filtro
      const tecMap = {};
      data.ordenes.forEach(o => {
        if (o.tecnico) tecMap[o.tecnico.id] = o.tecnico;
      });
      if (Object.keys(tecMap).length > 0) {
        setTecnicos(prev => {
          const merged = { ...tecMap };
          prev.forEach(t => { merged[t.id] = t; });
          return Object.values(merged);
        });
      }
    } catch (err) {
      setError(err?.response?.data?.error || 'Error al cargar las órdenes.');
    } finally {
      setCargando(false);
    }
  }, []);

  useEffect(() => {
    cargarOrdenes(filtros);
  }, [filtros, cargarOrdenes]);

  const handleFiltrar = (params) => {
    setFiltros(params);
  };

  const handlePagina = (nuevaPagina) => {
    setFiltros(prev => ({ ...prev, page: nuevaPagina }));
  };

  const puedeCrear = esAdmin() || esSolicitante();

  return (
    <Layout titulo="Órdenes de Mantenimiento">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div>
          <span className="text-muted small">
            {resultado.total} orden{resultado.total !== 1 ? 'es' : ''} encontrada{resultado.total !== 1 ? 's' : ''}
          </span>
        </div>
        {puedeCrear && (
          <Link to="/ordenes/nueva" className="btn btn-primary btn-sm">
            <i className="fa-solid fa-plus me-1"></i>
            Nueva Orden
          </Link>
        )}
      </div>

      <OrdenFiltros
        activos={activos}
        tecnicos={tecnicos}
        onFiltrar={handleFiltrar}
        cargando={cargando}
      />

      <div className="card">
        <div className="card-body p-0">
          {error && (
            <div className="p-3">
              <ErrorMsg error={error} />
            </div>
          )}
          {cargando
            ? <Loading texto="Cargando órdenes..." />
            : <OrdenTabla ordenes={resultado.ordenes} />
          }
        </div>
        {!cargando && (
          <div className="card-footer bg-white py-2">
            <Paginacion
              pagina={resultado.pagina}
              totalPaginas={resultado.totalPaginas}
              onCambiar={handlePagina}
            />
          </div>
        )}
      </div>
    </Layout>
  );
}
