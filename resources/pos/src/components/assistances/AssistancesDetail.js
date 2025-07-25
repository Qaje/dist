import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { useParams } from 'react-router-dom';
import { fetchAssistanceDetail } from '../../store/action/asistancesAction';
import MasterLayout from '../MasterLayout';
import TopProgressBar from '../../shared/components/loaders/TopProgressBar';
import { getFormattedDate, currencySymbolHandling } from '../../shared/sharedMethod';

const AssistancesDetail = ({ fetchAssistanceDetail, assistance, isLoading, allConfigData }) => {
    const { id } = useParams();

    useEffect(() => {
        if (id) {
            fetchAssistanceDetail(id);
        }
    }, [id, fetchAssistanceDetail]);

    if (isLoading) {
        return <TopProgressBar />;
    }

    if (!assistance) {
        return <div>No se encontró la asistencia</div>;
    }

    return (
        <MasterLayout>
            <div className="card">
                <div className="card-header">
                    <h2>Detalle de Asistencia</h2>
                </div>
                <div className="card-body">
                    <div className="row">
                        <div className="col-md-6">
                            <h4>Información Básica</h4>
                            <p><strong>Nombre:</strong> {assistance.name}</p>
                            <p><strong>Código:</strong> {assistance.code}</p>
                            <p><strong>Categoría:</strong> {assistance.category}</p>
                            <p><strong>Estado:</strong>
                                <span className={`badge bg-${assistance.is_active ? 'success' : 'danger'}`}>
                                    {assistance.is_active ? 'Activo' : 'Inactivo'}
                                </span>
                            </p>
                        </div>
                        <div className="col-md-6">
                            <h4>Información Económica</h4>
                            <p><strong>Costo:</strong> {currencySymbolHandling(allConfigData, allConfigData.value?.currency_symbol, assistance.asistence_cost)}</p>
                            <p><strong>Precio:</strong> {currencySymbolHandling(allConfigData, allConfigData.value?.currency_symbol, assistance.asistence_price)}</p>
                            <p><strong>Unidad:</strong> {assistance.asistence_unit}</p>
                            <p><strong>Duración estimada:</strong> {assistance.estimated_duration} minutos</p>
                        </div>
                    </div>
                    <div className="row mt-3">
                        <div className="col-12">
                            <h4>Descripción</h4>
                            <p>{assistance.description || 'No hay descripción disponible'}</p>
                        </div>
                    </div>
                    <div className="row mt-3">
                        <div className="col-12">
                            <h4>Notas</h4>
                            <p>{assistance.notes || 'No hay notas disponibles'}</p>
                        </div>
                    </div>
                    <div className="row mt-3">
                        <div className="col-12">
                            <p><strong>Fecha de creación:</strong> {getFormattedDate(assistance.created_at, allConfigData)}</p>
                        </div>
                    </div>
                </div>
            </div>
        </MasterLayout>
    );
};

const mapStateToProps = (state) => ({
    assistance: state.asistances.detail,
    isLoading: state.asistances.loading,
    allConfigData: state.allConfigData || {}
});

const mapDispatchToProps = {
    fetchAssistanceDetail
};

export default connect(mapStateToProps, mapDispatchToProps)(AssistancesDetail);
