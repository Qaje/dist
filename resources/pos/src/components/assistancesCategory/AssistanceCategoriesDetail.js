import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { useParams } from 'react-router-dom';
import { fetchAssistanceDetail } from '../../store/action/asistancesAction';
import MasterLayout from '../MasterLayout';
import TopProgressBar from '../../shared/components/loaders/TopProgressBar';
import { getFormattedDate, currencySymbolHandling } from '../../shared/sharedMethod';

const AssistanceCategoriesDetail = ({ fetchAssistanceCategoryDetail, assistance, isLoading, allConfigData }) => {
    const { id } = useParams();

    useEffect(() => {
        if (id) {
            fetchAssistanceCategoryDetail(id);
        }
    }, [id, fetchAssistanceCategoryDetail]);

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
                    <h2>Detalle de Categoría de Asistencia</h2>
                </div>
                <div className="card-body">
                    <div className="row">
                        <div className="col-md-6">
                            <h4>Información Básica</h4>
                            <p><strong>Nombre:</strong> {assistance.name}</p>
                            <p><strong>Descripción:</strong> {assistance.description}</p>
                            <p><strong>Estado:</strong>
                                <span className={`badge bg-${assistance.is_active ? 'success' : 'danger'}`}>
                                    {assistance.is_active ? 'Activo' : 'Inactivo'}
                                </span>
                            </p>
                        </div>
                        <div className="col-md-6">
                            <h4>Información Adicional</h4>
                            <p><strong>Fecha de Creación:</strong> {getFormattedDate(assistance.createdAt, allConfigData)}</p>
                            <p><strong>Fecha de Actualización:</strong> {getFormattedDate(assistance.updatedAt, allConfigData)}</p>
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

export default connect(mapStateToProps, mapDispatchToProps)(AssistanceCategoriesDetail);
