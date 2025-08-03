import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { connect } from 'react-redux';
import { getFormattedMessage } from '../../shared/sharedMethod';
import { addAssistance } from '../../store/action/asistancesAction';
import { fetchAssistanceCategories } from '../../store/action/assistanceCategoriesAction';
import { fetchUnits } from "../../store/action/unitsAction";

const CreateAssistance = ({
    addAssistance,
    onSubmitSuccess,
    categories = [],
    saleUnits = [],
    fetchAssistanceCategories,
    fetchUnits,
    isLoadingUnits = false,
    isLoadingCategories = false,
}) => {
    const [show, setShow] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const { register, handleSubmit, formState: { errors }, reset } = useForm();

    // Debug mejorado
    console.log('🎯 CreateAssistance - Props recibidos:', {
        categories: {
            length: categories?.length,
            isArray: Array.isArray(categories),
            firstItem: categories?.[0]
        },
        saleUnits: {
            length: saleUnits?.length,
            isArray: Array.isArray(saleUnits),
            firstItem: saleUnits?.[0]
        },
        isLoadingCategories,
        isLoadingUnits,
        show
    });

    // useEffect mejorado con mejor manejo de errores
    useEffect(() => {
        if (show) {
            console.log('🚪 Modal abierto - Verificando datos...');

            const loadData = async () => {
                try {
                    // Cargar categorías si no existen
                    if (!categories || categories.length === 0) {
                        console.log('🔄 Cargando categorías...');
                        await fetchAssistanceCategories({});
                    } else {
                        console.log('✅ Categorías ya disponibles:', categories.length);
                    }

                    // Cargar sale units si no existen
                    if (!saleUnits || saleUnits.length === 0) {
                        console.log('🔄 Cargando sale units...');
                        await fetchUnits({}, true); // Con loading = true
                    } else {
                        console.log('✅ Sale units ya disponibles:', saleUnits.length);
                    }

                } catch (error) {
                    console.error('❌ Error al cargar datos en modal:', error);
                }
            };

            loadData();
        }
    }, [show, categories.length, saleUnits.length, fetchAssistanceCategories, fetchUnits]);

    const handleClose = () => {
        reset();
        setShow(false);
    };

    const handleShow = () => {
        console.log('🚪 Abriendo modal...');
        setShow(true);
    };

    const onSubmit = async (data) => {
        setIsLoading(true);
        console.log('📤 Datos RAW del formulario:', data);

        try {
            // Verificar campos obligatorios
            if (!data.name || data.name.trim() === '') {
                throw new Error('El campo name es obligatorio');
            }

            if (!data.code || data.code.trim() === '') {
                throw new Error('El campo code es obligatorio');
            }

            if (!data.asistence_category_id) {
                throw new Error('La categoría es obligatoria');
            }

            if (!data.asistence_price || parseFloat(data.asistence_price) <= 0) {
                throw new Error('El precio es obligatorio y debe ser mayor a 0');
            }

            // Buscar la categoría seleccionada
            const selectedCategory = categories.find(cat =>
                cat.id === parseInt(data.asistence_category_id) ||
                cat.attributes?.id === parseInt(data.asistence_category_id)
            );

            console.log('🔍 Categoría seleccionada:', selectedCategory);

            // Buscar la sale unit seleccionada (si existe)
            const selectedSaleUnit = data.sale_unit ? saleUnits.find(unit =>
                unit.id === parseInt(data.sale_unit)
            ) : null;

            console.log('🔍 Sale unit seleccionada:', selectedSaleUnit);

            // Procesar los datos
            const assistanceData = {
                name: data.name.trim(),
                code: data.code.trim(),
                asistence_category_id: parseInt(data.asistence_category_id),
                asistence_cost: parseFloat(data.asistence_cost) || 0,
                asistence_price: parseFloat(data.asistence_price),
                asistence_unit: data.asistence_unit?.trim() || '1',
                estimated_duration: parseInt(data.estimated_duration) || 0,
                order_tax: parseFloat(data.order_tax) || 0,
                tax_type: data.tax_type || '1',
                description: data.description?.trim() || null,
                notes: data.notes?.trim() || null,
                sale_unit: data.sale_unit ? parseInt(data.sale_unit) : null,
                is_active: Boolean(data.is_active !== false),
                // Incluir información de la categoría si es necesario
                category: selectedCategory ? {
                    id: selectedCategory.id || selectedCategory.attributes?.id,
                    name: selectedCategory.name || selectedCategory.attributes?.name
                } : null
            };

            console.log('📦 Datos finales para enviar:', assistanceData);

            await addAssistance(assistanceData);
            console.log('✅ Asistencia creada exitosamente');

            // Limpiar y cerrar
            onSubmitSuccess();
            handleClose();

        } catch (error) {
            console.error("❌ Error al crear asistencia:", error);
            // Aquí podrías mostrar un toast o mensaje de error al usuario
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <Button variant="primary" onClick={handleShow}>
                {getFormattedMessage('asistance.create.title')}
            </Button>

            <Modal show={show} onHide={handleClose} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>
                        {getFormattedMessage('asistance.create.title')}
                    </Modal.Title>
                </Modal.Header>
                <Form onSubmit={handleSubmit(onSubmit)}>
                    <Modal.Body>
                        <div className="row">
                            {/* Nombre */}
                            <div className="col-md-6 mb-3">
                                <Form.Group>
                                    <Form.Label>
                                        {getFormattedMessage('globally.input.name.label')} *
                                    </Form.Label>
                                    <Form.Control
                                        {...register('name', { required: true })}
                                        isInvalid={!!errors.name}
                                        placeholder="Ej: ALMUERZO/CENA"
                                    />
                                    {errors.name && (
                                        <Form.Control.Feedback type="invalid">
                                            {getFormattedMessage('globally.input.name.error.required.message')}
                                        </Form.Control.Feedback>
                                    )}
                                </Form.Group>
                            </div>

                            {/* Código */}
                            <div className="col-md-6 mb-3">
                                <Form.Group>
                                    <Form.Label>Código *</Form.Label>
                                    <Form.Control
                                        {...register('code', { required: true })}
                                        isInvalid={!!errors.code}
                                        placeholder="Ej: ALM"
                                    />
                                    {errors.code && (
                                        <Form.Control.Feedback type="invalid">
                                            Este campo es requerido
                                        </Form.Control.Feedback>
                                    )}
                                </Form.Group>
                            </div>

                            {/* Categoría */}
                            <div className="col-md-6 mb-3">
                                <Form.Group>
                                    <Form.Label>Categoría *</Form.Label>
                                    {isLoadingCategories ? (
                                        <Form.Control as="select" disabled>
                                            <option>Cargando categorías...</option>
                                        </Form.Control>
                                    ) : (
                                        <Form.Select
                                            {...register('asistence_category_id', { required: true })}
                                            isInvalid={!!errors.asistence_category_id}
                                        >
                                            <option value="">Selecciona una categoría</option>
                                            {Array.isArray(categories) && categories.map((category) => {
                                                const categoryId = category.id || category.attributes?.id;
                                                const categoryName = category.name || category.attributes?.name;

                                                return (
                                                    <option key={categoryId} value={categoryId}>
                                                        {categoryName}
                                                    </option>
                                                );
                                            })}
                                        </Form.Select>
                                    )}
                                    {errors.asistence_category_id && (
                                        <Form.Control.Feedback type="invalid">
                                            Selecciona una categoría
                                        </Form.Control.Feedback>
                                    )}

                                    {/* Info de debug */}
                                    {process.env.NODE_ENV === 'development' && (
                                        <Form.Text className="text-muted">
                                            Categorías: {categories?.length || 0} disponibles
                                            {categories?.length === 0 && !isLoadingCategories && ' - Sin datos'}
                                        </Form.Text>
                                    )}
                                </Form.Group>
                            </div>

                            {/* Unidad de Venta */}
                            <div className="col-md-6 mb-3">
                                <Form.Group>
                                    <Form.Label>Unidad de Venta</Form.Label>
                                    {isLoadingUnits ? (
                                        <Form.Control as="select" disabled>
                                            <option>Cargando unidades...</option>
                                        </Form.Control>
                                    ) : (
                                        <Form.Select
                                            {...register('sale_unit')}
                                            isInvalid={!!errors.sale_unit}
                                        >
                                            <option value="">Selecciona una unidad</option>
                                            {Array.isArray(saleUnits) && saleUnits.map((unit) => {
                                                console.log('🏷️ Renderizando unidad:', unit);
                                                return (
                                                    <option key={unit.id} value={unit.id}>
                                                        {unit.name} ({unit.short_name})
                                                    </option>
                                                );
                                            })}
                                        </Form.Select>
                                    )}
                                    {errors.sale_unit && (
                                        <Form.Control.Feedback type="invalid">
                                            Selecciona una unidad de venta
                                        </Form.Control.Feedback>
                                    )}

                                    {/* Info de debug */}
                                    {process.env.NODE_ENV === 'development' && (
                                        <Form.Text className="text-muted">
                                            Units: {saleUnits?.length || 0} disponibles
                                            {saleUnits?.length === 0 && !isLoadingUnits && ' - Sin datos'}
                                            {saleUnits?.length > 0 && ` | Primera: ${saleUnits[0]?.name}`}
                                        </Form.Text>
                                    )}
                                </Form.Group>
                            </div>

                            {/* Costo */}
                            <div className="col-md-6 mb-3">
                                <Form.Group>
                                    <Form.Label>Costo</Form.Label>
                                    <Form.Control
                                        type="number"
                                        step="0.01"
                                        {...register('asistence_cost', { min: 0 })}
                                        isInvalid={!!errors.asistence_cost}
                                        placeholder="0.00"
                                    />
                                    {errors.asistence_cost && (
                                        <Form.Control.Feedback type="invalid">
                                            Ingrese un costo válido
                                        </Form.Control.Feedback>
                                    )}
                                </Form.Group>
                            </div>

                            {/* Precio */}
                            <div className="col-md-6 mb-3">
                                <Form.Group>
                                    <Form.Label>Precio *</Form.Label>
                                    <Form.Control
                                        type="number"
                                        step="0.01"
                                        {...register('asistence_price', { required: true, min: 0 })}
                                        isInvalid={!!errors.asistence_price}
                                        placeholder="0.00"
                                    />
                                    {errors.asistence_price && (
                                        <Form.Control.Feedback type="invalid">
                                            Ingrese un precio válido
                                        </Form.Control.Feedback>
                                    )}
                                </Form.Group>
                            </div>

                            {/* Resto de campos... */}
                            <div className="col-md-6 mb-3">
                                <Form.Group>
                                    <Form.Label>Unidad</Form.Label>
                                    <Form.Control
                                        {...register('asistence_unit')}
                                        placeholder="Ej: 1, 2, etc."
                                    />
                                </Form.Group>
                            </div>

                            <div className="col-md-6 mb-3">
                                <Form.Group>
                                    <Form.Label>Duración estimada (minutos)</Form.Label>
                                    <Form.Control
                                        type="number"
                                        {...register('estimated_duration')}
                                        placeholder="60"
                                    />
                                </Form.Group>
                            </div>

                            <div className="col-md-6 mb-3">
                                <Form.Group>
                                    <Form.Label>Orden de impuestos</Form.Label>
                                    <Form.Control
                                        type="number"
                                        step="0.01"
                                        {...register('order_tax')}
                                        placeholder="0"
                                    />
                                </Form.Group>
                            </div>

                            <div className="col-md-6 mb-3">
                                <Form.Group>
                                    <Form.Label>Tipo de impuesto</Form.Label>
                                    <Form.Select {...register('tax_type')}>
                                        <option value="1">Tipo 1</option>
                                        <option value="2">Tipo 2</option>
                                    </Form.Select>
                                </Form.Group>
                            </div>

                            <div className="col-md-6 mb-3">
                                <Form.Group>
                                    <Form.Check
                                        type="checkbox"
                                        label="¿Está activo?"
                                        {...register('is_active')}
                                        defaultChecked={true}
                                    />
                                </Form.Group>
                            </div>

                            <div className="col-12 mb-3">
                                <Form.Group>
                                    <Form.Label>Descripción</Form.Label>
                                    <Form.Control
                                        as="textarea"
                                        rows={3}
                                        {...register('description')}
                                        placeholder="Descripción opcional del servicio"
                                    />
                                </Form.Group>
                            </div>

                            <div className="col-12 mb-3">
                                <Form.Group>
                                    <Form.Label>Notas</Form.Label>
                                    <Form.Control
                                        as="textarea"
                                        rows={2}
                                        {...register('notes')}
                                        placeholder="Notas adicionales"
                                    />
                                </Form.Group>
                            </div>
                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleClose}>
                            Cerrar
                        </Button>
                        <Button variant="primary" type="submit" disabled={isLoading}>
                            {isLoading ? 'Cargando...' : 'Crear Servicio'}
                        </Button>
                    </Modal.Footer>
                </Form>
            </Modal>
        </>
    );
};

// mapStateToProps CORREGIDO
const mapStateToProps = (state) => {
    console.log('🗺️ CreateAssistance mapStateToProps - Estado completo:', {
        assistanceCategory: state.assistanceCategory,
        units: state.units,
        isLoading: state.isLoading
    });

    return {
        // Categorías desde su reducer específico
        categories: state.assistanceCategory?.data || [],
        isLoadingCategories: state.assistanceCategory?.loading || false,

        // Units desde el reducer de units (array directo)
        saleUnits: state.units || [],
        isLoadingUnits: state.isLoading || false, // Loading global o específico
    };
};

export default connect(mapStateToProps, {
    addAssistance,
    fetchAssistanceCategories,
    fetchUnits
})(CreateAssistance);
