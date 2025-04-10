import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { FC } from "react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface FormInputProps {
    name: string;
    label: string;
    type: string;
    control: any;
    selectOptions?: string[];
}

export const CustomFormInput: FC<FormInputProps> = ({
    name,
    label,
    type,
    control,
    selectOptions = [''],
}) => {

    const renderContent = (field: any) => {
        switch (type) {
            case 'text':
                return (
                    <Input placeholder={label} type="text" />
                );
            case 'textarea':
                return (
                    <textarea
                        placeholder={label}
                        {...field}
                        className="w-full h-auto p-2 border border-gray-300 rounded resize-y"
                        rows={4}
                    />
                );
            case 'select':
                return (
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
                );
        }
    }

    return (
        <FormField
            control={control}
            name={name}
            render={({ field }) => (
                <FormItem className="flex m-3">
                    <FormLabel className="w-full">{label}</FormLabel>
                    <FormControl className="w-full">
                        {renderContent(field)}
                    </FormControl>
                    <FormMessage />
                </FormItem>
            )}
        />
    );
};
