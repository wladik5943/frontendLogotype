// FieldRenderer.js
import React from 'react';
import { FormGroup, Label, Input } from 'reactstrap';

const FieldRenderer = ({ field, value, onChange }) => {
    const { id, label, type, required, options = [] } = field;

    const handleChange = (e) => {
        const val = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
        onChange(id, val);
    };

    switch (type) {
        case 'TEXT_SINGLE_LINE':
            return (
                <FormGroup>
                    <Label for={id}>{label}</Label>
                    <Input
                        type="text"
                        id={id}
                        value={value || ''}
                        onChange={handleChange}
                        required={required}
                    />
                </FormGroup>
            );

        case 'TEXT_MULTILINE':
            return (
                <FormGroup>
                    <Label for={id}>{label}</Label>
                    <Input
                        type="textarea"
                        id={id}
                        rows="4"
                        value={value || ''}
                        onChange={handleChange}
                        required={required}
                    />
                </FormGroup>
            );

        case 'RADIO_BUTTON':
            return (
                <FormGroup tag="fieldset">
                    <Label>{label}</Label>
                    {options.map((opt, idx) => (
                        <FormGroup check key={idx}>
                            <Label check>
                                <Input
                                    type="radio"
                                    name={id}
                                    value={opt}
                                    checked={value === opt}
                                    onChange={handleChange}
                                    required={required}
                                />
                                {' '}{opt}
                            </Label>
                        </FormGroup>
                    ))}
                </FormGroup>
            );

        case 'CHECKBOX':
            return (
                <FormGroup tag="fieldset">
                    <Label>{label}</Label>
                    {options.map((opt, idx) => (
                        <FormGroup check key={idx}>
                            <Label check>
                                <Input
                                    type="checkbox"
                                    value={opt}
                                    checked={Array.isArray(value) && value.includes(opt)}
                                    onChange={(e) => {
                                        const checked = e.target.checked;
                                        let newValue = Array.isArray(value) ? [...value] : [];
                                        if (checked) {
                                            newValue.push(opt);
                                        } else {
                                            newValue = newValue.filter(v => v !== opt);
                                        }
                                        onChange(id, newValue);
                                    }}
                                />
                                {' '}{opt}
                            </Label>
                        </FormGroup>
                    ))}
                </FormGroup>
            );

        case 'COMBOBOX':
            return (
                <FormGroup>
                    <Label for={id}>{label}</Label>
                    <Input
                        type="select"
                        id={id}
                        value={value || ''}
                        onChange={handleChange}
                        required={required}
                    >
                        <option value="" disabled>Choose...</option>
                        {options.map((opt, idx) => (
                            <option key={idx} value={opt}>{opt}</option>
                        ))}
                    </Input>
                </FormGroup>
            );

        case 'DATE':
            return (
                <FormGroup>
                    <Label for={id}>{label}</Label>
                    <Input
                        type="date"
                        id={id}
                        value={value || ''}
                        onChange={handleChange}
                        required={required}
                    />
                </FormGroup>
            );

        default:
            return null;
    }
};

export default FieldRenderer;
