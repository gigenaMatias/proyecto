import { useEffect, useState } from 'react';
import axios from 'axios';
import './styles/bootstrap.min.css';

function ListaPersonas() {
  const [personas, setPersonas] = useState([]);
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [dni, setDni] = useState('');
  const [alerta, setAlerta] = useState({ tipo: '', mensaje: '' });

  const [mostrarModal, setMostrarModal] = useState(false);
  const [modalMensaje, setModalMensaje] = useState('');
  const [personaAEliminar, setPersonaAEliminar] = useState(null);
  const [personaAEditar, setPersonaAEditar] = useState(null);
  const [mostrarModalEdicion, setMostrarModalEdicion] = useState(false);

  const obtenerPersonas = () => {
    axios.get('http://localhost:3001/personas')
      .then(res => setPersonas(res.data))
      .catch(err => console.error(err));
  };

  useEffect(() => {
    obtenerPersonas();
  }, []);

  const mostrarAlerta = (tipo, mensaje) => {
    setAlerta({ tipo, mensaje });
  };

  const mostrarModalMensaje = (mensaje) => {
    setModalMensaje(mensaje);
    setMostrarModal(true);
  };

  const iniciarEdicion = (persona) => {
    setPersonaAEditar(persona);
    setMostrarModalEdicion(true);
  };

  const guardarCambios = () => {
    axios.put(`http://localhost:3001/personas/${personaAEditar.id}`, personaAEditar)
      .then(() => {
        mostrarAlerta('success', '✅ Persona actualizada correctamente');
        setMostrarModalEdicion(false);
        obtenerPersonas();
      })
      .catch((err) => {
        console.error('❌ Error al editar persona:', err);
        mostrarAlerta('danger', '❌ No se pudo actualizar la persona');
      });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    axios.post('http://localhost:3001/personas', {
      nombre,
      apellido,
      dni
    })
    .then(() => {
      setNombre('');
      setApellido('');
      setDni('');
      obtenerPersonas();
      mostrarModalMensaje('✅ Persona agregada correctamente');
    })
    .catch(err => {
      console.error('❌ Error al agregar persona:', err);
      mostrarAlerta('danger', '❌ Hubo un error al agregar la persona');
    });
  };

  const confirmarEliminacion = (id) => {
    axios.delete(`http://localhost:3001/personas/${id}`)
      .then(() => {
        setMostrarModal(false);
        setPersonaAEliminar(null);
        obtenerPersonas();
        mostrarModalMensaje('✅ Persona eliminada correctamente');
      })
      .catch(err => {
        console.error('❌ Error al eliminar:', err);
        mostrarAlerta('danger', '❌ No se pudo eliminar la persona');
      });
  };

  return (
    <div className="container mt-5">
      <h2 className="mb-4">Agregar nueva persona</h2>

      {alerta.mensaje && (
        <div className={`alert alert-${alerta.tipo} alert-dismissible fade show`} role="alert">
          <span className="me-2">
            {alerta.tipo === 'success' ? '✅' : '⚠️'}
          </span>
          {alerta.mensaje}
          <button
            type="button"
            className="btn-close"
            onClick={() => setAlerta({ tipo: '', mensaje: '' })}
            aria-label="Close"
          ></button>
        </div>
      )}

      {mostrarModalEdicion && personaAEditar && (
        <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Editar persona</h5>
                <button type="button" className="btn-close" onClick={() => setMostrarModalEdicion(false)}></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label">Nombre</label>
                  <input
                    type="text"
                    className="form-control"
                    value={personaAEditar.nombre}
                    onChange={(e) => setPersonaAEditar({ ...personaAEditar, nombre: e.target.value })}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Apellido</label>
                  <input
                    type="text"
                    className="form-control"
                    value={personaAEditar.apellido}
                    onChange={(e) => setPersonaAEditar({ ...personaAEditar, apellido: e.target.value })}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">DNI</label>
                  <input
                    type="text"
                    className="form-control"
                    value={personaAEditar.dni}
                    onChange={(e) => setPersonaAEditar({ ...personaAEditar, dni: e.target.value })}
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setMostrarModalEdicion(false)}>Cancelar</button>
                <button className="btn btn-primary" onClick={guardarCambios}>💾 Guardar</button>
              </div>
            </div>
          </div>
        </div>
      )}


      {mostrarModal && (
        <div className="modal fade show d-block" tabIndex="-1" role="dialog" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">{personaAEliminar !== null ? 'Confirmar eliminación' : 'Información'}</h5>
                <button type="button" className="btn-close" onClick={() => {
                  setMostrarModal(false);
                  setPersonaAEliminar(null);
                }}></button>
              </div>
              <div className="modal-body">
                <p>{modalMensaje}</p>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => {
                  setMostrarModal(false);
                  setPersonaAEliminar(null);
                }}>Cerrar</button>

                {personaAEliminar !== null && (
                  <button className="btn btn-danger btn-sm" onClick={() => confirmarEliminacion(personaAEliminar)}>🗑️ Eliminar</button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="row g-3">
        <div className="col-md-4">
          <label className="form-label">Nombre</label>
          <input
            type="text"
            className="form-control"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            required
          />
        </div>
        <div className="col-md-4">
          <label className="form-label">Apellido</label>
          <input
            type="text"
            className="form-control"
            value={apellido}
            onChange={(e) => setApellido(e.target.value)}
            required
          />
        </div>
        <div className="col-md-4">
          <label className="form-label">DNI</label>
          <input
            type="text"
            className="form-control"
            value={dni}
            onChange={(e) => setDni(e.target.value)}
            required
          />
        </div>
        <div className="col-12">
          <button type="submit" className="btn btn-primary">Agregar</button>
        </div>
      </form>

      <h2 className="mt-5">Lista de personas</h2>
      <ul className="list-group mt-3">
        {personas.map(p => (
          <li key={p.id} className="list-group-item d-flex justify-content-between align-items-center">
            <span>
              <strong>{p.nombre} {p.apellido}</strong> - DNI: {p.dni}
            </span>
            <button className="btn btn-warning btn-sm me-2" onClick={() => iniciarEdicion(p)}>✏️ Editar</button>
            <button className="btn btn-danger btn-sm" onClick={() => {
                setPersonaAEliminar(p.id);
                setModalMensaje('¿Estás seguro de que querés eliminar esta persona?');
                setMostrarModal(true);
              }}> 🗑️ Eliminar</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ListaPersonas;

//el chabon se escribia la vida para react y node (?)