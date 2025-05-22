import React, { useState, useEffect } from 'react';
import {
    Table, Button, Badge, Pagination, PaginationItem,
    PaginationLink
} from 'reactstrap';
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa';
import FieldModal from '../modalWindows/FieldAddModal';
import { getUser } from '../utils/auth';
import api from '../api';

const FieldsPage = () => {
    const [fields, setFields] = useState([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [currentField, setCurrentField] = useState(null);
    const [errorMessage, setErrorMessage] = useState(null);
    const user = getUser();
    const [currentPage, setCurrentPage] = useState(0);
    const [pageSize] = useState(10);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        loadFields();
    }, []);

    const loadFields = async (page = currentPage) => {
        try {
            const res = await api.get('/fields', {
                params: { page, size: pageSize }
            });

            setFields(res.data.content);
            setTotalPages(res.data.totalPages);
            setCurrentPage(res.data.number);
        } catch (err) {
            console.error('Error loading fields:', err);
        }
    };

    const handlePageChange = (pageIndex) => {
        if (pageIndex >= 0 && pageIndex < totalPages) {
            loadFields(pageIndex);
        }
    };

    const handleAddField = () => {
        setCurrentField(null);
        setModalOpen(true);
    };

    const handleEditField = (field) => {
        setCurrentField(field);
        setModalOpen(true);
    };

    const handleDeleteField = async (id) => {
        try {
            await api.delete(`/fields/${id}`);
            setFields(fields.filter(f => f.id !== id));
            await loadFields(currentPage);
        } catch (err) {
            console.error('Error deleting field:', err);
            setErrorMessage(
                err.response?.status === 400 || err.response?.status === 500
                    ? 'Поле используется в анкете и не может быть удалено.'
                    : 'Произошла ошибка при удалении поля.'
            );
            setTimeout(() => setErrorMessage(null), 5000);
        }
    };

    const handleSaveField = async (fieldData) => {
        try {
            if (currentField) {
                const res = await api.put(`/fields/${currentField.id}`, fieldData);
                setFields(fields.map(f => f.id === currentField.id ? res.data : f));
            } else {
                const res = await api.post('/fields', fieldData);
                setFields([...fields, res.data]);
            }
            setModalOpen(false);
            await loadFields(currentPage);
        } catch (err) {
            console.error('Error saving field:', err);
        }
    };

    return (
        <>
            <div className="container">
                <div className="bg-white p-4 rounded border mt-5 shadow-sm" style={{ maxWidth: '1000px', margin: '40px auto' }}>
                    <div className="d-flex justify-content-between align-items-center mb-3">
                        <h4 className="mb-0">Fields</h4>
                        <Button color="primary" onClick={handleAddField}>
                            <FaPlus className="me-2" /> Add Field
                        </Button>
                    </div>

                    {errorMessage && (
                        <div className="mb-3">
                            <div className="alert alert-danger" role="alert">
                                {errorMessage}
                            </div>
                        </div>
                    )}

                    <Table bordered hover responsive className="mb-0">
                        <thead className="table-light">
                        <tr>
                            <th>Label</th>
                            <th>Type</th>
                            <th>Required</th>
                            <th>Is Active</th>
                            <th style={{ width: '120px' }}>Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        {fields.length > 0 ? (
                            fields.map((field) => (
                                <tr key={field.id}>
                                    <td>{field.label}</td>
                                    <td>{field.type}</td>
                                    <td>
                                        <Badge color={field.required ? 'success' : 'secondary'}>
                                            {field.required ? 'True' : 'False'}
                                        </Badge>
                                    </td>
                                    <td>
                                        <Badge color={field.active ? 'success' : 'secondary'}>
                                            {field.active ? 'True' : 'False'}
                                        </Badge>
                                    </td>
                                    <td>
                                        <Button
                                            color="link"
                                            className="text-primary p-0 me-2"
                                            onClick={() => handleEditField(field)}
                                        >
                                            <FaEdit />
                                        </Button>
                                        <Button
                                            color="link"
                                            className="text-danger p-0"
                                            onClick={() => handleDeleteField(field.id)}
                                        >
                                            <FaTrash />
                                        </Button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="5" className="text-center text-muted">No fields yet</td>
                            </tr>
                        )}
                        </tbody>
                    </Table>

                    <div className="d-flex justify-content-between align-items-center mt-3">
                        <small className="text-muted">
                            1–{fields.length} of {fields.length}
                        </small>

                        <Pagination size="sm" className="mb-0">
                            <PaginationItem disabled={currentPage === 0}>
                                <PaginationLink first onClick={() => handlePageChange(0)} />
                            </PaginationItem>
                            <PaginationItem disabled={currentPage === 0}>
                                <PaginationLink previous onClick={() => handlePageChange(currentPage - 1)} />
                            </PaginationItem>
                            {Array.from({ length: totalPages }, (_, i) => i)
                                .filter(i =>
                                    i === 0 ||
                                    i === totalPages - 1 ||
                                    Math.abs(i - currentPage) <= 1
                                )
                                .map((i, index, arr) => {
                                    const prev = arr[index - 1];
                                    if (prev !== undefined && i - prev > 1) {
                                        return [
                                            <PaginationItem key={`dots-${i}`} disabled><PaginationLink>…</PaginationLink></PaginationItem>,
                                            <PaginationItem key={i} active={i === currentPage}>
                                                <PaginationLink onClick={() => handlePageChange(i)}>{i + 1}</PaginationLink>
                                            </PaginationItem>
                                        ];
                                    }
                                    return (
                                        <PaginationItem key={i} active={i === currentPage}>
                                            <PaginationLink onClick={() => handlePageChange(i)}>{i + 1}</PaginationLink>
                                        </PaginationItem>
                                    );
                                })
                                .flat()
                            }
                            <PaginationItem disabled={currentPage >= totalPages - 1}>
                                <PaginationLink next onClick={() => handlePageChange(currentPage + 1)} />
                            </PaginationItem>
                            <PaginationItem disabled={currentPage >= totalPages - 1}>
                                <PaginationLink last onClick={() => handlePageChange(totalPages - 1)} />
                            </PaginationItem>
                        </Pagination>
                    </div>
                </div>
            </div>

            <FieldModal
                isOpen={modalOpen}
                toggle={() => setModalOpen(false)}
                field={currentField}
                onSave={handleSaveField}
            />
        </>
    );
};

export default FieldsPage;
