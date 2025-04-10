import { Checkbox } from "@radix-ui/react-checkbox";
import { FC } from "react";

interface LabelCheckboxProps {
    label: string;
    readOnly?: boolean;
    checked?: boolean;
    description?: string;
    onChange: (newValue: boolean) => void;
}

export const LabelCheckbox: FC<LabelCheckboxProps> = ({
    label,
    readOnly = false,
    checked = false,
    description,
    onChange,
}) => {
    const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        onChange(event.target.checked);
    };
    return (
        <div className="flex items-start">
            {!readOnly && (
                <div className="mr-3">
                    <Checkbox
                        checked={checked}
                       // onCheckedChange={handleCheckboxChange}
                    />
                </div>
            )}
            <div className="flex flex-col space-y-1 mt-1">
                <span className="text-sm font-medium">{label}</span>
                {description && <span className="text-sm text-gray-500">{description}</span>}
            </div>
        </div>
    );
};
