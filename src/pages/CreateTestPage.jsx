import React, { useEffect, useState } from 'react';
import {
    Container, Button, Form, FormGroup, Label, Input, Modal, ModalHeader, ModalBody, ModalFooter
} from 'reactstrap';
import api from '../api';
import SuccessModal from "../modalWindows/SuccessCreateQuestionnaireModal";
import {FiTrash2} from "react-icons/fi";

export default function CreateTestPage() {
    const [title, setTitle] = useState('');
    const [fields, setFields] = useState([]);
    const [selectedFields, setSelectedFields] = useState([]);
    const [previewOpen, setPreviewOpen] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [createdTestId, setCreatedTestId] = useState(null);
    const [isActive, setIsActive] = useState(true);
    useEffect(() => {
        api.get('/fields') // Получаем все существующие поля
            .then(res => {
                if (Array.isArray(res.data)) {
                    setFields(res.data);
                } else if (res.data?.content) {
                    setFields(res.data.content);
                }
            })
            .catch(err => console.error('Ошибка загрузки полей', err));
    }, []);

    const togglePreview = () => setPreviewOpen(!previewOpen);

    const handleFieldToggle = (fieldId) => {
        setSelectedFields(prev =>
            prev.includes(fieldId)
                ? prev.filter(id => id !== fieldId)
                : [...prev, fieldId]
        );
    };

    const handleResetFields = () => {
        setTitle('');
        setSelectedFields([]);
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!title || selectedFields.length === 0) {
            alert('Укажите название и выберите хотя бы одно поле.');
            return;
        }

        setSubmitting(true);
        try {
            const res = await api.post('/test', {
                title,
                fieldIds: selectedFields,
                active: isActive
            });
            setCreatedTestId(res.data.id);

        } catch (e) {
            console.error('Ошибка создания теста', e);
            alert('Ошибка при сохранении');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Container className="mt-5">
            <h3>Создание новой анкеты</h3>

            <Form onSubmit={handleSubmit} className="mt-4">
                <FormGroup>
                    <div className="d-flex justify-content-between align-items-center mb-2">
                        <Label className="m-0">Название анкеты</Label>

                        <Button
                            color="outline-danger"
                            size="sm"
                            type="button"
                            onClick={handleResetFields}
                            className="d-flex align-items-center gap-1"
                            title="Очистить анкету"
                        >
                            <FiTrash2 />
                            Очистить
                        </Button>
                    </div>
                    <Input
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                        placeholder="Введите название"
                    />

                </FormGroup>


                <FormGroup>
                    <Label>Выберите поля</Label>
                    {fields.map(field => (
                        <FormGroup check key={field.id}>
                            <Label check>
                                <Input
                                    type="checkbox"
                                    checked={selectedFields.includes(field.id)}
                                    onChange={() => handleFieldToggle(field.id)}
                                />
                                {' '}
                                {field.label} ({field.type})
                            </Label>
                        </FormGroup>
                    ))}
                    <hr className="my-3"/>


                    <FormGroup check className="mt-2">
                        <Label check className="fw-bold">
                            <Input
                                type="checkbox"
                                checked={isActive}
                                onChange={() => setIsActive(!isActive)}
                            />
                            {' '} Принимать ответы (активна)
                        </Label>
                    </FormGroup>
                </FormGroup>

                <Button color="secondary" type="button" onClick={togglePreview} className="me-2">
                    Предпросмотр
                </Button>


                <Button color="primary" type="submit" disabled={submitting}>
                    {submitting ? 'Сохраняем...' : 'Создать анкету'}
                </Button>
            </Form>


            <Modal isOpen={previewOpen} toggle={togglePreview}>
                <ModalHeader toggle={togglePreview}>Предпросмотр формы</ModalHeader>
                <ModalBody>
                    <h5 className="mb-3"><strong>{title }</strong></h5>
                    {selectedFields.length === 0 ? (
                        <div className="text-center text-muted">
                            <p>Вы не выбрали ни одного поля для анкеты.</p>
                            <p>Пожалуйста, отметьте нужные поля перед предпросмотром.</p>
                        </div>
                    ) : (
                        fields
                            .filter(f => selectedFields.includes(f.id))
                            .map(f => {
                                // Варианты для поля, если есть
                                const options = f.options || [];

                                if (f.type === 'TEXT_MULTILINE') {
                                    return (
                                        <FormGroup key={f.id}>
                                            <Label>{f.label}</Label>
                                            <Input disabled type="textarea" placeholder="..."/>
                                        </FormGroup>
                                    );
                                }

                                if (f.type === 'TEXT_SINGLE_LINE') {
                                    return (
                                        <FormGroup key={f.id}>
                                            <Label>{f.label}</Label>
                                            <Input disabled type="text" placeholder=""/>
                                        </FormGroup>
                                    );
                                }

                                if (f.type === 'DATE') {
                                    return (
                                        <FormGroup key={f.id}>
                                            <Label>{f.label}</Label>
                                            <Input disabled type="date"/>
                                        </FormGroup>
                                    );
                                }

                                if (f.type === 'COMBOBOX') {
                                    return (
                                        <FormGroup key={f.id}>
                                            <Label>{f.label}</Label>
                                            <Input type="select" disabled>
                                                <option>-- выберите --</option>
                                                {options.map(opt => (
                                                    <option key={opt.id || opt} value={opt.id || opt}>
                                                        {opt.label || opt}
                                                    </option>
                                                ))}
                                            </Input>
                                        </FormGroup>
                                    );
                                }

                                if (f.type === 'CHECKBOX') {
                                    return (
                                        <FormGroup key={f.id}>
                                            <Label>{f.label}</Label>
                                            {options.map(opt => (
                                                <FormGroup check key={opt.id || opt}>
                                                    <Label check>
                                                        <Input type="checkbox" disabled/> {opt.label || opt}
                                                    </Label>
                                                </FormGroup>
                                            ))}
                                        </FormGroup>
                                    );
                                }

                                if (f.type === 'RADIO_BUTTON') {
                                    return (
                                        <FormGroup key={f.id}>
                                            <Label>{f.label}</Label>
                                            {options.map(opt => (
                                                <FormGroup check key={opt.id || opt}>
                                                    <Label check>
                                                        <Input type="radio" name={`radio-${f.id}`}
                                                               disabled/> {opt.label || opt}
                                                    </Label>
                                                </FormGroup>
                                            ))}
                                        </FormGroup>
                                    );
                                }


                                return (
                                    <FormGroup key={f.id}>
                                        <Label>{f.label}</Label>
                                        <Input disabled type="text"/>
                                    </FormGroup>
                                );
                            })
                    )}
                </ModalBody>


                <ModalFooter>
                    <Button color="secondary" onClick={togglePreview}>Закрыть</Button>
                </ModalFooter>
            </Modal>
            <SuccessModal
                isOpen={!!createdTestId}
                testId={createdTestId}
                onClose={() => {
                    setCreatedTestId(null);
                    window.location.href = '/questionnaires';
                }}
                onCreateAnother={() => {
                    setCreatedTestId(null);
                    setTitle('');
                    setSelectedFields([]);
                }}
            />

        </Container>
    );
}
