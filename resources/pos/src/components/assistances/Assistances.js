import React, { useState, useEffect, useCallback } from "react";
import { connect } from "react-redux";
import MasterLayout from "../MasterLayout";
import TopProgressBar from "../../shared/components/loaders/TopProgressBar";
import { fetchAssistances } from "../../store/action/asistancesAction";
import { fetchAssistanceCategories } from "../../store/action/assistanceCategoriesAction";
import { fetchUnits } from "../../store/action/unitsAction";
import ReactDataTable from "../../shared/table/ReactDataTable";
import DeleteAssistance from "./DeleteAssistances";
import CreateAssistance from "./CreateAssistances";
import EditAssistance from "./EditAssistances";
import AssistanceImageLightBox from "./AssistanceImageLightBox";
import TabTitle from "../../shared/tab-title/TabTitle";
import { getFormattedDate, getFormattedMessage, placeholderText, currencySymbolHandling } from "../../shared/sharedMethod";
import ActionButton from "../../shared/action-buttons/ActionButton";
import ErrorBoundary from "../../shared/components/ErrorBoundary";
import { useNavigate } from 'react-router-dom';
import moment from "moment";


const Assistances = ({
    fetchAssistances,
    fetchAssistanceCategories,
    fetchUnits, // Nueva función
    asistances = [],
    categories = [],
    saleUnits = [], // Nuevo prop
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
    const [isLightboxOpen, setIsLightboxOpen] = useState(false);
    const [lightBoxImages, setLightBoxImages] = useState([]);

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

    // Función para cargar categorías
    const loadCategories = useCallback(async (filter = {}) => {
        try {
            console.log('Cargando categorías...');
            await fetchAssistanceCategories(filter, true);
            console.log('Categorías cargadas exitosamente');
        } catch (error) {
            console.error('Error al cargar categorias:', error);
        }
    }, [fetchAssistanceCategories]);

    // Función para cargar sale units
    const loadSaleUnits = useCallback(async () => {
        try {
            console.log('Cargando sale units...');
            await fetchUnits();
            console.log('Sale units cargadas exitosamente');
        } catch (error) {
            console.error('Error al cargar sale units:', error);
        }
    }, [fetchUnits]);
    // Cargar datos iniciales
    useEffect(() => {
        loadAssistances({});
        loadCategories({});
        loadSaleUnits({}); // Cargar sale units
    }, [loadAssistances, loadCategories, loadSaleUnits]);

    // Recargar cuando sea necesario
    useEffect(() => {
        if (isCallFetchDataApi) {
            loadAssistances({});
            console.log('loadSaleUnits', loadSaleUnits())
        }
        const loadData = async () => {
            try {
                // Cargar sale units si no existen
                if (saleUnits) {
                    console.log('🔄 Cargando sale units...');
                    await fetchUnits({}, true); // Con loading = true
                    console.log("saleUnits", saleUnits)
                } else {
                    console.log('✅ Sale units ya disponibles:', saleUnits.length);
                }

            } catch (error) {
                console.error('❌ Error al cargar datos en modal:', error);
            }
        }
        loadData();
    }, [isCallFetchDataApi, loadAssistances, fetchUnits]);

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
    console.log('Datos de categorías en componente:', categories);
    console.log('Datos de sale units en componente:', saleUnits);
    console.log('Total de registros:', totalRecord);
    console.log('Estado de carga:', isLoading);

    // Función para obtener el nombre de la categoría
    const getCategoryName = (categoryId) => {
        if (!categoryId || !categories || categories.length === 0) {
            return 'Sin categoría';
        }

        const category = categories.find(cat =>
            cat.id === categoryId ||
            cat.id === parseInt(categoryId) ||
            (cat.attributes && cat.attributes.id === categoryId)
        );

        return category ? (category.name || category.attributes?.name || 'Sin nombre') : 'Sin categoría';
    };

    // Función para obtener el nombre de la sale unit
    const getSaleUnitName = (saleUnitId) => {
        // if (!saleUnitId || !saleUnits || saleUnits.length === 0) {
        //     return 'Sin unidad';
        // }
        console.log("saleUnitId==", saleUnitId)
        const saleUnit = saleUnits.find(unit =>
            unit.id === saleUnitId ||
            unit.id === parseInt(saleUnitId)
        );

        return saleUnit ? `${saleUnit.name} (${saleUnit.short_name})` : 'Sin unidad';
    };

    const itemsValue = (asistances || []).map((assistance) => {
        console.log('🔍 Datos completos de assistance:', assistance);

        // ✅ Ahora los datos vienen directamente del reducer procesado
        // Ya no hay structure 'attributes', los datos están en el nivel raíz

        // Obtener image_url directamente
        let imageUrl = assistance.image_url;

        // Si no viene image_url, pero sí image_path, construirla
        if (!imageUrl && assistance.image_path) {
            imageUrl = `http://dist.test/storage/${assistance.image_path}`;
            console.log('🔧 Construyendo image_url desde image_path:', imageUrl);
        }

        console.log('📷 image_url final:', imageUrl);

        return {
            id: assistance.id,
            name: assistance.name || 'N/A',
            code: assistance.code || 'N/A',
            category: getCategoryName(assistance.asistence_category_id),
            asistence_cost: formattedPrice(assistance.asistence_cost || 0),
            asistence_price: formattedPrice(assistance.asistence_price || 0),
            asistence_unit: assistance.asistence_unit || 'N/A',
            sale_unit: getSaleUnitName(assistance.sale_unit),
            estimated_duration: assistance.estimated_duration || 'N/A',
            is_active: assistance.is_active || false,
            description: assistance.description || 'N/A',
            notes: assistance.notes || 'N/A',
            image_url: imageUrl,
            date: getFormattedDate(
                assistance.created_at,
                allConfigData
            ),
            time: moment(assistance.created_at).format("LT"),
        };
    });

    console.log('🔧 Items procesados con image_url:', itemsValue.map(item => ({
        id: item.id,
        name: item.name,
        image_url: item.image_url
    })));

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
            name: 'Imagen',
            selector: (row) => row.image_url,
            sortable: false,
            width: '100px',
            cell: (row) => {
                if (!row.image_url) {
                    return (
                        <div style={{
                            width: '60px',
                            height: '60px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            backgroundColor: '#f8f9fa',
                            borderRadius: '8px',
                            border: '1px solid #dee2e6'
                        }}>
                            <i className="fas fa-image text-muted" style={{ fontSize: '24px' }}></i>
                        </div>
                    );
                }

                return (
                    <div className="d-flex align-items-center">
                        <button
                            type="button"
                            className="btn btn-transparent me-2 d-flex align-items-center justify-content-center p-0"
                            onClick={(e) => {
                                e.stopPropagation();
                                console.log('🔍 Abriendo lightbox para imagen:', row.image_url);
                                setLightBoxImages([row.image_url]);
                                setIsLightboxOpen(true);
                            }}
                            style={{ border: 'none', background: 'transparent' }}
                        >
                            <img
                                src={row.image_url}
                                alt={row.name}
                                style={{
                                    width: '60px',
                                    height: '60px',
                                    objectFit: 'cover',
                                    borderRadius: '8px',
                                    border: '1px solid #dee2e6',
                                    cursor: 'pointer',
                                    transition: 'transform 0.2s ease'
                                }}
                                onMouseEnter={(e) => {
                                    e.target.style.transform = 'scale(1.05)';
                                }}
                                onMouseLeave={(e) => {
                                    e.target.style.transform = 'scale(1)';
                                }}
                                onError={(e) => {
                                    console.error('❌ Error cargando imagen:', row.image_url);
                                    e.target.style.display = 'none';
                                    // Crear placeholder de error
                                    const errorDiv = document.createElement('div');
                                    errorDiv.style.cssText = `
                                width: 60px;
                                height: 60px;
                                display: flex;
                                align-items: center;
                                justify-content: center;
                                background-color: #f8f9fa;
                                border-radius: 8px;
                                border: 1px solid #dee2e6;
                            `;
                                    errorDiv.innerHTML = '<i class="fas fa-exclamation-triangle text-warning" style="font-size: 20px;"></i>';
                                    e.target.parentNode.appendChild(errorDiv);
                                }}
                                onLoad={() => {
                                    console.log('✅ Imagen cargada exitosamente:', row.image_url);
                                }}
                            />
                        </button>
                    </div>
                );
            }
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
            cell: (row) => (
                <span className="badge bg-light-primary">
                    {row.category}
                </span>
            )
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
        // Nueva columna para Sale Unit
        {
            name: 'Unidad de Venta',
            selector: (row) => row.sale_unit,
            sortField: "sale_unit",
            sortable: true,
            cell: (row) => (
                <span className="badge bg-light-success">
                    {row.sale_unit}
                </span>
            )
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
                            categories={categories}
                            saleUnits={saleUnits} // Pasar sale units
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
                    categories={categories}
                    saleUnits={saleUnits} // Pasar sale units
                    onSubmitSuccess={handleSubmitSuccess}
                />

                <DeleteAssistance
                    onClickDeleteModel={onClickDeleteModel}
                    deleteModel={deleteModel}
                    onDelete={isDelete}
                />
            </MasterLayout>
            {isLightboxOpen && lightBoxImages.length > 0 && (
                <AssistanceImageLightBox
                    isOpen={isLightboxOpen}
                    setIsOpen={setIsLightboxOpen}
                    lightBoxImages={lightBoxImages}
                />
            )}
        </ErrorBoundary>
    );
};

const mapStateToProps = (state) => {
    console.log('🗺️ Assistances mapStateToProps:', {
        asistances: state.asistances,
        categories: state.assistanceCategory,
        units: state.units // Array directo
    });

    return {
        asistances: state.asistances?.data || [],
        categories: state.assistanceCategory?.data || [],
        saleUnits: state.units || [], // Array directo
        totalRecord: state.asistances?.meta?.total || 0,
        isLoading: state.asistances?.loading || false,
        allConfigData: state.allConfigData || {},
        isCallFetchDataApi: state.isCallFetchDataApi || false
    };
};
export default connect(mapStateToProps, {
    fetchAssistances,
    fetchAssistanceCategories,
    fetchUnits // Nueva acción
})(Assistances);
