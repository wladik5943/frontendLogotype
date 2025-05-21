import React, { useState, useEffect } from 'react';
import {
    Modal, ModalHeader, ModalBody,
    Form, FormGroup, Label, Input, Button, Alert
} from 'reactstrap';

const fieldTypes = [
    { label: "Single line text", value: "TEXT_SINGLE_LINE" },
    { label: "Multiline text", value: "TEXT_MULTILINE" },
    { label: "Radio button", value: "RADIO_BUTTON" },
    { label: "Checkbox", value: "CHECKBOX" },
    { label: "Combobox", value: "COMBOBOX" },
    { label: "Date", value: "DATE" },
];

const FieldModal = ({ isOpen, toggle, field, onSave }) => {
    const [formData, setFormData] = useState({
        label: '',
        type: 'COMBOBOX',
        options: '',
        required: false,
        active: true
    });

    const [error, setError] = useState('');

    useEffect(() => {
        if (field) {
            setFormData({
                label: field.label || '',
                type: field.type || 'COMBOBOX',
                options: (field.options || []).join('\n'),
                required: field.required ?? false,
                active: field.active ?? true
            });
        } else {
            setFormData({
                label: '',
                type: 'COMBOBOX',
                options: '',
                required: false,
                active: true
            });
        }
        setError('');
    }, [field, isOpen]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSave = () => {
        if (!formData.label.trim()) {
            setError('Label is required.');
            return;
        }

        const needsOptions = ['RADIO_BUTTON', 'CHECKBOX', 'COMBOBOX'].includes(formData.type);
        const optionsArray = needsOptions
            ? formData.options.split('\n').filter(o => o.trim() !== '')
            : [];

        if (needsOptions && optionsArray.length === 0) {
            setError('Options are required for this field type.');
            return;
        }

        setError('');
        onSave({
            ...formData,
            options: optionsArray
        });
    };

    return (
        <Modal isOpen={isOpen} toggle={toggle} backdrop="static">
            <ModalHeader toggle={toggle}>
                {field ? 'Edit Field' : 'Add Field'}
            </ModalHeader>
            <ModalBody>
                {error && (
                    <Alert color="danger">
                        {error}
                    </Alert>
                )}
                <Form>
                    <FormGroup>
                        <Label for="label">Label<span className="text-danger">*</span></Label>
                        <Input
                            type="text"
                            name="label"
                            id="label"
                            value={formData.label}
                            onChange={handleChange}
                            placeholder="Field name"
                        />
                    </FormGroup>

                    <FormGroup>
                        <Label for="type">Type<span className="text-danger">*</span></Label>
                        <Input
                            type="select"
                            name="type"
                            id="type"
                            value={formData.type}
                            onChange={handleChange}
                        >
                            {fieldTypes.map(ft => (
                                <option key={ft.value} value={ft.value}>
                                    {ft.label}
                                </option>
                            ))}
                        </Input>
                    </FormGroup>

                    {['RADIO_BUTTON', 'CHECKBOX', 'COMBOBOX'].includes(formData.type) && (
                        <FormGroup>
                            <Label for="options">Options<span className="text-danger">*</span></Label>
                            <Input
                                type="textarea"
                                name="options"
                                id="options"
                                rows="4"
                                value={formData.options}
                                onChange={handleChange}
                                placeholder="One option per line"
                            />
                        </FormGroup>
                    )}

                    <div className="d-flex gap-4 mt-2 mb-2">
                        <FormGroup check className="mb-0">
                            <Label check>
                                <Input
                                    type="checkbox"
                                    name="required"
                                    checked={formData.required}
                                    onChange={handleChange}
                                />{' '}
                                Required
                            </Label>
                        </FormGroup>
                        <FormGroup check className="mb-0">
                            <Label check>
                                <Input
                                    type="checkbox"
                                    name="active"
                                    checked={formData.active}
                                    onChange={handleChange}
                                />{' '}
                                Is Active
                            </Label>
                        </FormGroup>
                    </div>

                    <div className="d-flex justify-content-end mt-4">
                        <Button color="secondary" onClick={toggle} className="me-2">
                            CANCEL
                        </Button>
                        <Button color="primary" onClick={handleSave}>
                            SAVE
                        </Button>
                    </div>
                </Form>
            </ModalBody>
        </Modal>
    );
};

export default FieldModal;
