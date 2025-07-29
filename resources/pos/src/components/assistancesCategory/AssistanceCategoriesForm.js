import React, { useState, createRef } from 'react';
import { connect } from 'react-redux';
import { Form, Modal } from 'react-bootstrap-v5';
import { getFormattedMessage, placeholderText } from "../../shared/sharedMethod";
import { addAssistanceCategory, editAssistanceCategory } from '../../store/action/assistanceCategoriesAction';
import ModelFooter from '../../shared/components/modelFooter';

const AssistanceCategoryForm = (props) => {
    const { handleClose, show, title, addAssistanceCategory, editAssistanceCategory, singleAssistanceCategory } = props;
    const innerRef = createRef();

    const [assistanceCategory, setAssistanceCategory] = useState({
        name: singleAssistanceCategory ? singleAssistanceCategory.name : '',
        description: singleAssistanceCategory ? singleAssistanceCategory.description : '',
        is_active: singleAssistanceCategory ? singleAssistanceCategory.is_active : true
    });

    const [errors, setErrors] = useState({
        name: '',
        description: '',
        is_active: ''
    });

    const handleValidation = () => {
        let newErrors = {};
        let isValid = true;

        if (!assistanceCategory.name.trim()) {
            newErrors.name = getFormattedMessage("globally.input.name.validate.label");
            isValid = false;
        }

        if (!assistanceCategory.description.trim()) {
            newErrors.description = getFormattedMessage("globally.input.description.validate.label");
            isValid = false;
        }

        if (!assistanceCategory.is_active) {
            newErrors.is_active = getFormattedMessage("globally.input.active.validate.label");
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    const onChangeInput = (e) => {
        const { name, value } = e.target;
        setAssistanceCategory(prev => ({ ...prev, [name]: value }));
        setErrors(prev => ({ ...prev, [name]: '' }));
    };

    const onCheckboxChange = (e) => {
        const { name, checked } = e.target;
        setAssistanceCategory(prev => ({ ...prev, [name]: checked }));
        setErrors(prev => ({ ...prev, [name]: '' }));
    };

    const prepareFormData = () => {
        return {
            data: {
                type: 'assistance_categories',
                attributes: {
                    ...assistanceCategory,
                }
            }
        }
    }

    const onSubmit = (event) => {
        event.preventDefault();
        if (handleValidation()) {
            const formData = prepareFormData();
            if (singleAssistanceCategory) {
                editAssistanceCategory(singleAssistanceCategory.id, formData, handleClose);
            } else {
                addAssistanceCategory(formData, handleClose);
            }
        }
    };

    const clearField = () => {
        setAssistanceCategory({
            name: '',
            description: '',
            is_active: true
        });
        setErrors({
            name: '',
            description: '',
            is_active: ''
        });
        handleClose();
    };

    return (
        <Modal show={show} onHide={handleClose} size="lg" centered>
            <Form onSubmit={onSubmit}>
                <Modal.Header closeButton>
                    <Modal.Title>{title || getFormattedMessage("assistanceCategory.form.title")}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className='row'>
                        <div className='col-md-6 mb-3'>
                            <label className='form-label'>
                                {getFormattedMessage("globally.input.name.label")}:
                                <span className='required'>*</span>
                            </label>
                            <input
                                type='text'
                                className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                                name='name'
                                value={assistanceCategory.name}
                                onChange={onChangeInput}
                                placeholder={placeholderText("globally.input.name.placeholder.label")}
                                ref={innerRef}
                            />
                            {errors.name && <div className="invalid-feedback">{errors.name}</div>}
                        </div>

                        <div className='col-md-6 mb-3'>
                            <label className='form-label'>
                                {getFormattedMessage("globally.input.description.label")}:
                            </label>
                            <textarea
                                className={`form-control ${errors.description ? 'is-invalid' : ''}`}
                                name='description'
                                value={assistanceCategory.description}
                                onChange={onChangeInput}
                                placeholder={placeholderText("globally.input.description.placeholder.label")}
                            />
                            {errors.description && <div className="invalid-feedback">{errors.description}</div>}
                        </div>
                        <div className='col-md-6 mb-3'>
                            <label className='form-label'>
                                {getFormattedMessage("globally.input.active.label")}:
                            </label>
                            <input
                                type='checkbox'
                                className={`form-check-input ${errors.is_active ? 'is-invalid' : ''}`}
                                name='is_active'
                                checked={assistanceCategory.is_active}
                                onChange={onCheckboxChange}
                            />
                            {errors.is_active && <div className="invalid-feedback">{errors.is_active}</div>}
                        </div>
                    </div>
                </Modal.Body>
                <ModelFooter
                    onEditRecord={singleAssistanceCategory ? onSubmit : null}
                    onSubmit={onSubmit}
                    clearField={clearField}
                    addDisabled={!assistanceCategory.name.trim() || !assistanceCategory.description.trim()}
                />
            </Form>
        </Modal>
    );
};

export default connect(null, { addAssistanceCategory, editAssistanceCategory })(AssistanceCategoryForm);
