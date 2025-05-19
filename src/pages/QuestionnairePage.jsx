import React, { useState, useEffect } from 'react';
import {
    Form,
    FormGroup,
    Label,
    Input,
    Spinner,
    Button,
    Container,
    Row,
    Col
} from 'reactstrap';
import { useLocation } from 'react-router-dom';
import api from '../api';


const FIELD_TYPE_LABELS = {
    TEXT_SINGLE_LINE: 'Single line text',
    TEXT_MULTILINE: 'Multiline text',
    RADIO_BUTTON: 'Radio button',
    CHECKBOX: 'Checkbox',
    COMBOBOX: 'Combobox',
    DATE: 'Date'
};

const FieldsPage = () => {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const testId = queryParams.get('testId');
    const [submitting, setSubmitting] = useState(false);
    const [fields, setFields] = useState([]);
    const [formData, setFormData] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchFields = async () => {
            setLoading(true);
            try {
                let response;
                if (testId) {
                    response = await api.get(`/tests/${testId}/fields`);
                } else {
                    response = await api.get(`/fields?page=0&size=50`);
                }
                const data = testId ? response.data : response.data.content;
                setFields(data);

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
    }, [testId]);

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

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);

        const payload = {
            questionnaireId: parseInt(testId),
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
            alert('Ошибка при отправке. Попробуйте снова.');
        } finally {
            setSubmitting(false);
        }
    };


    return (
        <Container className="mt-5">

            <h3>{testId ? 'Fill Test' : 'Available Fields'}</h3>
            {loading ? (
                <div className="text-center mt-4">
                    <Spinner color="primary" />
                </div>
            ) : (
                <Form onSubmit={handleSubmit} className="mt-4">
                    {fields.map((field) => (
                        <FormGroup key={field.id} className="mb-4">
                            <Label>{field.label} {field.required && <span className="text-danger">*</span>}</Label>
                            {renderField(field)}
                        </FormGroup>
                    ))}
                    { (
                        <Button color="primary" type="submit" disabled={submitting}>
                            {submitting ? (
                                <>
                                    <Spinner size="sm" className="me-2" />
                                    Sending...
                                </>
                            ) : (
                                "Submit"
                            )}
                        </Button>

                    )}
                </Form>
            )}
        </Container>
    );
};

export default FieldsPage;
