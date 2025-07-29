import React, { useState, useEffect, useCallback } from 'react'
import { connect } from 'react-redux'
import MasterLayout from '../MasterLayout';
import TopProgressBar from '../../shared/components/loaders/TopProgressBar';
import { fetchAssistanceCategories } from '../../store/action/assistanceCategoriesAction';
import ReactDataTable from '../../shared/table/ReactDataTable';
import DeleteAssistancesCategory from './DeleteAssistancesCategories';
import CreateAssistanceCategory from './CreateAssistanceCategories';
import EditAssistancesCategory from './EditAssistancesCategories';
import TabTitle from '../../shared/tab-title/TabTitle';
import { getFormattedMessage, placeholderText, getFormattedDate } from '../../shared/sharedMethod';
import ActionButton from '../../shared/action-buttons/ActionButton';
import ErrorBoundary from '../../shared/components/ErrorBoundary';
import { useNavigate } from 'react-router-dom';
import moment from "moment";

const AssistanceCategories = ({
    fetchAssistanceCategories,
    assistanceCategories = [],
    totalRecord,
    isLoading,
    isCallFetchDataApi,
    allConfigData = {}
}) => {
    // Función para cargar categorías de asistencia
    const navigate = useNavigate();
    const [deleteModel, setDeleteModal] = useState(false);
    const [isDelete, setIsDelete] = useState(null);
    const [editModel, setEditModel] = useState(false);
    const [assistanceCategory, setAssistanceCategory] = useState(null);

    const loadAssistanceCategories = useCallback(async (filter = {}) => {
        try {
            console.log('Cargando categorías de asistencia...');
            await fetchAssistanceCategories(filter, true);
            console.log('Categorías de asistencia cargadas exitosamente');
        } catch (error) {
            console.error('Error al cargar categorías de asistencia:', error);
            throw error; // Re-lanzar el error para manejarlo en el componente superior si es necesario
        }
    }, [fetchAssistanceCategories]);

    // Cargar datos iniciales
    useEffect(() => {
        let isMounted = true; // Para evitar actualizaciones de estado después de desmontar el componente

        if (isCallFetchDataApi && isMounted) {
            loadAssistanceCategories({}).catch((error) => {
                if (isMounted) {
                    console.error('Error al cargar categorías de asistencia:', error);
                }
            });
        }

        return () => {
            isMounted = false; // Limpiar el flag al desmontar el componente
        };
    }, [isCallFetchDataApi, loadAssistanceCategories]);

    const handleClose = (item) => {
        setEditModel(!editModel);
        setAssistanceCategory(item);
    };
    const onClickDeleteModel = (isDelete = null) => {
        setDeleteModal(!deleteModel);
        setIsDelete(isDelete);
    };

    const onChange = (filter) => {

        // ✅ Agregar 'created_at' a los campos permitidos
        const allowedSortFields = ['name', 'description', 'is_active', 'created_at', 'updated_at'];

        if (filter.order_by && !allowedSortFields.includes(filter.order_by.replace('-', ''))) {
            const { order_by, ...filteredParams } = filter;
            filter = filteredParams;
            console.warn('Campo de ordenamiento no permitido eliminado:', filter.order_by);
        }

        fetchAssistanceCategories(filter, true);
    };

    const handleSubmitSuccess = () => {
        // Lógica para manejar el éxito del envío
        console.log('Categoría de asistencia guardada exitosamente');
        loadAssistanceCategories({});
    };

    const handleView = (row) => {
        console.log('Ver detalles de la categoría de asistencia:', row);
        navigate(`/assistances-category/${row.id}`);
    };

    const handleEdit = (row) => {
        try {
            console.log('Editar categoría de asistencia:', row);
            setEditModel(true);
            setAssistanceCategory(row);
        } catch (error) {
            console.error('Error al manejar la edición de la categoría de asistencia:', error);
        }
    };

    const handleDelete = (row) => {
        console.log('Eliminar categoría de asistencia:', row);
        setIsDelete(typeof row === 'object' ? row.id : row);
        setDeleteModal(true);
    };

    const itemsValue = (assistanceCategories || []).map((assistanceCategory) => {
        console.log('Procesando categoría de asistencia:', assistanceCategory);
        return {
            // id: assistanceCategory.id,
            // name: assistanceCategory.name,
            // description: assistanceCategory.description,
            // // createdAt: assistanceCategory.createdAt, // ✅ Usar nombres consistentes
            // // updatedAt: assistanceCategory.updatedAt, // ✅ Usar nombres consistentes
            // is_active: assistanceCategory.is_active || true, // ✅ Agregar campo faltante
            // date: getFormattedDate(assistanceCategory.createdAt, allConfigData),
            // time: moment(assistanceCategory?.attributes?.assistanceCategories && assistanceCategory?.attributes?.assistanceCategories[0]?.created_at).format("LT"),

            id: assistanceCategory.id,
            name: assistanceCategory.name || 'No disponible', // Valor por defecto
            description: assistanceCategory.description || 'Sin descripción', // Valor por defecto
            is_active: assistanceCategory.is_active !== undefined ? assistanceCategory.is_active : true,
            date: getFormattedDate(assistanceCategory.createdAt || assistanceCategory.created_at, allConfigData),
            time: moment(assistanceCategory.createdAt || assistanceCategory.created_at).format("LT"),
            createdAt: assistanceCategory.createdAt || assistanceCategory.created_at,
            updatedAt: assistanceCategory.updatedAt || assistanceCategory.updated_at,
        };
    });

    const columns = [
        {
            name: getFormattedMessage('assistancesCategory.table.name'),
            selector: (row) => row.name,
            sortField: 'name',
            sortable: true,
            cell: (row) => (

                <span className='text-primary cursor-pointer' onClick={() => handleView(row)}>
                    {row.name}
                </span>
            )
        },
        {
            name: getFormattedMessage('assistancesCategory.table.description'),
            selector: (row) => row.description,
            sortField: 'description',
            sortable: true,
            cell: (row) => (
                <span className='text-primary cursor-pointer' onClick={() => handleView(row)}>
                    {row.description || 'N/A'}
                </span>
            )
        },
        {
            name: getFormattedMessage('assistancesCategory.table.status'),
            //name: 'Estado',
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
            name: getFormattedMessage('assistancesCategory.table.createdAt'),
            selector: (row) => row.date,
            sortField: 'created_at',
            sortable: true,
            cell: (row) => {
                return (
                    <span className="badge bg-light-info">
                        <div className="mb-1">
                            {row.time}
                        </div>
                        {row.date}
                    </span>
                );
            }
        },
        {
            name: getFormattedMessage('assistancesCategory.table.updatedAt'),
            selector: (row) => row.updatedAt,
            sortField: 'updated_at',
            sortable: true,
            cell: (row) => {
                return (
                    <span className="badge bg-light-info">
                        <div className="mb-1">
                            {row.time}
                        </div>
                        {row.date}
                    </span>
                );
            }
        },
        {
            name: getFormattedMessage("react-data-table.action.column.label"),
            right: true,
            ignoreRowClick: true,
            allowOverflow: true,
            button: true,
            with: '150px',
            cell: (row) => (
                <ActionButton
                    isViewIcon={true}
                    onClickViewDetail={() => handleView(row)}
                    item={row}
                    goToEditProduct={handleEdit}
                    isEditMode={true}
                    onClickDeleteModel={() => handleDelete(row.id)}
                // onClickEdit={() => handleEdit(row)}
                // isDeleteIcon={true}
                // onClickDelete={() => handleDelete(row.id)}
                />
            )
        }
    ];

    return (
        <ErrorBoundary>
            <MasterLayout>
                <TopProgressBar />
                <TabTitle title={placeholderText('assistancesCategory.title')} />

                <ReactDataTable
                    columns={columns}
                    items={itemsValue}
                    onChange={onChange}
                    isLoading={isLoading}
                    AddButton={
                        <CreateAssistanceCategory
                            onSubmitSuccess={handleSubmitSuccess}
                        />
                    }
                    title={getFormattedMessage('assistancesCategory.title')}
                    isCallFetchDataApi={isCallFetchDataApi}
                    totalRows={totalRecord}
                    isUnitFilter
                />

                <EditAssistancesCategory
                    handleClose={handleClose}
                    show={editModel}
                    assistance={assistanceCategory}
                    onSubmitSuccess={handleSubmitSuccess}
                />

                <DeleteAssistancesCategory
                    onClickDeleteModel={onClickDeleteModel}
                    deleteModel={deleteModel}
                    onDelete={isDelete}
                />
            </MasterLayout>
        </ErrorBoundary>
    );
};

const mapStateToProps = (state) => {
    if (!state.assistanceCategory) {
        console.warn('No assistance categories found in state', Object.keys(state));
    }
    return {
        assistanceCategories: state.assistanceCategory?.data || [],
        totalRecord: state.assistanceCategory?.meta?.total || 0,
        isLoading: state.assistanceCategory?.loading || false,
        allConfigData: state.allConfigData || {},
        isCallFetchDataApi: state.isCallFetchDataApi || false,
    };
};

export default connect(mapStateToProps, { fetchAssistanceCategories })(AssistanceCategories);
