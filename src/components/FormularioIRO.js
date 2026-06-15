import React, { useState } from 'react';
import { calcularIRO, guardarIRO } from '../services/api';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const FormularioIRO = ({ empresaId, empresaNombre, onResultado }) => {
    const [formData, setFormData] = useState({
        ingresos: '',
        ingresos_anterior: '',
        utilidad: '',
        utilidad_anterior: '',
        csat: '',
        nps: '',
        retencion_clientes: '',
        cumplimiento_plazos: '',
        eficiencia: '',
        indice_calidad: '',
        rotacion_personal: '',
        horas_capacitacion: '',
        compromiso: ''
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
            const response = await calcularIRO({ empresa_id: empresaId, ...formData });
            setResultado(response.data.resultados);
            if (onResultado) onResultado(response.data.resultados);
        } catch (error) {
            console.error('Error:', error);
            alert('Error al calcular IRO');
        }
        setLoading(false);
    };

    const handleGuardar = async () => {
        if (!resultado) {
            alert('Primero calcula el IRO');
            return;
        }
        setGuardando(true);
        try {
            await guardarIRO({ 
                empresa_id: empresaId, 
                ...formData, 
                resultados: resultado 
            });
            alert('✅ Evaluación IRO guardada exitosamente');
        } catch (error) {
            console.error('Error al guardar:', error);
            alert('❌ Error al guardar la evaluación: ' + (error.response?.data?.error || error.message));
        }
        setGuardando(false);
    };

    const generarPDF = () => {
        if (!resultado) {
            alert('Primero calcula el IRO');
            return;
        }

        const doc = new jsPDF();
        
        doc.setFontSize(18);
        doc.text('Informe de Evaluación IRO', 14, 20);
        doc.setFontSize(12);
        doc.text(`Empresa: ${empresaNombre || 'N/A'}`, 14, 35);
        doc.text(`Fecha: ${new Date().toLocaleDateString()}`, 14, 45);
        
        doc.setFontSize(14);
        doc.text('Datos ingresados:', 14, 60);
        
        const datosTabla = [
            ['Ingresos actuales', formData.ingresos || '0'],
            ['Ingresos anterior', formData.ingresos_anterior || '0'],
            ['Utilidad actual', formData.utilidad || '0'],
            ['Utilidad anterior', formData.utilidad_anterior || '0'],
            ['CSAT (1-5)', formData.csat || '0'],
            ['NPS', formData.nps || '0'],
            ['Retención clientes %', formData.retencion_clientes || '0'],
            ['Cumplimiento plazos %', formData.cumplimiento_plazos || '0'],
            ['Eficiencia %', formData.eficiencia || '0'],
            ['Índice calidad %', formData.indice_calidad || '0'],
            ['Rotación personal %', formData.rotacion_personal || '0'],
            ['Horas capacitación', formData.horas_capacitacion || '0'],
            ['Compromiso %', formData.compromiso || '0'],
        ];
        
        autoTable(doc, {
            startY: 70,
            head: [['Indicador', 'Valor']],
            body: datosTabla,
            theme: 'striped',
            headStyles: { fillColor: [41, 128, 185] }
        });
        
        const finalY = doc.lastAutoTable.finalY + 10;
        doc.setFontSize(14);
        doc.text('Resultados del IRO:', 14, finalY);
        
        const resultadosTabla = [
            ['Dimensión Financiera', resultado.dim_financiera],
            ['Dimensión Clientes', resultado.dim_clientes],
            ['Dimensión Procesos', resultado.dim_procesos],
            ['Dimensión Aprendizaje', resultado.dim_aprendizaje],
            ['IRO TOTAL', `${resultado.iro_total} - ${resultado.iro_total >= 70 ? 'Desempeño Excelente' : resultado.iro_total >= 50 ? 'Desempeño Bueno' : 'Desempeño Mejorable'}`]
        ];
        
        autoTable(doc, {
            startY: finalY + 5,
            head: [['Dimensión', 'Puntaje']],
            body: resultadosTabla,
            theme: 'striped',
            headStyles: { fillColor: [46, 204, 113] }
        });
        
        const nombreLimpio = (empresaNombre || 'empresa').replace(/[^a-z0-9]/gi, '_').toLowerCase();
        doc.save(`IRO_${nombreLimpio}_${Date.now()}.pdf`);
    };

    return (
        <div style={{ border: '1px solid #ccc', padding: '20px', margin: '20px 0', borderRadius: '8px' }}>
            <h3>📊 Evaluación IRO - Rendimiento Organizacional</h3>
            <form onSubmit={handleSubmit}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '15px' }}>
                    <div><label><strong>Ingresos actuales:</strong></label><br/><input type="number" name="ingresos" placeholder="Ej: 150000" onChange={handleChange} style={{ width: '100%', padding: '5px' }} required/></div>
                    <div><label><strong>Ingresos anterior:</strong></label><br/><input type="number" name="ingresos_anterior" placeholder="Ej: 100000" onChange={handleChange} style={{ width: '100%', padding: '5px' }}/></div>
                    <div><label><strong>Utilidad actual:</strong></label><br/><input type="number" name="utilidad" placeholder="Ej: 30000" onChange={handleChange} style={{ width: '100%', padding: '5px' }} required/></div>
                    <div><label><strong>Utilidad anterior:</strong></label><br/><input type="number" name="utilidad_anterior" placeholder="Ej: 20000" onChange={handleChange} style={{ width: '100%', padding: '5px' }}/></div>
                    
                    <div><label><strong>CSAT (1-5):</strong></label><br/><input type="number" step="0.1" name="csat" placeholder="Ej: 4.5" onChange={handleChange} style={{ width: '100%', padding: '5px' }}/></div>
                    <div><label><strong>NPS (-100 a 100):</strong></label><br/><input type="number" name="nps" placeholder="Ej: 70" onChange={handleChange} style={{ width: '100%', padding: '5px' }}/></div>
                    <div><label><strong>Retención clientes %:</strong></label><br/><input type="number" name="retencion_clientes" placeholder="Ej: 85" onChange={handleChange} style={{ width: '100%', padding: '5px' }}/></div>
                    <div><label><strong>Cumplimiento plazos %:</strong></label><br/><input type="number" name="cumplimiento_plazos" placeholder="Ej: 90" onChange={handleChange} style={{ width: '100%', padding: '5px' }}/></div>
                    
                    <div><label><strong>Eficiencia %:</strong></label><br/><input type="number" name="eficiencia" placeholder="Ej: 85" onChange={handleChange} style={{ width: '100%', padding: '5px' }}/></div>
                    <div><label><strong>Índice calidad %:</strong></label><br/><input type="number" name="indice_calidad" placeholder="Ej: 95" onChange={handleChange} style={{ width: '100%', padding: '5px' }}/></div>
                    <div><label><strong>Rotación personal %:</strong></label><br/><input type="number" name="rotacion_personal" placeholder="Ej: 10" onChange={handleChange} style={{ width: '100%', padding: '5px' }}/></div>
                    <div><label><strong>Horas capacitación:</strong></label><br/><input type="number" name="horas_capacitacion" placeholder="Ej: 40" onChange={handleChange} style={{ width: '100%', padding: '5px' }}/></div>
                    
                    <div><label><strong>Compromiso %:</strong></label><br/><input type="number" name="compromiso" placeholder="Ej: 85" onChange={handleChange} style={{ width: '100%', padding: '5px' }}/></div>
                </div>
                <div style={{ marginTop: '20px', display: 'flex', gap: '10px' }}>
                    <button type="submit" disabled={loading} style={{ padding: '10px 20px', backgroundColor: '#3498db', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
                        {loading ? 'Calculando...' : 'Calcular IRO'}
                    </button>
                    {resultado && (
                        <>
                            <button type="button" onClick={handleGuardar} disabled={guardando} style={{ padding: '10px 20px', backgroundColor: '#27ae60', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
                                {guardando ? 'Guardando...' : '💾 Guardar Evaluación'}
                            </button>
                            <button type="button" onClick={generarPDF} style={{ padding: '10px 20px', backgroundColor: '#e74c3c', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
                                📄 Generar PDF
                            </button>
                        </>
                    )}
                </div>
            </form>
            {resultado && (
                <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#e8f5e9', borderRadius: '8px' }}>
                    <h4>📈 Resultados IRO</h4>
                    <p><strong>Dimensión Financiera:</strong> {resultado.dim_financiera}</p>
                    <p><strong>Dimensión Clientes:</strong> {resultado.dim_clientes}</p>
                    <p><strong>Dimensión Procesos:</strong> {resultado.dim_procesos}</p>
                    <p><strong>Dimensión Aprendizaje:</strong> {resultado.dim_aprendizaje}</p>
                    <h3>🏆 IRO Total: {resultado.iro_total}</h3>
                </div>
            )}
        </div>
    );
};

export default FormularioIRO;