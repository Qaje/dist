import React, { useState, createRef, useEffect } from 'react';
import { connect } from 'react-redux';
import { Form, Modal } from 'react-bootstrap-v5';
import { getFormattedMessage, placeholderText } from "../../shared/sharedMethod";
import { addAssistance, editAssistance } from '../../store/action/asistancesAction';
import { fetchUnits } from "../../store/action/unitsAction";
import ModelFooter from '../../shared/components/modelFooter';
import {Button} from "react-bootstrap";

const AssistanceForm = (props) => {
    const {
        handleClose,
        show,
        title,
        addAssistanceData,
        editAssistance,
        singleAssistance,
        categories = [],
        saleUnits = [],
        fetchUnits,
        isLoadingSaleUnits = false
    } = props;

    const innerRef = createRef();

    const [assistance, setAssistance] = useState({
        name: singleAssistance ? singleAssistance.name : '',
        code: singleAssistance ? singleAssistance.code : '',
        asistence_category_id: singleAssistance ? singleAssistance.asistence_category_id : '',
        asistence_cost: singleAssistance ? singleAssistance.asistence_cost : '',
        asistence_price: singleAssistance ? singleAssistance.asistence_price : '',
        asistence_unit: singleAssistance ? singleAssistance.asistence_unit : '',
        sale_unit: singleAssistance ? singleAssistance.sale_unit : '', // Nuevo campo
        estimated_duration: singleAssistance ? singleAssistance.estimated_duration : '',
        order_tax: singleAssistance ? singleAssistance.order_tax : '',
        tax_type: singleAssistance ? singleAssistance.tax_type : '1',
        description: singleAssistance ? singleAssistance.description : '',
        notes: singleAssistance ? singleAssistance.notes : '',
        is_active: singleAssistance ? singleAssistance.is_active : true
    });

    const [errors, setErrors] = useState({
        name: '',
        code: '',
        asistence_category_id: '',
        asistence_price: ''
    });

    // Cargar sale units cuando se abre el modal
    useEffect(() => {
        if (show && saleUnits.length === 0) {
            console.log('🔄 Cargando sale units...');
            fetchUnits();
        }
    }, [show, saleUnits.length, fetchUnits]);

    const handleValidation = () => {
        let newErrors = {};
        let isValid = true;

        if (!assistance.name.trim()) {
            newErrors.name = getFormattedMessage("globally.input.name.validate.label");
            isValid = false;
        }

        if (!assistance.code.trim()) {
            newErrors.code = getFormattedMessage("globally.code.validate.label");
            isValid = false;
        }

        if (!assistance.asistence_category_id) {
            newErrors.asistence_category_id = "Selecciona una categoría";
            isValid = false;
        }

        if (!assistance.asistence_price || isNaN(assistance.asistence_price)) {
            newErrors.asistence_price = getFormattedMessage("globally.price.validate.label");
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    const onChangeInput = (e) => {
        const { name, value } = e.target;
        setAssistance(prev => ({ ...prev, [name]: value }));
        setErrors(prev => ({ ...prev, [name]: '' }));
    };

    const onCheckboxChange = (e) => {
        const { name, checked } = e.target;
        setAssistance(prev => ({ ...prev, [name]: checked }));
    };

    const prepareFormData = () => {
        const formData = {
            name: assistance.name.trim(),
            code: assistance.code.trim(),
            asistence_category_id: parseInt(assistance.asistence_category_id) || null,
            asistence_cost: parseFloat(assistance.asistence_cost) || 0,
            asistence_price: parseFloat(assistance.asistence_price) || 0,
            asistence_unit: assistance.asistence_unit?.trim() || '',
            sale_unit: parseInt(assistance.sale_unit) || null, // Nuevo campo como FK
            estimated_duration: parseInt(assistance.estimated_duration) || 0,
            order_tax: parseFloat(assistance.order_tax) || 0,
            tax_type: assistance.tax_type || '1',
            description: assistance.description?.trim() || null,
            notes: assistance.notes?.trim() || null,
            is_active: Boolean(assistance.is_active)
        };

        console.log('📦 Datos preparados para envío:', formData);
        return formData;
    };

    const onSubmit = (event) => {
        event.preventDefault();
        if (handleValidation()) {
            const formData = prepareFormData();
            if (singleAssistance) {
                editAssistance(singleAssistance.id, formData, handleClose);
            } else {
                addAssistanceData(formData);
            }
        }
    };

    const clearField = () => {
        setAssistance({
            name: '',
            code: '',
            asistence_category_id: '',
            asistence_cost: '',
            asistence_price: '',
            asistence_unit: '',
            sale_unit: '', // Limpiar nuevo campo
            estimated_duration: '',
            order_tax: '',
            tax_type: '1',
            description: '',
            notes: '',
            is_active: true
        });
        setErrors({});
        handleClose();
    };

    // Debug logs
    console.log('📏 Sale Units en form:', saleUnits);
    console.log('📂 Categorías en form:', categories);
    console.log('🔍 Assistance actual:', assistance);

    return (
        <Modal show={show} onHide={clearField} size="lg">
            <Form onSubmit={onSubmit}>
                <Modal.Header closeButton>
                    <Modal.Title>{title}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className='row'>
                        <div className='col-md-6 mb-3'>
                            <label className='form-label'>
                                {getFormattedMessage("globally.input.name.label")}:
                                <span className='required' />
                            </label>
                            <input
                                type='text'
                                name='name'
                                value={assistance.name}
                                placeholder={placeholderText("globally.input.name.placeholder.label")}
                                className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                                ref={innerRef}
                                onChange={onChangeInput}
                            />
                            {errors.name && <div className="invalid-feedback">{errors.name}</div>}
                        </div>

                        <div className='col-md-6 mb-3'>
                            <label className='form-label'>
                                {getFormattedMessage("globally.code.label")}:
                                <span className='required' />
                            </label>
                            <input
                                type='text'
                                name='code'
                                value={assistance.code}
                                className={`form-control ${errors.code ? 'is-invalid' : ''}`}
                                onChange={onChangeInput}
                            />
                            {errors.code && <div className="invalid-feedback">{errors.code}</div>}
                        </div>

                        <div className='col-md-6 mb-3'>
                            <label className='form-label'>
                                Categoría:
                                <span className='required' />
                            </label>
                            <select
                                name='asistence_category_id'
                                value={assistance.asistence_category_id}
                                className={`form-control ${errors.asistence_category_id ? 'is-invalid' : ''}`}
                                onChange={onChangeInput}
                            >
                                <option value="">Selecciona una categoría</option>
                                {categories && categories.map(cat => (
                                    <option
                                        key={cat.id || cat.attributes?.id}
                                        value={cat.id || cat.attributes?.id}
                                    >
                                        {cat.attributes?.name || cat.name}
                                    </option>
                                ))}
                            </select>
                            {errors.asistence_category_id && <div className="invalid-feedback">{errors.asistence_category_id}</div>}
                        </div>

                        {/* NUEVO CAMPO: Sale Unit */}
                        <div className='col-md-6 mb-3'>
                            <label className='form-label'>
                                Unidad de Venta:
                            </label>
                            {isLoadingSaleUnits ? (
                                <select className="form-control" disabled>
                                    <option>Cargando unidades...</option>
                                </select>
                            ) : (
                                <select
                                    name='sale_unit'
                                    value={assistance.sale_unit}
                                    className='form-control'
                                    onChange={onChangeInput}
                                >
                                    <option value="">Selecciona una unidad</option>
                                    {saleUnits && saleUnits.map(unit => (
                                        <option key={unit.id} value={unit.id}>
                                            {unit.name} ({unit.short_name})
                                        </option>
                                    ))}
                                </select>
                            )}
                            {saleUnits.length === 0 && !isLoadingSaleUnits && (
                                <small className="text-muted">
                                    No hay unidades de venta disponibles.
                                </small>
                            )}
                        </div>

                        <div className="col-12 mb-3">
                            <Form.Group>
                                <Form.Label>Imagen del Servicio</Form.Label>
                                <Form.Control
                                    id="imageInput"
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    className="mb-2"
                                />
                                <Form.Text className="text-muted">
                                    Formatos soportados: JPEG, PNG, GIF, WebP. Tamaño máximo: 5MB
                                </Form.Text>

                                {/* Vista previa de la imagen */}
                                {imagePreview && (
                                    <div className="mt-3">
                                        <div className="d-flex align-items-center gap-3">
                                            <img
                                                src={imagePreview}
                                                alt="Vista previa"
                                                style={{
                                                    width: '150px',
                                                    height: '150px',
                                                    objectFit: 'cover',
                                                    borderRadius: '8px',
                                                    border: '2px solid #dee2e6'
                                                }}
                                            />
                                            <div>
                                                <p className="mb-1"><strong>Archivo:</strong> {selectedImage?.name}</p>
                                                <p className="mb-1"><strong>Tamaño:</strong> {(selectedImage?.size / 1024 / 1024).toFixed(2)} MB</p>
                                                <Button
                                                    variant="outline-danger"
                                                    size="sm"
                                                    onClick={removeImage}
                                                >
                                                    Quitar imagen
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </Form.Group>
                        </div>

                        <div className='col-md-6 mb-3'>
                            <label className='form-label'>
                                Costo:
                            </label>
                            <input
                                type='number'
                                step="0.01"
                                name='asistence_cost'
                                value={assistance.asistence_cost}
                                className='form-control'
                                onChange={onChangeInput}
                            />
                        </div>

                        <div className='col-md-6 mb-3'>
                            <label className='form-label'>
                                Precio:
                                <span className='required' />
                            </label>
                            <input
                                type='number'
                                step="0.01"
                                name='asistence_price'
                                value={assistance.asistence_price}
                                className={`form-control ${errors.asistence_price ? 'is-invalid' : ''}`}
                                onChange={onChangeInput}
                            />
                            {errors.asistence_price && <div className="invalid-feedback">{errors.asistence_price}</div>}
                        </div>

                        <div className='col-md-6 mb-3'>
                            <label className='form-label'>
                                Unidad:
                            </label>
                            <input
                                type='text'
                                name='asistence_unit'
                                value={assistance.asistence_unit}
                                className='form-control'
                                onChange={onChangeInput}
                                placeholder="Ej: 1, 2, etc."
                            />
                        </div>

                        <div className='col-md-6 mb-3'>
                            <label className='form-label'>
                                Duración estimada (minutos):
                            </label>
                            <input
                                type='number'
                                name='estimated_duration'
                                value={assistance.estimated_duration}
                                className='form-control'
                                onChange={onChangeInput}
                            />
                        </div>

                        <div className='col-md-6 mb-3'>
                            <label className='form-label'>
                                Porcentaje de Impuetos:
                            </label>
                            <input
                                type='number'
                                step="0.01"
                                name='order_tax'
                                value={assistance.order_tax}
                                className='form-control'
                                onChange={onChangeInput}
                            />
                        </div>

                        <div className='col-md-6 mb-3'>
                            <label className='form-label'>
                                Tipo de impuesto:
                            </label>
                            <select
                                name='tax_type'
                                value={assistance.tax_type}
                                className='form-control'
                                onChange={onChangeInput}
                            >
                                <option value="1">Tipo 1</option>
                                <option value="2">Tipo 2</option>
                            </select>
                        </div>

                        <div className='col-md-6 mb-3 d-flex align-items-center'>
                            <div className="form-check form-switch">
                                <input
                                    className="form-check-input"
                                    type="checkbox"
                                    name="is_active"
                                    checked={assistance.is_active}
                                    onChange={onCheckboxChange}
                                    id="isActiveSwitch"
                                />
                                <label className="form-check-label" htmlFor="isActiveSwitch">
                                    Activo
                                </label>
                            </div>
                        </div>

                        <div className='col-md-12 mb-3'>
                            <label className='form-label'>
                                Descripción:
                            </label>
                            <textarea
                                name='description'
                                value={assistance.description}
                                className='form-control'
                                rows={3}
                                onChange={onChangeInput}
                            />
                        </div>

                        <div className='col-md-12 mb-3'>
                            <label className='form-label'>
                                Notas:
                            </label>
                            <textarea
                                name='notes'
                                value={assistance.notes}
                                className='form-control'
                                rows={2}
                                onChange={onChangeInput}
                            />
                        </div>
                    </div>
                </Modal.Body>
                <ModelFooter
                    onEditRecord={singleAssistance}
                    onSubmit={onSubmit}
                    clearField={clearField}
                    addDisabled={!assistance.name || !assistance.code || !assistance.asistence_category_id || !assistance.asistence_price}
                />
            </Form>
        </Modal>
    );
};

// const mapStateToProps = (state) => {
//     return {
//         saleUnits: state.saleUnits?.data || [],
//         isLoadingSaleUnits: state.saleUnits?.loading || false
//     };
// };
const mapStateToProps = (state) => {
    console.log('🗺️ mapStateToProps - Estado completo:', state);
    console.log('🗺️ mapStateToProps - Units directo:', state.units);

    // Tu estado de units es un array directo
    const unitsArray = state.units || [];

    console.log('🗺️ mapStateToProps - Units array:', {
        unitsArray: unitsArray,
        length: unitsArray.length,
        isArray: Array.isArray(unitsArray),
        firstItem: unitsArray[0]
    });

    return {
        saleUnits: unitsArray, // Array directo
        isLoadingSaleUnits: state.isLoading || false // Si tienes un estado global de loading
    };
};

export default connect(mapStateToProps, {
    addAssistance,
    editAssistance,
    fetchUnits
})(AssistanceForm);
