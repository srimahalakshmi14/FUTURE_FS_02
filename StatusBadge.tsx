import { LeadStatus } from "@/types/lead";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const statusConfig: Record<LeadStatus, { label: string; className: string }> = {
  new: { label: "New", className: "bg-info/15 text-info border-info/30" },
  contacted: { label: "Contacted", className: "bg-warning/15 text-warning border-warning/30" },
  converted: { label: "Converted", className: "bg-success/15 text-success border-success/30" },
};

export function StatusBadge({ status }: { status: LeadStatus }) {
  const config = statusConfig[status];
  return (
    <Badge variant="outline" className={cn("font-medium capitalize text-xs", config.className)}>
      {config.label}
    </Badge>
  );
}
