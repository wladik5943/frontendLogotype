import React from 'react';
import {
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button,
    Input,
    InputGroup,
    InputGroupText
} from 'reactstrap';

const SuccessModal = ({ isOpen, onClose, testId, onCreateAnother}) => {
    const testUrl = `${window.location.origin}/questionnaires/${testId}`;

    const copyToClipboard = () => {
        navigator.clipboard.writeText(testUrl)
            .catch(() => alert('Не удалось скопировать ссылку'));
    };

    return (
        <Modal isOpen={isOpen} toggle={onClose}>
            <ModalHeader toggle={onClose}>Тест успешно создан</ModalHeader>
            <ModalBody>
                <p>Анкета была успешно сохранена.</p>
                <p>Ссылка для прохождения анкеты:</p>

                <InputGroup className="mb-3">
                    <Input value={testUrl} readOnly />
                    <Button color="secondary" onClick={copyToClipboard}>
                        Копировать
                    </Button>
                </InputGroup>

                <a
                    href={testUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    Перейти к анкете
                </a>
            </ModalBody>
            <ModalFooter>
                <Button color="primary" onClick={onCreateAnother}>
                    Создать ещё одну анкету
                </Button>
                <Button color="secondary" onClick={onClose}>
                    Вернуться к списку анкет
                </Button>
            </ModalFooter>
        </Modal>
    );
};

export default SuccessModal;
