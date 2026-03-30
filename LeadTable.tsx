import { Lead, LeadStatus, getLeadId } from "@/types/lead";
import { StatusBadge } from "./StatusBadge";
import { formatDistanceToNow } from "date-fns";
import { Mail, Phone, Users, ChevronRight } from "lucide-react";

interface LeadTableProps {
  leads: Lead[];
  onSelect: (lead: Lead) => void;
  selectedId?: string;
}

const sourceLabels: Record<string, string> = {
  website: "Website",
  "walk-in": "Walk-in",
  phone: "Phone",
  "social-media": "Social Media",
  referral: "Referral",
};

export function LeadTable({ leads, onSelect, selectedId }: LeadTableProps) {
  if (leads.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
        <Users className="h-12 w-12 mb-4 opacity-40" />
        <p className="text-lg font-medium">No leads found</p>
        <p className="text-sm">Add your first lead to get started</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {leads.map((lead) => {
        const leadId = getLeadId(lead);
        return (
          <button
            key={leadId}
            onClick={() => onSelect(lead)}
            className={`w-full text-left p-4 rounded-lg border transition-all duration-200 hover:border-primary/40 hover:bg-card/90 ${
              selectedId === leadId
                ? "border-primary/50 bg-card shadow-md shadow-primary/5"
                : "border-border/50 bg-card/50"
            }`}
          >
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-semibold text-foreground truncate">{lead.name}</h3>
                <StatusBadge status={lead.status} />
              </div>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1 truncate">
                  <Mail className="h-3 w-3 shrink-0" /> {lead.email}
                </span>
                <span className="hidden sm:flex items-center gap-1">
                  <Phone className="h-3 w-3" /> {lead.phone}
                </span>
              </div>
              <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                <span className="bg-secondary px-2 py-0.5 rounded">{lead.eventType}</span>
                <span>{lead.guestCount} guests</span>
                <span>{sourceLabels[lead.source]}</span>
                <span className="ml-auto">{formatDistanceToNow(new Date(lead.createdAt), { addSuffix: true })}</span>
              </div>
            </div>
            <ChevronRight className="h-5 w-5 text-muted-foreground shrink-0 mt-1" />
          </div>
        </button>
        );
      })}
    </div>
  );
}
