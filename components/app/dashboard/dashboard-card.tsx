import { Card, CardContent } from "@/components/ui/card";

interface DashboardCardProps {
  Icon?: React.FC<{}>;
  title?: string;
  underTimeTitle?: string;
  underTime?: number;
  overTimeTitle?: string;
  overTime?: number;
  total?: number;
}

export const DashboardCard: React.FC<DashboardCardProps> = ({
  Icon,
  title,
  underTimeTitle,
  underTime,
  overTimeTitle,
  overTime,
  total,
}) => {
  return (
    <Card className="rounded-2xl border-primary px-2 py-6">
      <CardContent className="font-medium">
        <div className="flex flex-row items-center mb-1 space-x-2">
          <span className="w-14 h-14 mb-1 text-primary border-primary border-2 rounded-full flex items-center p-3.5">
            {Icon && <Icon />}
          </span>
          <span className="font-semibold">{title}</span>
        </div>
        <div className="flex flex-col">
          <span className="flex justify-between text-lg font-semibold text-secondary  ">
            <span className="font-semibold">{underTimeTitle} </span>{" "}
            <span>{underTime}</span>
          </span>
          <span className="flex justify-between text-lg font-semibold text-secondary ">
            <span className="font-semibold">{overTimeTitle} </span>{" "}
            <span>{overTime}</span>
          </span>
          <span className="flex justify-between text-lg font-semibold text-secondary ">
            <span className="font-semibold">Total </span>
            <span className="justify-end">{total}</span>
          </span>
        </div>
      </CardContent>
    </Card>
  );
};
