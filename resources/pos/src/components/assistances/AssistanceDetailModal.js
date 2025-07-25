import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import { getFormattedMessage } from '../../shared/sharedMethod';

const AssistanceDetailModal = ({ show, handleClose, assistance }) => {
    return (
        <Modal show={show} onHide={handleClose} size="lg">
            <Modal.Header closeButton>
                <Modal.Title>
                    {getFormattedMessage('asistance.detail.title')}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {assistance && (
                    <div className="row">
                        <div className="col-6 mb-3">
                            <label className="text-gray-600">
                                {getFormattedMessage('globally.input.name.label')}:
                            </label>
                            <p>{assistance.name}</p>
                        </div>
                        <div className="col-6 mb-3">
                            <label className="text-gray-600">
                                Código:
                            </label>
                            <p>{assistance.code}</p>
                        </div>
                        <div className="col-6 mb-3">
                            <label className="text-gray-600">
                                Categoría:
                            </label>
                            <p>{assistance.category}</p>
                        </div>
                        <div className="col-6 mb-3">
                            <label className="text-gray-600">
                                Precio:
                            </label>
                            <p>${assistance.asistence_price}</p>
                        </div>
                        <div className="col-6 mb-3">
                            <label className="text-gray-600">
                                Duración estimada:
                            </label>
                            <p>{assistance.estimated_duration} minutos</p>
                        </div>
                        <div className="col-6 mb-3">
                            <label className="text-gray-600">
                                Estado:
                            </label>
                            <p>
                                <span className={`badge bg-${assistance.is_active ? 'success' : 'danger'}`}>
                                    {assistance.is_active ? 'Activo' : 'Inactivo'}
                                </span>
                            </p>
                        </div>
                        <div className="col-12 mb-3">
                            <label className="text-gray-600">
                                Descripción:
                            </label>
                            <p>{assistance.description || 'N/A'}</p>
                        </div>
                        <div className="col-12 mb-3">
                            <label className="text-gray-600">
                                Notas:
                            </label>
                            <p>{assistance.notes || 'N/A'}</p>
                        </div>
                    </div>
                )}
            </Modal.Body>
            <Modal.Footer>
                <Button variant="primary" onClick={handleClose}>
                    {getFormattedMessage('globally.button.close.label')}
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default AssistanceDetailModal;
