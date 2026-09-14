import { LucideIcon } from "lucide-react";

interface OperatorStatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  color?: "teal" | "green" | "blue" | "amber" | "purple";
}

const colorMap = {
  teal:   "bg-teal-50 text-teal-700 border-teal-100",
  green:  "bg-green-50 text-green-700 border-green-100",
  blue:   "bg-blue-50 text-blue-700 border-blue-100",
  amber:  "bg-amber-50 text-amber-700 border-amber-100",
  purple: "bg-purple-50 text-purple-700 border-purple-100",
};
const iconColorMap = {
  teal: "text-teal-600", green: "text-green-600", blue: "text-blue-600",
  amber: "text-amber-600", purple: "text-purple-600",
};

const OperatorStatCard = ({ title, value, subtitle, icon: Icon, color = "teal" }: OperatorStatCardProps) => (
  <div className={`rounded-xl border p-5 flex items-start gap-4 ${colorMap[color]}`}>
    <div className="mt-0.5">
      <Icon size={22} className={iconColorMap[color]} />
    </div>
    <div>
      <p className="text-sm font-medium opacity-80">{title}</p>
      <p className="text-2xl font-bold mt-0.5">{value}</p>
      {subtitle && <p className="text-xs opacity-70 mt-1">{subtitle}</p>}
    </div>
  </div>
);

export default OperatorStatCard;
