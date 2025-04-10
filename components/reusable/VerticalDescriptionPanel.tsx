import { FC } from "react";

interface DescriptionPanelProps {
  label: string;
  spaced?: boolean;
  description?: string;
}

export const VerticalDescriptionPanel: FC<DescriptionPanelProps> = ({
  label,
  spaced,
  description,
}) => {
  return (
    <div className={`flex flex-col ${spaced ? 'space-y-1 mt-4' : '-space-y-1'}`}>
      <span className="text-sm font-medium">{label}</span>
      <span className="text-sm text-gray-500">{description}</span>
    </div>
  );
};
