import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { FC, useEffect, useState } from "react";
import { RadioInput } from "./RadioInput";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface RadioSimpleInputProps {
    name: string;
    label: string;
    type: string;
    control: any;
    useSelectInput?: boolean,
    initValue: string;
    selectOptions?: string[];
    onValueChange: (newValue: string) => void;
}

export const RadioSimpleInput: FC<RadioSimpleInputProps> = ({
    name,
    label,
    type,
    control,
    initValue,
    selectOptions = [''],
    useSelectInput = true,
    onValueChange,
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

    return (
        <div>
            <span className="text-sm font-medium">{label}</span>
            <div className="flex">
                <div className="m-5">
                    <RadioInput
                        options={radioOptions}
                        initValue={radioValue}
                        hideLabels={false}
                        onValueChange={handleRadioChange}
                    />
                </div>
                <div className="w-full">
                    {radioValue === "Yes" && (
                        <FormField
                            control={control}
                            name={name}
                            render={({ field }) => (
                                <FormItem>
                                    {useSelectInput ? (
                                        <>
                                            <FormLabel>{type}</FormLabel>
                                            <FormControl>
                                                <Select
                                                    value={field.value || "Select an option"}
                                                    onValueChange={(value) => {
                                                        field.onChange(value);
                                                    }}>
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
                                            </FormControl>
                                            <FormMessage />
                                        </>
                                    ) : (
                                        <Input placeholder={label} type="hidden" value="Yes" />
                                    )}
                                </FormItem>
                            )}
                        />
                    )}

                </div>
            </div>
        </div >
    );
};
