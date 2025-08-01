import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { connect } from 'react-redux';
import { getFormattedMessage } from '../../shared/sharedMethod';
import { addAssistance } from '../../store/action/asistancesAction';
import { fetchAssistanceCategories } from '../../store/action/assistanceCategoriesAction';

const CreateAssistance = ({
    addAssistance,
    onSubmitSuccess,
    categories = [],
    fetchAssistanceCategories,
    isLoadingCategories = false
}) => {
    const [show, setShow] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const { register, handleSubmit, formState: { errors }, reset } = useForm();

    // Cargar categorías cuando se abre el modal
    useEffect(() => {
        if (show && categories.length === 0) {
            console.log('🔄 Cargando categorías...');
            fetchAssistanceCategories({});
        }
    }, [show, categories.length, fetchAssistanceCategories]);

    const handleClose = () => {
        reset();
        setShow(false);
    };

    const handleShow = () => {
        setShow(true);
        // Cargar categorías al abrir el modal
        if (categories.length === 0) {
            fetchAssistanceCategories({});
        }
    };

    const onSubmit = async (data) => {
        setIsLoading(true);
        console.log('📤 Datos RAW del formulario:', data);
        try {
            // Verificar que tenemos el campo name
            if (!data.name || data.name.trim() === '') {
                console.error('❌ Campo name está vacío!', data.name);
                throw new Error('El campo name es obligatorio');
            }

            // Buscar la categoría seleccionada para obtener su nombre
            const selectedCategory = categories.find(cat =>
                cat.id === parseInt(data.asistence_category_id) ||
                cat.attributes?.id === parseInt(data.asistence_category_id)
            );

            // Procesar los datos exactamente como los espera el backend
            const assistanceData = {
                name: data.name.trim(),
                code: data.code?.trim() || '',
                asistence_category_id: parseInt(data.asistence_category_id) || null,
                asistence_cost: parseFloat(data.asistence_cost) || 0,
                asistence_price: parseFloat(data.asistence_price) || 0,
                asistence_unit: data.asistence_unit?.trim() || '1',
                estimated_duration: parseInt(data.estimated_duration) || 0,
                order_tax: parseInt(data.order_tax) || 0,
                tax_type: data.tax_type || '1',
                description: data.description?.trim() || null,
                notes: data.notes?.trim() || null,
                is_active: Boolean(data.is_active !== false), // true por defecto
                // Incluir category según tu estructura
                category: selectedCategory ? {
                    id: selectedCategory.id || selectedCategory.attributes?.id,
                    name: selectedCategory.name || selectedCategory.attributes?.name
                } : null
            };

            console.log('📦 Datos procesados para enviar:', assistanceData);
            console.log('🔍 Verificación de campos requeridos:', {
                name: { exists: !!assistanceData.name, value: assistanceData.name },
                code: { exists: !!assistanceData.code, value: assistanceData.code },
                category_id: { exists: !!assistanceData.asistence_category_id, value: assistanceData.asistence_category_id },
                price: { exists: !!assistanceData.asistence_price, value: assistanceData.asistence_price }
            });

            await addAssistance(assistanceData);
            console.log('✅ Asistencia creada exitosamente');

            onSubmitSuccess(); // Notificar al componente padre
            handleClose(); // Cerrar el modal después de guardar

        } catch (error) {
            console.error("❌ Error al crear asistencia:", error);
            console.error("❌ Response data:", error.response?.data);
            console.error("❌ Status:", error.response?.status);
        } finally {
            setIsLoading(false);
        }
    };

    // Debug: mostrar categorías disponibles
    console.log('📂 Categorías disponibles:', categories);

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

                            {/* SELECT DE CATEGORÍAS - AGREGADO */}
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
                                            {categories.map((category) => {
                                                // Manejar tanto estructuras normales como con attributes
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
                                    {categories.length === 0 && !isLoadingCategories && (
                                        <Form.Text className="text-muted">
                                            No hay categorías disponibles. Verifica tu conexión a la API.
                                        </Form.Text>
                                    )}
                                </Form.Group>
                            </div>

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
                            {getFormattedMessage('Cerrar')}
                        </Button>
                        <Button variant="primary" type="submit" disabled={isLoading}>
                            {isLoading ? getFormattedMessage('Cargando...') : getFormattedMessage('Crear Servicio')}
                        </Button>
                    </Modal.Footer>
                </Form>
            </Modal>
        </>
    );
};

const mapStateToProps = (state) => {
    console.log('🗺️ CreateAssistance mapStateToProps - Estado completo:', state);
    console.log('🗺️ CreateAssistance mapStateToProps - assistanceCategory:', state.assistanceCategory);
    return {
        categories: state.assistanceCategory?.data || [],
        isLoadingCategories: state.assistanceCategory?.loading || false
    };
};

export default connect(mapStateToProps, {
    addAssistance,
    fetchAssistanceCategories
})(CreateAssistance);
