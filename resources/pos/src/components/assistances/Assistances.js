import React, { useState, useEffect, useCallback } from "react";
import { connect } from "react-redux";
import MasterLayout from "../MasterLayout";
import TopProgressBar from "../../shared/components/loaders/TopProgressBar";
import { fetchAssistances } from "../../store/action/asistancesAction";
import ReactDataTable from "../../shared/table/ReactDataTable";
import DeleteAssistance from "./DeleteAssistances";
import CreateAssistance from "./CreateAssistances";
import EditAssistance from "./EditAssistances";
import TabTitle from "../../shared/tab-title/TabTitle";
import { getFormattedDate, getFormattedMessage, placeholderText, currencySymbolHandling } from "../../shared/sharedMethod";
import ActionButton from "../../shared/action-buttons/ActionButton";
import ErrorBoundary from "../../shared/components/ErrorBoundary";
import { useNavigate } from 'react-router-dom';
import moment from "moment";


const Assistances = ({
    fetchAssistances,
    asistances = [],
    totalRecord,
    isLoading,
    isCallFetchDataApi,
    allConfigData = {}
}) => {
    const navigate = useNavigate();
    const [deleteModel, setDeleteModal] = useState(false);
    const [isDelete, setIsDelete] = useState(null);
    const [editModel, setEditModel] = useState(false);
    const [assistance, setAsistance] = useState(null);

    // Función para cargar datos
    const loadAssistances = useCallback(async (filter = {}) => {
        try {
            console.log('Cargando asistencias...');
            await fetchAssistances(filter, true);
            console.log('Asistencias cargadas exitosamente');
        } catch (error) {
            console.error('Error al cargar asistencias:', error);
        }
    }, [fetchAssistances]);

    // Cargar datos iniciales
    useEffect(() => {
        loadAssistances({});
    }, [loadAssistances]);

    // Recargar cuando sea necesario
    useEffect(() => {
        if (isCallFetchDataApi) {
            loadAssistances({});
        }
    }, [isCallFetchDataApi, loadAssistances]);

    const handleClose = (item) => {
        setEditModel(!editModel);
        setAsistance(item);
    };

    const onClickDeleteModel = (isDelete = null) => {
        setDeleteModal(!deleteModel);
        setIsDelete(isDelete);
    };

    const onChange = (filter) => {
        fetchAssistances(filter, true);
    };

    const formattedPrice = (price) => {
        if (!allConfigData || !allConfigData.value) {
            return price;
        }
        return currencySymbolHandling(
            allConfigData,
            allConfigData.value.currency_symbol,
            price
        );
    };

    const handleSubmitSuccess = () => {
        loadAssistances({});
    };

    const handleView = (row) => {
        console.log('Ver detalles de:', row);
        navigate(`/assistances/${row.id}`);
    };

    const handleEdit = (row) => {
        setAsistance(row);
        setEditModel(true);
    };

    const handleDelete = (id) => {
        setIsDelete(id);
        setDeleteModal(true);
    };

    // Debug: Log de datos recibidos
    console.log('Datos de asistencias en componente:', asistances);
    console.log('Total de registros:', totalRecord);
    console.log('Estado de carga:', isLoading);

    // Procesamiento seguro de los datos
    const itemsValue = (asistances || []).map((assistance) => {
        console.log('Procesando assistance:', assistance);
        return {
            id: assistance.id,
            name: assistance.name || 'N/A',
            code: assistance.code || 'N/A',
            category: assistance.category || 'N/A',
            asistence_cost: formattedPrice(assistance.asistence_cost || 0),
            asistence_price: formattedPrice(assistance.asistence_price || 0),
            asistence_unit: assistance.asistence_unit || 'N/A',
            estimated_duration: assistance.estimated_duration || 'N/A',
            is_active: assistance.is_active || false,
            description: assistance.description || 'N/A',
            notes: assistance.notes || 'N/A',
            date: getFormattedDate(
                assistance?.attributes?.asistances && assistance?.attributes?.asistances[0]?.created_at,
                allConfigData && allConfigData
            ),
            time: moment(assistance?.attributes?.asistances && assistance?.attributes?.asistances[0]?.created_at).format("LT"),
        };
    });

    console.log('Items procesados para la tabla:', itemsValue);

    const columns = [
        {
            name: getFormattedMessage("globally.input.name.label"),
            selector: (row) => row.name,
            sortField: "name",
            sortable: true,
            cell: (row) => (
                <span className="text-primary cursor-pointer" onClick={() => handleView(row)}>
                    {row.name}
                </span>
            )
        },
        {
            name: getFormattedMessage("Codigo"),
            selector: (row) => row.code,
            sortField: "code",
            sortable: true,
            cell: (row) => (
                <span className="badge bg-light-danger">
                    {row.code}
                </span>
            )
        },
        {
            name: 'Categoría',
            selector: (row) => row.category,
            sortField: "category",
            sortable: true,
        },
        {
            name: 'Costo',
            selector: (row) => row.asistence_cost,
            sortField: "asistence_cost",
            sortable: true,
        },
        {
            name: 'Precio',
            selector: (row) => row.asistence_price,
            sortField: "asistence_price",
            sortable: true,
        },
        {
            name: 'Unidad',
            selector: (row) => row.asistence_unit,
            sortField: "asistence_unit",
            sortable: true,
        },
        {
            name: 'Duración',
            selector: (row) => row.estimated_duration,
            sortField: "estimated_duration",
            sortable: true,
            cell: (row) => `${row.estimated_duration} min`
        },
        {
            name: 'Estado',
            selector: (row) => row.is_active,
            sortField: "is_active",
            sortable: true,
            cell: (row) => (
                <span className={`badge bg-${row.is_active ?
                    'success' : 'danger'}`}>
                    {row.is_active ? 'Activo' : 'Inactivo'}
                </span>
            )
        },
        {
            name: getFormattedMessage(
                "globally.react-table.column.created-date.label"
            ),
            selector: (row) => row.date,
            sortField: "created_at",
            sortable: true,
            cell: (row) => {
                return (
                    <span className="badge bg-light-info">
                        <div className="mb-1">{row.time}</div>
                        {row.date}
                    </span>
                );
            },
        },
        {
            name: getFormattedMessage("react-data-table.action.column.label"),
            right: true,
            ignoreRowClick: true,
            allowOverflow: true,
            button: true,
            width: "150px",
            cell: (row) => (
                <ActionButton
                    isViewIcon={true}
                    onClickViewDetail={() => handleView(row)}
                    item={row}
                    goToEditProduct={handleEdit}
                    isEditMode={true}
                    onClickDeleteModel={() => handleDelete(row.id)}
                />
            ),
        },
    ];

    return (
        <ErrorBoundary>
            <MasterLayout>
                <TopProgressBar />
                <TabTitle title={placeholderText("assistances.title")} />

                <ReactDataTable
                    columns={columns}
                    items={itemsValue}
                    onChange={onChange}
                    isLoading={isLoading}
                    AddButton={
                        <CreateAssistance
                            onSubmitSuccess={handleSubmitSuccess}
                        />
                    }
                    title={getFormattedMessage('assistances.title')}
                    isCallFetchDataApi={isCallFetchDataApi}
                    totalRows={totalRecord}
                    isUnitFilter
                />

                <EditAssistance
                    handleClose={handleClose}
                    show={editModel}
                    assistance={assistance}
                    onSubmitSuccess={handleSubmitSuccess}
                />

                <DeleteAssistance
                    onClickDeleteModel={onClickDeleteModel}
                    deleteModel={deleteModel}
                    onDelete={isDelete}
                />
            </MasterLayout>
        </ErrorBoundary>
    );
};

const mapStateToProps = (state) => {
    console.log('🗺️ mapStateToProps - Estado completo:', state);
    console.log('🗺️ mapStateToProps - Estado de asistencias:', state.asistances);
    console.log('🗺️ mapStateToProps - Datos extraídos:', {
        asistances: state.asistances?.data || [],
        totalRecord: state.asistances?.meta?.total || 0,
        isLoading: state.asistances?.loading || false,
    });

    // Verificar si el estado tiene la estructura correcta
    if (!state.asistances) {
        console.warn('⚠️ state.asistances no existe. Nombres de estado disponibles:', Object.keys(state));
    }

    return {
        asistances: state.asistances?.data || [],
        totalRecord: state.asistances?.meta?.total || 0,
        isLoading: state.asistances?.loading || false,
        allConfigData: state.allConfigData || {},
        isCallFetchDataApi: state.isCallFetchDataApi || false
    };
};

export default connect(mapStateToProps, { fetchAssistances })(Assistances);

