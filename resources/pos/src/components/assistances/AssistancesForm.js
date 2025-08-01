import React, { useState, createRef } from 'react';
import { connect } from 'react-redux';
import { Form, Modal } from 'react-bootstrap-v5';
import { getFormattedMessage, placeholderText } from "../../shared/sharedMethod";
import { addAssistance, editAssistance } from '../../store/action/asistancesAction';
import ModelFooter from '../../shared/components/modelFooter';

const AssistanceForm = (props) => {
    const { handleClose, show, title, addAssistanceData, editAssistance, singleAssistance } = props;
    const innerRef = createRef();

    const [assistance, setAssistance] = useState({
        name: singleAssistance ? singleAssistance.name : '',
        code: singleAssistance ? singleAssistance.code : '',
        category: singleAssistance ? singleAssistance.category : '',
        asistence_price: singleAssistance ? singleAssistance.asistence_price : '',
        estimated_duration: singleAssistance ? singleAssistance.estimated_duration : '',
        description: singleAssistance ? singleAssistance.description : '',
        notes: singleAssistance ? singleAssistance.notes : '',
        is_active: singleAssistance ? singleAssistance.is_active : true
    });

    const [errors, setErrors] = useState({
        name: '',
        code: '',
        asistence_price: ''
    });

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
        return {
            data: {
                type: 'assistances',
                attributes: {
                    ...assistance,
                    asistence_price: parseFloat(assistance.asistence_price),
                    estimated_duration: parseInt(assistance.estimated_duration) || 0
                }
            }
        };
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
            category: '',
            asistence_price: '',
            estimated_duration: '',
            description: '',
            notes: '',
            is_active: true
        });
        setErrors({});
        handleClose();
    };

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
                            </label>
                            <select
                                name='category'
                                value={assistance.category}
                                className='form-control'
                                onChange={onChangeInput}
                            ><option value="">Selecciona una categoría</option>
                                {props.categories && props.categories.map(cat => (
                                    <option key={cat.id} value={cat.id}>{cat.attributes?.name || cat.name}</option>
                                ))}
                            </select>
                        </div>

                        <div className='col-md-6 mb-3'>
                            <label className='form-label'>
                                Precio:
                                <span className='required' />
                            </label>
                            <input
                                type='number'
                                name='asistence_price'
                                value={assistance.asistence_price}
                                step="0.01"
                                className={`form-control ${errors.asistence_price ? 'is-invalid' : ''}`}
                                onChange={onChangeInput}
                            />
                            {errors.asistence_price && <div className="invalid-feedback">{errors.asistence_price}</div>}
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
                    addDisabled={!assistance.name || !assistance.code || !assistance.asistence_price}
                />
            </Form>
        </Modal>
    );
};

export default connect(null, { addAssistance, editAssistance })(AssistanceForm);
