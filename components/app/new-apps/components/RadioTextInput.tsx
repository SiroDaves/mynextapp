import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { FC, useEffect, useState } from "react";
import { RadioInput } from "./RadioInput";
import { Input } from "@/components/ui/input";
import { VerticalDescriptionPanel } from "@/components/reusable/VerticalDescriptionPanel";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { format } from "date-fns";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

interface RadioTextInputProps {
    name: string;
    label: string;
    type: string;
    description?: string;
    control: any;
    useTextInput?: boolean,
    hideRadioLabels?: boolean,
    readOnly?: boolean,
    useTextArea?: boolean,
    useDateInput?: boolean,
    initValue: string;
    defaultValue?: string;
    selectOptions?: string[];
    onValueChange: (newValue: string) => void;
}

export const RadioTextInput: FC<RadioTextInputProps> = ({
    name,
    label,
    type,
    description,
    control,
    initValue,
    defaultValue = "No",
    onValueChange,
    useTextInput = true,
    useTextArea = false,
    useDateInput = false,
    selectOptions = [''],
    readOnly = false,
    hideRadioLabels = true,
}) => {
    const [radioValue, setRadioValue] = useState(initValue);
    const radioOptions = ["Yes", "No"];

    useEffect(() => {
        setRadioValue(initValue);
    }, [initValue]);

    const handleRadioChange = (newValue: string) => {
        setRadioValue(newValue);
        onValueChange(newValue);
    };

    const renderTextInput = (field: any) => {
        if (useTextArea) {
            return (
                <textarea
                    placeholder={label}
                    {...field}
                    className="w-full h-auto p-2 border border-gray-300 rounded resize-y"
                    rows={4}
                />
            );
        } else if (useDateInput) {
            const [startDate, setStartDate] = useState<Date | null>(new Date());

            return (
                <DatePicker
                    showIcon
                    selected={startDate}
                    enableTabLoop
                    onChange={(date: Date | null) => {
                        setStartDate(date);
                        if (date) {
                            field.onChange(format(date, "yyyyMMdd000000"));
                        } else {
                            field.onChange("");
                        }
                    }}
                    isClearable
                    placeholderText="Select a date"
                />
            );

        } else {
            return (
                <Input placeholder={label} {...field} />
            );
        }
    }

    return (
        <div className="flex">
            <div className="w-full">
                <VerticalDescriptionPanel
                    spaced
                    label={label}
                    description={description}
                />
            </div>
            {!readOnly && (
                <div className="m-5">
                    <RadioInput
                        options={radioOptions}
                        initValue={radioValue}
                        hideLabels={hideRadioLabels}
                        onValueChange={handleRadioChange}
                    />
                </div>
            )}

            <div className="w-full">
                {radioValue === defaultValue && (
                    <FormField
                        control={control}
                        name={name}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>{type}</FormLabel>
                                <FormControl>
                                    {useTextInput ? (
                                        renderTextInput(field)
                                    ) : (
                                        <Select
                                            value={field.value || "Select an option"}
                                            onValueChange={(value) => {
                                                field.onChange(value);
                                            }}
                                        >
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem key="option" value="Select an option">Select an option</SelectItem>
                                                {selectOptions.map((option) => (
                                                    <SelectItem key={option} value={option}>
                                                        {option}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    )}
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                )}
            </div>
        </div>
    );
};
