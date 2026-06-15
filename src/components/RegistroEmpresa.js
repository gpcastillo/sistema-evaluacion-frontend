import React, { useState } from 'react';
import { crearEmpresa } from '../services/api';

const RegistroEmpresa = ({ onEmpresaCreada }) => {
    const [nombre, setNombre] = useState('');
    const [ruc, setRuc] = useState('');
    const [mensaje, setMensaje] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMensaje('');
        setError('');

        try {
            const response = await crearEmpresa({ nombre, ruc });
            setMensaje(`✅ Empresa "${response.data.empresa.nombre}" creada exitosamente`);
            setNombre('');
            setRuc('');
            if (onEmpresaCreada) onEmpresaCreada();
        } catch (error) {
            setError('❌ Error al crear la empresa');
            console.error(error);
        }
    };

    return (
        <div>
            <h2>Registrar Nueva Empresa</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Nombre:</label>
                    <input
                        type="text"
                        value={nombre}
                        onChange={(e) => setNombre(e.target.value)}
                        required
                        style={{ marginLeft: '10px', padding: '5px', width: '200px' }}
                    />
                </div>
                <div style={{ marginTop: '10px' }}>
                    <label>RUC:</label>
                    <input
                        type="text"
                        value={ruc}
                        onChange={(e) => setRuc(e.target.value)}
                        style={{ marginLeft: '10px', padding: '5px', width: '200px' }}
                    />
                </div>
                <button type="submit" style={{ marginTop: '10px', padding: '8px 20px' }}>
                    Registrar Empresa
                </button>
            </form>
            {mensaje && <p style={{ color: 'green' }}>{mensaje}</p>}
            {error && <p style={{ color: 'red' }}>{error}</p>}
        </div>
    );
};

export default RegistroEmpresa;