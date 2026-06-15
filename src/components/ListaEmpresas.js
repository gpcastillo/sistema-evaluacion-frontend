import React, { useState, useEffect } from 'react';
import { getEmpresas } from '../services/api';

const ListaEmpresas = () => {
    const [empresas, setEmpresas] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        cargarEmpresas();
    }, []);

    const cargarEmpresas = async () => {
        try {
            const response = await getEmpresas();
            setEmpresas(response.data.empresas);
        } catch (error) {
            console.error('Error al cargar empresas:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <div>Cargando empresas...</div>;
    }

    return (
        <div>
            <h2>Lista de Empresas</h2>
            <table border="1" cellPadding="8" cellSpacing="0">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Nombre</th>
                        <th>RUC</th>
                        <th>Fecha Registro</th>
                    </tr>
                </thead>
                <tbody>
                    {empresas.map((empresa) => (
                        <tr key={empresa.id}>
                            <td>{empresa.id}</td>
                            <td>{empresa.nombre}</td>
                            <td>{empresa.ruc}</td>
                            <td>{new Date(empresa.fecha_registro).toLocaleDateString()}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ListaEmpresas;