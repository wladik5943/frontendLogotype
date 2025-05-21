import React, { useEffect, useState } from 'react';
import {
    Container,
    Spinner,
    Card,
    CardBody,
    CardTitle,
    Button,
    Row,
    Col
} from 'reactstrap';
import {useLocation, useNavigate} from 'react-router-dom';
import api from '../api';
import {EditTestModal} from "../modalWindows/EditTestModal";

const TestSelectionPage = () => {
    const [tests, setTests] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const location = useLocation();
    const mode = new URLSearchParams(location.search).get("mode") || "all";
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [currentEditTest, setCurrentEditTest] = useState(null);



    const fetchTests = async () => {
        setLoading(true);
        try {
            const url = mode === "mine" ? "/test/mine" : "/test/all";
            const response = await api.get(url);
            setTests(response.data || []);
        } catch (err) {
            console.error('Ошибка при загрузке тестов:', err);
        } finally {
            setLoading(false);
        }
    };


    useEffect(() => {

        fetchTests();
    }, [mode]);


    const openEditModal = (test) => {
        setCurrentEditTest(test);
        setEditModalOpen(true);
    };

    const handleSelect = (id) => {
        if (mode === 'mine') {
            navigate(`/answers/${id}`);
        } else {
            navigate(`/questionnaires/${id}`);
        }
    };


    return (
        <Container className="mt-5">
            {mode == 'all'&&
                <h3>Выберите тест</h3>
            }
            {loading ? (
                <div className="text-center mt-4">
                    <Spinner color="primary" />
                </div>
            ) :tests.length === 0 ? (
                <div className="text-center mt-4">
                    <h5>Тут пусто.</h5>
                </div>
            ) : (
                <Row className="mt-4">
                    {tests
                        .filter(test => mode !== 'all' || test.active)
                        .map((test) => (
                        <Col md="6" lg="4" className="mb-4" key={test.id}>
                            <Card>
                                <Card className="h-100">
                                    <CardBody className="d-flex flex-column">
                                        <CardTitle tag="h5" className="mb-3 card-title-fixed">{test.title}</CardTitle>

                                        <div className="mt-auto d-flex flex-column gap-2">
                                            {mode === 'mine' && (
                                                <div className="form-check form-switch">
                                                    <input
                                                        className="form-check-input"
                                                        type="checkbox"
                                                        id={`activeSwitch-${test.id}`}
                                                        checked={test.active}
                                                        onChange={async () => {
                                                            try {
                                                                await api.patch(`/test/${test.id}/status`);
                                                                // обновим локальный список тестов
                                                                setTests(prev =>
                                                                    prev.map(t =>
                                                                        t.id === test.id ? {...t, active: !t.active} : t
                                                                    )
                                                                );
                                                            } catch (err) {
                                                                console.error('Ошибка обновления активности анкеты', err);
                                                                alert('Не удалось изменить статус активности');
                                                            }
                                                        }}
                                                    />
                                                    <label
                                                        className="form-check-label"
                                                        htmlFor={`activeSwitch-${test.id}`}
                                                    >
                                                        {test.active ? 'Активна' : 'Неактивна'}
                                                    </label>
                                                </div>
                                            )}

                                            {mode === 'mine' ? (
                                                <div className="d-flex flex-wrap gap-2">
                                                    <Button color="info" onClick={() => handleSelect(test.id)}>
                                                        Ответы на анкету
                                                    </Button>
                                                    <Button color="warning" onClick={() => openEditModal(test)}>
                                                        Редактировать
                                                    </Button>
                                                </div>
                                            ) : (
                                                <Button color="primary" onClick={() => handleSelect(test.id)}>
                                                    Перейти к тесту
                                                </Button>
                                            )}
                                        </div>

                                    </CardBody>
                                </Card>
                            </Card>
                        </Col>
                    ))}
                </Row>
            )}
            {currentEditTest && (
                <EditTestModal
                    isOpen={editModalOpen}
                    toggle={() => setEditModalOpen(!editModalOpen)}
                    test={currentEditTest}
                    onUpdated={() => {
                        setEditModalOpen(false);
                        fetchTests()
                    }}
                />
            )}
        </Container>
    );
};

export default TestSelectionPage;
