import React from 'react';

interface ControlledCheckboxProps {
    checked: boolean
    label?: string;
    labelPosition?: 'LEFT' | 'RIGHT';
    name?: string;
    disabled?: boolean;
    labelCSSClasses?: string;
    inputCSSClasses?: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function ControlledCheckbox(props: ControlledCheckboxProps) {
    const {checked, onChange, label, name, disabled, labelPosition, labelCSSClasses, inputCSSClasses } = props;

    return (
        <label htmlFor={name} className={labelCSSClasses}>
            {label && labelPosition === 'LEFT' ? label + ' ' : ''}
            <input className={inputCSSClasses} type="checkbox" name={name} checked={checked} onChange={(e) => onChange(e)} disabled={disabled} />
            {label && labelPosition === 'RIGHT' ? ' ' + label : ''}
        </label>
    );
}