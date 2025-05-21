import React, { useEffect, useState } from 'react';
import {
    Modal, ModalHeader, ModalBody, ModalFooter,
    Form, FormGroup, Label, Input, Button
} from 'reactstrap';
import api from '../api';

export const EditTestModal = ({ isOpen, toggle, test, onUpdated }) => {
    const [title, setTitle] = useState('');
    const [fields, setFields] = useState([]);
    const [selectedFields, setSelectedFields] = useState([]);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (test) {
            setTitle(test.title || '');
            const ids = test.fields?.map(f => f.id) || [];
            setSelectedFields(ids);
        }
    }, [test]);

    useEffect(() => {
        api.get('/fields').then(res => {
            setFields(res.data?.content || res.data || []);
        });
    }, []);

    const handleFieldToggle = (fieldId) => {
        setSelectedFields(prev =>
            prev.includes(fieldId)
                ? prev.filter(id => id !== fieldId)
                : [...prev, fieldId]
        );
    };

    const handleSubmit = async () => {
        if (!title || selectedFields.length === 0) {
            alert("Заполни название и выбери поля.");
            return;
        }

        setSaving(true);
        try {
            await api.put(`/test/${test.id}`, {
                title,
                fieldIds: selectedFields
            });
            onUpdated();
        } catch (e) {
            console.error("Ошибка при обновлении:", e);
            alert("Ошибка при сохранении.");
        } finally {
            setSaving(false);
        }
    };

    return (
        <Modal isOpen={isOpen} toggle={toggle}>
            <ModalHeader toggle={toggle}>Редактирование теста</ModalHeader>
            <ModalBody>
                <Form>
                    <FormGroup>
                        <Label>Название теста</Label>
                        <Input
                            value={title}
                            onChange={e => setTitle(e.target.value)}
                            placeholder="Введите название"
                        />
                    </FormGroup>
                    <FormGroup>
                        <Label>Выбери поля</Label>
                        {fields.map(field => (
                            <FormGroup check key={field.id}>
                                <Label check>
                                    <Input
                                        type="checkbox"
                                        checked={selectedFields.includes(field.id)}
                                        onChange={() => handleFieldToggle(field.id)}
                                    />{' '}
                                    {field.label} ({field.type})
                                </Label>
                            </FormGroup>
                        ))}
                    </FormGroup>
                </Form>
            </ModalBody>
            <ModalFooter>
                <Button color="secondary" onClick={toggle}>Отмена</Button>
                <Button color="primary" onClick={handleSubmit} disabled={saving}>
                    {saving ? "Сохраняем..." : "Сохранить"}
                </Button>
            </ModalFooter>
        </Modal>
    );
};
