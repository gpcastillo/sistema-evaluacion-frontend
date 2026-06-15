import React, { useState } from 'react';
import { calcularICI, guardarICI } from '../services/api';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const FormularioICI = ({ empresaId, empresaNombre, onResultado }) => {
    const [formData, setFormData] = useState({
        ventas_nuevos_productos: '', num_mejoras_productos: '', num_nuevos_servicios: '',
        porcentaje_digitalizacion: '', reduccion_tiempos_operativos: '', adopcion_tecnologias: '',
        nuevos_canales_venta: '', marketing_digital: '', campanas_innovadoras: '',
        horas_capacitacion_innovacion: '', alianzas_universidades: '', cultura_innovadora: ''
    });
    
    const [loading, setLoading] = useState(false);
    const [resultado, setResultado] = useState(null);
    const [guardando, setGuardando] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await calcularICI({ empresa_id: empresaId, ...formData });
            setResultado(response.data.resultados);
            if (onResultado) onResultado(response.data.resultados);
        } catch (error) {
            console.error('Error:', error);
            alert('Error al calcular ICI');
        }
        setLoading(false);
    };

    const handleGuardar = async () => {
        if (!resultado) {
            alert('Primero calcula el ICI');
            return;
        }
        setGuardando(true);
        try {
            await guardarICI({ empresa_id: empresaId, ...formData, resultados: resultado });
            alert('✅ Evaluación ICI guardada exitosamente');
        } catch (error) {
            alert('❌ Error al guardar la evaluación');
        }
        setGuardando(false);
    };

    const generarPDF = () => {
        if (!resultado) {
            alert('Primero calcula el ICI');
            return;
        }

        const doc = new jsPDF();
        
        doc.setFontSize(18);
        doc.text('Informe de Evaluación ICI', 14, 20);
        doc.setFontSize(12);
        doc.text(`Empresa: ${empresaNombre || 'N/A'}`, 14, 35);
        doc.text(`Fecha: ${new Date().toLocaleDateString()}`, 14, 45);
        
        doc.setFontSize(14);
        doc.text('Datos ingresados:', 14, 60);
        
        const datosTabla = [
            ['% ventas productos nuevos', formData.ventas_nuevos_productos || '0'],
            ['N° mejoras productos', formData.num_mejoras_productos || '0'],
            ['N° nuevos servicios', formData.num_nuevos_servicios || '0'],
            ['% digitalización', formData.porcentaje_digitalizacion || '0'],
            ['% reducción tiempos operativos', formData.reduccion_tiempos_operativos || '0'],
            ['% adopción tecnologías', formData.adopcion_tecnologias || '0'],
            ['N° nuevos canales venta', formData.nuevos_canales_venta || '0'],
            ['% marketing digital', formData.marketing_digital || '0'],
            ['N° campañas innovadoras', formData.campanas_innovadoras || '0'],
            ['Horas capacitación innovación', formData.horas_capacitacion_innovacion || '0'],
            ['N° alianzas universidades', formData.alianzas_universidades || '0'],
            ['% cultura innovadora', formData.cultura_innovadora || '0'],
        ];
        
        doc.autoTable({
            startY: 70,
            head: [['Indicador', 'Valor']],
            body: datosTabla,
            theme: 'striped',
            headStyles: { fillColor: [41, 128, 185] }
        });
        
        let finalY = doc.lastAutoTable.finalY + 10;
        doc.setFontSize(14);
        doc.text('Resultados del ICI:', 14, finalY);
        
        const resultadosTabla = [
            ['Innovación Productos/Servicios', resultado.dim_productos],
            ['Innovación Procesos', resultado.dim_procesos],
            ['Innovación Comercial', resultado.dim_comercial],
            ['Innovación Organizacional', resultado.dim_organizacional],
            ['ICI TOTAL', `${resultado.ici_total} - ${resultado.ici_total >= 70 ? 'Capacidad Innovadora Alta' : resultado.ici_total >= 50 ? 'Capacidad Innovadora Media' : 'Capacidad Innovadora Baja'}`]
        ];
        
        doc.autoTable({
            startY: finalY + 5,
            head: [['Dimensión', 'Puntaje']],
            body: resultadosTabla,
            theme: 'striped',
            headStyles: { fillColor: [46, 204, 113] }
        });
        
        doc.save(`ICI_${empresaNombre}_${new Date().toISOString().slice(0,19)}.pdf`);
    };

    return (
        <div style={{ border: '1px solid #ccc', padding: '20px', margin: '20px 0', borderRadius: '8px' }}>
            <h3>💡 Evaluación ICI - Capacidad de Innovación</h3>
            <form onSubmit={handleSubmit}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '15px' }}>
                    <div><label><strong>% ventas productos nuevos:</strong></label><br/><input type="number" name="ventas_nuevos_productos" placeholder="Ej: 65" onChange={handleChange} style={{ width: '100%', padding: '5px' }}/></div>
                    <div><label><strong>N° mejoras productos:</strong></label><br/><input type="number" name="num_mejoras_productos" placeholder="Ej: 8" onChange={handleChange} style={{ width: '100%', padding: '5px' }}/></div>
                    <div><label><strong>N° nuevos servicios:</strong></label><br/><input type="number" name="num_nuevos_servicios" placeholder="Ej: 4" onChange={handleChange} style={{ width: '100%', padding: '5px' }}/></div>
                    <div><label><strong>% digitalización:</strong></label><br/><input type="number" name="porcentaje_digitalizacion" placeholder="Ej: 70" onChange={handleChange} style={{ width: '100%', padding: '5px' }}/></div>
                    
                    <div><label><strong>% reducción tiempos:</strong></label><br/><input type="number" name="reduccion_tiempos_operativos" placeholder="Ej: 30" onChange={handleChange} style={{ width: '100%', padding: '5px' }}/></div>
                    <div><label><strong>% adopción tecnologías:</strong></label><br/><input type="number" name="adopcion_tecnologias" placeholder="Ej: 75" onChange={handleChange} style={{ width: '100%', padding: '5px' }}/></div>
                    <div><label><strong>N° nuevos canales venta:</strong></label><br/><input type="number" name="nuevos_canales_venta" placeholder="Ej: 5" onChange={handleChange} style={{ width: '100%', padding: '5px' }}/></div>
                    <div><label><strong>% marketing digital:</strong></label><br/><input type="number" name="marketing_digital" placeholder="Ej: 80" onChange={handleChange} style={{ width: '100%', padding: '5px' }}/></div>
                    
                    <div><label><strong>N° campañas innovadoras:</strong></label><br/><input type="number" name="campanas_innovadoras" placeholder="Ej: 6" onChange={handleChange} style={{ width: '100%', padding: '5px' }}/></div>
                    <div><label><strong>Horas capacitación innovación:</strong></label><br/><input type="number" name="horas_capacitacion_innovacion" placeholder="Ej: 50" onChange={handleChange} style={{ width: '100%', padding: '5px' }}/></div>
                    <div><label><strong>N° alianzas universidades:</strong></label><br/><input type="number" name="alianzas_universidades" placeholder="Ej: 3" onChange={handleChange} style={{ width: '100%', padding: '5px' }}/></div>
                    <div><label><strong>% cultura innovadora:</strong></label><br/><input type="number" name="cultura_innovadora" placeholder="Ej: 75" onChange={handleChange} style={{ width: '100%', padding: '5px' }}/></div>
                </div>
                <div style={{ marginTop: '20px', display: 'flex', gap: '10px' }}>
                    <button type="submit" disabled={loading} style={{ padding: '10px 20px', backgroundColor: '#3498db', color: 'white', border: 'none', borderRadius: '5px' }}>
                        {loading ? 'Calculando...' : 'Calcular ICI'}
                    </button>
                    {resultado && (
                        <>
                            <button type="button" onClick={handleGuardar} disabled={guardando} style={{ padding: '10px 20px', backgroundColor: '#27ae60', color: 'white', border: 'none', borderRadius: '5px' }}>
                                {guardando ? 'Guardando...' : '💾 Guardar Evaluación'}
                            </button>
                            <button type="button" onClick={generarPDF} style={{ padding: '10px 20px', backgroundColor: '#e74c3c', color: 'white', border: 'none', borderRadius: '5px' }}>
                                📄 Generar PDF
                            </button>
                        </>
                    )}
                </div>
            </form>
            {resultado && (
                <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#e3f2fd', borderRadius: '8px' }}>
                    <h4>📈 Resultados ICI</h4>
                    <p><strong>Innovación Productos:</strong> {resultado.dim_productos}</p>
                    <p><strong>Innovación Procesos:</strong> {resultado.dim_procesos}</p>
                    <p><strong>Innovación Comercial:</strong> {resultado.dim_comercial}</p>
                    <p><strong>Innovación Organizacional:</strong> {resultado.dim_organizacional}</p>
                    <h3>🏆 ICI Total: {resultado.ici_total}</h3>
                </div>
            )}
        </div>
    );
};

export default FormularioICI;