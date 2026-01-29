// src/components/CheckboxInput/index.tsx
import { CheckBox } from "../CheckBox";
import { CheckboxInputProps } from "./types";

export const CheckboxInput: React.FC<CheckboxInputProps> = ({
    field,
    label,
    disabled = false,
    className = "",
    checkedIcon,
    uncheckedIcon,
    size = "md",
    variant = "default",
}) => {
    return (
        <CheckBox
            checked={!!field.value}
            onChange={() => field.onChange(!field.value)}
            label={label}
            disabled={disabled}
            className={className}
            checkedIcon={checkedIcon}
            uncheckedIcon={uncheckedIcon}
            size={size}
        />
    );
};
