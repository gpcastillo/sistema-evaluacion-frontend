import React, { useState, useEffect } from 'react';
import './App.css';
import { getEmpresas, crearEmpresa } from './services/api';
import FormularioIRO from './components/FormularioIRO';
import FormularioICI from './components/FormularioICI';

function App() {
    const [empresas, setEmpresas] = useState([]);
    const [empresaSeleccionada, setEmpresaSeleccionada] = useState(null);
    const [nombreEmpresa, setNombreEmpresa] = useState('');
    const [rucEmpresa, setRucEmpresa] = useState('');
    const [cargando, setCargando] = useState(false);

    // Cargar empresas al iniciar
    const cargarEmpresas = async () => {
        setCargando(true);
        try {
            const response = await getEmpresas();
            setEmpresas(response.data.empresas || []);
        } catch (error) {
            console.error('Error al cargar empresas:', error);
            alert('Error al cargar las empresas');
        }
        setCargando(false);
    };

    useEffect(() => {
        cargarEmpresas();
    }, []);

    // Crear nueva empresa
    const handleCrearEmpresa = async (e) => {
        e.preventDefault();
        if (!nombreEmpresa.trim()) {
            alert('El nombre de la empresa es obligatorio');
            return;
        }
        
        setCargando(true);
        try {
            await crearEmpresa({ nombre: nombreEmpresa, ruc: rucEmpresa });
            setNombreEmpresa('');
            setRucEmpresa('');
            await cargarEmpresas();
            alert('✅ Empresa creada exitosamente');
        } catch (error) {
            console.error('Error al crear empresa:', error);
            alert('❌ Error al crear la empresa');
        }
        setCargando(false);
    };

    // Obtener nombre de la empresa seleccionada
    const getEmpresaNombre = () => {
        const empresa = empresas.find(e => e.id === empresaSeleccionada);
        return empresa ? empresa.nombre : '';
    };

    return (
        <div className="App">
            {/* Header */}
            <header style={{ 
                backgroundColor: '#2c3e50', 
                color: 'white', 
                padding: '20px', 
                textAlign: 'center',
                boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
            }}>
                <h1>Sistema de Evaluación de Rendimiento e Innovación</h1>
                <p>Universidad Técnica Particular de Loja</p>
                <p style={{ fontSize: '14px', marginTop: '10px' }}>
                    Índice de Rendimiento Organizacional (IRO) | Índice de Capacidad de Innovación (ICI)
                </p>
            </header>
            
            {/* Main Content */}
            <main style={{ 
                padding: '30px 20px', 
                maxWidth: '1400px', 
                margin: '0 auto',
                fontFamily: 'Arial, sans-serif'
            }}>
                {/* Sección de registro de empresas */}
                <div style={{ 
                    border: '1px solid #ddd', 
                    padding: '25px', 
                    borderRadius: '10px', 
                    marginBottom: '30px',
                    backgroundColor: '#f9f9f9',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                }}>
                    <h2 style={{ marginTop: 0, color: '#2c3e50' }}>🏢 Registrar Nueva Empresa</h2>
                    <form onSubmit={handleCrearEmpresa} style={{ display: 'flex', gap: '15px', alignItems: 'flex-end', flexWrap: 'wrap' }}>
                        <div style={{ flex: 1, minWidth: '200px' }}>
                            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Nombre de la empresa *</label>
                            <input 
                                type="text" 
                                value={nombreEmpresa} 
                                onChange={(e) => setNombreEmpresa(e.target.value)} 
                                placeholder="Ej: Mi Empresa SAC"
                                required 
                                style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }}
                            />
                        </div>
                        <div style={{ flex: 1, minWidth: '150px' }}>
                            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>RUC (opcional)</label>
                            <input 
                                type="text" 
                                value={rucEmpresa} 
                                onChange={(e) => setRucEmpresa(e.target.value)} 
                                placeholder="Ej: 12345678901"
                                style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }}
                            />
                        </div>
                        <button 
                            type="submit" 
                            disabled={cargando}
                            style={{ 
                                padding: '10px 25px', 
                                backgroundColor: '#2c3e50', 
                                color: 'white', 
                                border: 'none', 
                                borderRadius: '5px', 
                                cursor: 'pointer',
                                fontWeight: 'bold'
                            }}
                        >
                            {cargando ? 'Procesando...' : 'Registrar Empresa'}
                        </button>
                    </form>
                </div>

                {/* Sección de selección de empresa */}
                <div style={{ 
                    border: '1px solid #ddd', 
                    padding: '25px', 
                    borderRadius: '10px', 
                    marginBottom: '30px',
                    backgroundColor: '#f9f9f9',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                }}>
                    <h2 style={{ marginTop: 0, color: '#2c3e50' }}>📋 Seleccionar Empresa</h2>
                    {empresas.length === 0 ? (
                        <p style={{ color: '#666' }}>No hay empresas registradas. Crea una empresa para comenzar.</p>
                    ) : (
                        <>
                            <select 
                                onChange={(e) => setEmpresaSeleccionada(parseInt(e.target.value))} 
                                style={{ padding: '10px', width: '100%', maxWidth: '400px', borderRadius: '5px', border: '1px solid #ccc' }}
                                defaultValue=""
                            >
                                <option value="">-- Seleccione una empresa --</option>
                                {empresas.map(emp => (
                                    <option key={emp.id} value={emp.id}>
                                        {emp.nombre} {emp.ruc ? `(RUC: ${emp.ruc})` : ''}
                                    </option>
                                ))}
                            </select>
                            {empresaSeleccionada && (
                                <p style={{ marginTop: '10px', color: '#27ae60' }}>
                                    ✅ Empresa seleccionada: <strong>{getEmpresaNombre()}</strong>
                                </p>
                            )}
                        </>
                    )}
                </div>

                {/* Formularios de evaluación - solo si hay empresa seleccionada */}
                {empresaSeleccionada ? (
                    <>
                        <FormularioIRO 
                            empresaId={empresaSeleccionada} 
                            empresaNombre={getEmpresaNombre()}
                        />
                        <FormularioICI 
                            empresaId={empresaSeleccionada}
                            empresaNombre={getEmpresaNombre()}
                        />
                    </>
                ) : (
                    <div style={{ 
                        textAlign: 'center', 
                        padding: '50px', 
                        backgroundColor: '#f0f0f0', 
                        borderRadius: '10px',
                        color: '#666'
                    }}>
                        <p>🔍 Selecciona una empresa para comenzar la evaluación</p>
                    </div>
                )}
            </main>

            {/* Footer */}
            <footer style={{
                backgroundColor: '#2c3e50',
                color: 'white',
                textAlign: 'center',
                padding: '15px',
                marginTop: '30px',
                fontSize: '12px'
            }}>
                <p>Sistema de Evaluación Empresarial - Trabajo de Titulación</p>
                <p>Ingeniería en Sistemas Informáticos y Computación - UTPL</p>
            </footer>
        </div>
    );
}

export default App;