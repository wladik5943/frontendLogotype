import React from 'react';
import { Container, Row, Col, Card, CardBody } from 'reactstrap';


const SuccessPage = () => {
    return (
        <>
            <Container className="mt-5">
                <Row className="justify-content-center">
                    <Col md="6" lg="4">
                        <Card className="text-center shadow-sm">
                            <CardBody>
                                <h4 className="mb-2">Thank you!</h4>
                                <p className="text-muted">Your response was saved.</p>
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </>
    );
};

export default SuccessPage;
