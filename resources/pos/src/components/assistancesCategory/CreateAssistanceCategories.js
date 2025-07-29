import React, { useState } from 'react'
import { Modal, Button, Form } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { connect } from 'react-redux'
import { getFormattedMessage } from '../../shared/sharedMethod';
import { addAssistance } from '../../store/action/asistancesAction';
import { addAssistanceCategory } from '../../store/action/assistanceCategoriesAction';

const CreateAssistanceCategory = ({ addAssistanceCategory, onSubmitSuccess }) => {
    const [show, setShow] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const { register, handleSubmit, reset, formState: { errors } } = useForm();

    const handleClose = () => {
        setShow(false);
        reset();
    };

    const onSubmit = async (data) => {
        setIsLoading(true);
        try {
            if (!data.name || data.name.trim() === '') {
                console.error('❌ Campo name está vacío!', data.name);
                throw new Error(getFormattedMessage("globally.input.name.validate.label"));
            }

            const assistanceCategoryData = {
                name: data.name,
                description: data.description || '',
                is_active: data.is_active || true
            };
            await addAssistanceCategory(assistanceCategoryData);
            onSubmitSuccess();
            handleClose();
        } catch (error) {
            console.error('Error al enviar el formulario:', error);

            addToast({
                text: error.message || getFormattedMessage("globally.error.message"),
                type: toastType.ERROR,
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <Button variant="primary" onClick={() => setShow(true)}>
                {getFormattedMessage("Crear Categoria de Servicio")}
            </Button>
            <Modal show={show} onHide={handleClose} size='lg'>
                <Modal.Header closeButton>
                    <Modal.Title>{getFormattedMessage('Crear Categoria de Servicio')}</Modal.Title>
                </Modal.Header>
                <Form onSubmit={handleSubmit(onSubmit)}>
                    <Modal.Body>
                        <div className='row'>
                            <div className='col-md-6 mb-3'>
                                <Form.Group controlId="formName">
                                    <Form.Label>
                                        {getFormattedMessage("Nombre de la Categoria")}
                                    </Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder={getFormattedMessage("Ingrese el nombre de la categoria")}
                                        {...register("name", { required: true })}
                                        isInvalid={!!errors.name}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        {getFormattedMessage("EL nombre es obligatorio")}
                                    </Form.Control.Feedback>
                                </Form.Group>
                            </div>
                            <div className='col-md-6 mb-3'>
                                <Form.Group controlId="formDescription">
                                    <Form.Label>{getFormattedMessage("Descripción de la Categoria")}</Form.Label>
                                    <Form.Control
                                        as="textarea"
                                        rows={3}
                                        placeholder={getFormattedMessage("Ingrese la descripción de la categoria")}
                                        {...register("description")}
                                    />
                                </Form.Group>
                            </div>
                            <div className='col-md-6 mb-3'>
                                <Form.Group controlId="formIsActive">
                                    <Form.Check
                                        type="checkbox"
                                        label={getFormattedMessage("Estado")}
                                        {...register("is_active")}
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
                            {isLoading ? getFormattedMessage("Cargando...") : getFormattedMessage("Crear Categoria")}
                        </Button>
                    </Modal.Footer>
                </Form>
            </Modal>
        </>
    );
};

export default connect(null, { addAssistanceCategory })(CreateAssistanceCategory);
