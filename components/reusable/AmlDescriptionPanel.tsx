import { FC } from "react";

interface DescriptionPanelProps {
  label: string;
  spaced?: boolean;
  description?: string;
}

export const AmlDescriptionPanel: FC<DescriptionPanelProps> = ({
  label,
  spaced,
  description,
}) => {
  return (
    <div className={"flex flex-col my-4"}>
      <span className="text-sm font-medium">{label}</span>
      <span className="text-sm text-gray-500">{description}</span>
    </div>
  );
};
