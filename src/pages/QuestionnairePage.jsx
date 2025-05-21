import React, { useState, useEffect } from 'react';
import {
    Form,
    FormGroup,
    Label,
    Input,
    Spinner,
    Button,
    Container,
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter
} from 'reactstrap';
import {useLocation, useParams} from 'react-router-dom';
import api from '../api';

const FieldsPage = () => {



    const [test, setTest] = useState([]);
    const [submitting, setSubmitting] = useState(false);
    const [fields, setFields] = useState([]);
    const [formData, setFormData] = useState({});
    const [loading, setLoading] = useState(true);

    // Для модалки с ошибками
    const [modalOpen, setModalOpen] = useState(false);
    const [modalMessage, setModalMessage] = useState('');
    const { id } = useParams();
    useEffect(() => {
        const fetchFields = async () => {
            setLoading(true);
            try {
                let response;
                if (id) {
                    response = await api.get(`/test/${id}`);
                } else {
                    window.location.href = '/questionnaires';
                }
                const data = id ? response.data : response.data.content;
                setFields(data.fields);
                setTest(data)

                const initialFormData = {};
                data.forEach((field) => {
                    if (
                        field.type === 'CHECKBOX' ||
                        field.type === 'RADIO_BUTTON' ||
                        field.type === 'COMBOBOX'
                    ) {
                        initialFormData[field.id] = [];
                    } else {
                        initialFormData[field.id] = '';
                    }
                });
                setFormData(initialFormData);
            } catch (err) {
                console.error('Error loading fields:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchFields();
    }, [id]);

    const handleChange = (field, value, optionValue = null) => {
        setFormData((prevData) => {
            if (field.type === 'CHECKBOX') {
                const current = prevData[field.id] || [];
                const updated = current.includes(optionValue)
                    ? current.filter((v) => v !== optionValue)
                    : [...current, optionValue];
                return { ...prevData, [field.id]: updated };
            } else {
                return { ...prevData, [field.id]: value };
            }
        });
    };

    const renderField = (field) => {
        switch (field.type) {
            case 'TEXT_SINGLE_LINE':
                return (
                    <Input
                        type="text"
                        value={formData[field.id] || ''}
                        onChange={(e) => handleChange(field, e.target.value)}
                    />
                );
            case 'TEXT_MULTILINE':
                return (
                    <Input
                        type="textarea"
                        value={formData[field.id] || ''}
                        onChange={(e) => handleChange(field, e.target.value)}
                    />
                );
            case 'RADIO_BUTTON':
                return (field.options || []).map((opt, index) => (
                    <FormGroup check key={index}>
                        <Label check>
                            <Input
                                type="radio"
                                name={`radio-${field.id}`}
                                value={opt}
                                checked={formData[field.id] === opt}
                                onChange={() => handleChange(field, opt)}
                            />{' '}
                            {opt}
                        </Label>
                    </FormGroup>
                ));
            case 'CHECKBOX':
                return (field.options || []).map((opt, index) => (
                    <FormGroup check key={index}>
                        <Label check>
                            <Input
                                type="checkbox"
                                value={opt}
                                checked={(formData[field.id] || []).includes(opt)}
                                onChange={() => handleChange(field, null, opt)}
                            />{' '}
                            {opt}
                        </Label>
                    </FormGroup>
                ));
            case 'COMBOBOX':
                return (
                    <Input
                        type="select"
                        value={formData[field.id] || ''}
                        onChange={(e) => handleChange(field, e.target.value)}
                    >
                        <option value="">Select...</option>
                        {(field.options || []).map((opt, index) => (
                            <option key={index} value={opt}>{opt}</option>
                        ))}
                    </Input>
                );
            case 'DATE':
                return (
                    <Input
                        type="date"
                        value={formData[field.id] || ''}
                        onChange={(e) => handleChange(field, e.target.value)}
                    />
                );
            default:
                return null;
        }
    };

    // Валидация обязательных полей
    const validateForm = () => {
        for (const field of fields) {
            if (field.required) {
                const value = formData[field.id];
                if (
                    value === '' ||
                    (Array.isArray(value) && value.length === 0) ||
                    value == null && field.active
                ) {
                    setModalMessage(`Пожалуйста, заполните обязательное поле: "${field.label}"`);
                    setModalOpen(true);
                    return false;
                }
            }
        }
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setSubmitting(true);

        const payload = {
            questionnaireId: parseInt(id),
            answers: Object.entries(formData).map(([fieldId, value]) => ({
                fieldId: parseInt(fieldId),
                value: Array.isArray(value) ? value.join(',') : value
            }))
        };

        try {
            await api.post('/answer', payload);
            window.location.href = `/questionnaires/success`;
        } catch (error) {
            console.error('Ошибка при отправке формы:', error);

            if (error.response && error.response.status === 401) {
                setModalMessage('Вы не авторизованы. Пожалуйста, войдите в систему.');
                setModalOpen(true);
            } else {
                setModalMessage('Ошибка при отправке. Попробуйте снова.');
                setModalOpen(true);
            }
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Container className="d-flex justify-content-center align-items-center mt-5 mb-5">
            <div style={{
                width: '100%',
                maxWidth: '420px',
                background: '#fff',
                border: '1px solid #ddd',
                borderRadius: '8px',
                padding: '30px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
            }}>
                <h4 className="text-center mb-4">{test.title}</h4>

                <Form onSubmit={handleSubmit}>
                    {fields
                        .filter(field => field.active)
                        .map((field) => (
                            <FormGroup key={field.id} className="mb-3">
                                <Label className="form-label" style={{ fontWeight: 500 }}>
                                    {field.label} {field.required && <span className="text-danger">*</span>}
                                </Label>
                                {renderField(field)}
                            </FormGroup>
                        ))}

                    <div className="d-flex justify-content-center mt-4">
                        <Button
                            color="primary"
                            type="submit"
                            disabled={submitting}
                            style={{ minWidth: '120px' }}
                        >
                            {submitting ? (
                                <>
                                    <Spinner size="sm" className="me-2" />
                                    Sending...
                                </>
                            ) : (
                                "SUBMIT"
                            )}
                        </Button>
                    </div>
                </Form>
            </div>


            <Modal isOpen={modalOpen} toggle={() => setModalOpen(!modalOpen)}>
                <ModalHeader toggle={() => setModalOpen(false)}>Внимание</ModalHeader>
                <ModalBody>{modalMessage}</ModalBody>
                <ModalFooter>
                    <Button color="secondary" onClick={() => setModalOpen(false)}>
                        Закрыть
                    </Button>
                </ModalFooter>
            </Modal>
        </Container>

    );
};

export default FieldsPage;
