import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { FC, useEffect, useState } from "react";

interface RadioInputProps {
  labelsOnTop?: boolean;
  hideLabels?: boolean;
  initValue: string;
  options: string[];
  onValueChange: (newValue: string) => void;
}

export const RadioInput: FC<RadioInputProps> = ({
  labelsOnTop = false,
  hideLabels = true,
  initValue,
  options,
  onValueChange
}) => {
  const [radioGroupValue, setValue] = useState(initValue);

  useEffect(() => {
    setValue(initValue);
  }, [initValue]);

  const handleValueChange = (newValue: string) => {
    setValue(newValue);
    onValueChange(newValue);
  };

  if (labelsOnTop) {
    return (
      <div>
        <div className="flex items-start justify-start">
          <div className='flex items-stretch space-x-4'>
            {options.map((option) => (
              <span>{option}</span>
            ))}
          </div>
        </div>
        <RadioGroup value={radioGroupValue} onValueChange={handleValueChange} className="flex space-x-4">
          <div className="flex items-center justify-center">
            <div className='flex items-center space-x-4 m-2'>
              {options.map((option) => (
                <RadioGroupItem value={option} className="h-5 w-5" />
              ))}
            </div>
          </div >
        </RadioGroup >
      </div >
    );
  }
  else {
    return (
      <RadioGroup value={radioGroupValue} onValueChange={handleValueChange} className="flex space-x-4">
        <div className="flex items-center justify-center">
          <div className='flex items-stretch space-x-4'>
            {options.map((option) => (
              <label className="flex items-center space-x-2">
                {!hideLabels && <span>{option}</span>}
                <RadioGroupItem value={option} className="h-5 w-5" />
              </label>
            ))}
          </div>
        </div >
      </RadioGroup>
    );
  }
};
