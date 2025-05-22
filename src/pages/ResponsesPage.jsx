import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';
import {
    Table,
    Pagination, PaginationItem, PaginationLink,
    Spinner,
    Modal, ModalHeader, ModalBody, Button
} from 'reactstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import api from "../api";
import axios from "axios";

const AnswerPage = () => {
    const { testId } = useParams();
    const [answers, setAnswers] = useState([]);
    const [fields, setFields] = useState([]);
    const [count, setCount] = useState(0);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(true);
    const [testName, setTestName] = useState('');
    const [showAccessDeniedModal, setShowAccessDeniedModal] = useState(false);

    const pageSize = 10;
    const stompRef = useRef(null);
    const navigate = useNavigate();

    const loadAnswers = async (pageToLoad = 0) => {
        setLoading(true);
        try {
            const res = await api.get(`/answer/get/${testId}`, {
                params: { page: pageToLoad, size: pageSize }
            });

            const content = res.data.content || [];
            setAnswers(content);
            setTotalPages(res.data.totalPages || 1);
            setPage(res.data.number || 0);
            setCount(res.data.totalElements || 0);

            if (content.length > 0) {
                setTestName(content[0].questionnaireName || '');
                if (content[0].fields) {
                    setFields(content[0].fields);
                }
            }
        } catch (err) {
            if (err.response?.status === 403) {
                setShowAccessDeniedModal(true);
            } else {
                console.error("Ошибка при загрузке ответов:", err);
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadAnswers();
    }, [testId]);

    useEffect(() => {
        const token = sessionStorage.getItem('accessToken');
        const socket = new SockJS(`${process.env.REACT_APP_API_URL || ''}/ws?access_token=${token}`);
        const stompClient = new Client({
            webSocketFactory: () => socket,
            connectHeaders: {
                Authorization: `Bearer ${token}`,
            },
            onConnect: () => {
                stompClient.subscribe(`/topic/test/${testId}/answers/count`, (message) => {
                    const data = JSON.parse(message.body);
                    setCount(data.count);
                    setTotalPages(Math.ceil(data.count / pageSize));
                });

                stompClient.subscribe(`/topic/test/${testId}/answers/new`, (message) => {
                    const newAnswer = JSON.parse(message.body);

                    if (page === 0) {
                        setAnswers(prev => {
                            const updated = [newAnswer, ...prev];
                            return updated.slice(0, pageSize);
                        });
                    }

                    if (newAnswer.fields && newAnswer.fields.length > 0) {
                        setFields(newAnswer.fields);
                    }

                    if (newAnswer.questionnaireName) {
                        setTestName(newAnswer.questionnaireName);
                    }
                });
            },
            debug: () => {},
            reconnectDelay: 5000,
        });

        stompClient.activate();
        stompRef.current = stompClient;

        return () => {
            stompRef.current?.deactivate();
            stompRef.current = null;
        };
    }, [testId, page]);

    const handlePageChange = (newPage) => {
        if (newPage >= 0 && newPage < totalPages) {
            loadAnswers(newPage);
        }
    };

    return (
        <div className="container mt-5">
            <div className="card">
                <div className="card-header d-flex justify-content-between align-items-center">
                    <h4>{testName}</h4>
                    <span className="badge bg-primary fs-5">количество ответов: {count}</span>
                </div>
                <div className="card-body">
                    {loading ? (
                        <div className="text-center">
                            <Spinner color="primary" />
                        </div>
                    ) : answers.length > 0 ? (
                        <>
                            <Table bordered hover responsive>
                                <thead className="table-light">
                                <tr>
                                    <th>#</th>
                                    {fields.map(field => (
                                        <th key={field.id}>{field.label}</th>
                                    ))}
                                </tr>
                                </thead>
                                <tbody>
                                {answers.map((answer, index) => (
                                    <tr key={answer.id}>
                                        <td>{index + 1 + page * pageSize}</td>
                                        {fields.map(field => {
                                            const match = answer.answers.find(a => a.fieldId === field.id);
                                            return <td key={field.id}>{match ? match.value : '-'}</td>;
                                        })}
                                    </tr>
                                ))}
                                </tbody>
                            </Table>

                            <div className="d-flex justify-content-end">
                                <Pagination size="sm">
                                    <PaginationItem disabled={page === 0}>
                                        <PaginationLink first onClick={() => handlePageChange(0)} />
                                    </PaginationItem>
                                    <PaginationItem disabled={page === 0}>
                                        <PaginationLink previous onClick={() => handlePageChange(page - 1)} />
                                    </PaginationItem>

                                    {Array.from({ length: totalPages }, (_, i) => i)
                                        .filter(i => i === 0 || i === totalPages - 1 || Math.abs(i - page) <= 1)
                                        .map(i => (
                                            <PaginationItem key={i} active={i === page}>
                                                <PaginationLink onClick={() => handlePageChange(i)}>
                                                    {i + 1}
                                                </PaginationLink>
                                            </PaginationItem>
                                        ))}

                                    <PaginationItem disabled={page >= totalPages - 1}>
                                        <PaginationLink next onClick={() => handlePageChange(page + 1)} />
                                    </PaginationItem>
                                    <PaginationItem disabled={page >= totalPages - 1}>
                                        <PaginationLink last onClick={() => handlePageChange(totalPages - 1)} />
                                    </PaginationItem>
                                </Pagination>
                            </div>
                        </>
                    ) : (
                        <p className="text-muted">Ответов пока нет.</p>
                    )}
                </div>
            </div>

            <Modal isOpen={showAccessDeniedModal} centered backdrop="static">
                <ModalHeader>Access Denied</ModalHeader>
                <ModalBody>
                    У вас нет доступа к этому тесту. Вы будете перенаправлены на главную страницу.
                    <div className="mt-3 d-flex justify-content-end">
                        <Button color="primary" onClick={() => navigate('/')}>
                            Ок
                        </Button>
                    </div>
                </ModalBody>
            </Modal>
        </div>
    );
};

export default AnswerPage;
