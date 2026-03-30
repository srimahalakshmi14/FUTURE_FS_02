import { useState } from "react";
import { Lead, LeadStatus, getLeadId } from "@/types/lead";
import { StatusBadge } from "./StatusBadge";
import { leadsAPI } from "@/lib/api";
import { formatDistanceToNow, format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { X, Mail, Phone, Users, Calendar, Tag, MessageSquare, Trash2 } from "lucide-react";
import { toast } from "sonner";

interface LeadDetailProps {
  lead: Lead;
  onClose: () => void;
  onUpdate: () => void;
}

export function LeadDetail({ lead, onClose, onUpdate }: LeadDetailProps) {
  const [noteText, setNoteText] = useState("");
  const leadId = getLeadId(lead);

  const handleStatusChange = async (status: LeadStatus) => {
    try {
      await leadsAPI.updateStatus(leadId, status);
      onUpdate();
      toast.success(`Status updated to ${status}`);
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Failed to update status");
    }
  };

  const handleAddNote = async () => {
    if (!noteText.trim()) return;
    try {
      await leadsAPI.addNote(leadId, noteText.trim());
      setNoteText("");
      onUpdate();
      toast.success("Note added");
    } catch (error) {
      console.error("Error adding note:", error);
      toast.error("Failed to add note");
    }
  };

  const handleDelete = async () => {
    if (confirm("Delete this lead? This cannot be undone.")) {
      try {
        await leadsAPI.delete(leadId);
        onUpdate();
        onClose();
        toast.success("Lead deleted");
      } catch (error) {
        console.error("Error deleting lead:", error);
        toast.error("Failed to delete lead");
      }
    }
  };

  return (
    <div className="glass-card p-6 animate-fade-in h-full flex flex-col">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h2 className="text-2xl font-heading font-semibold text-foreground">{lead.name}</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Added {formatDistanceToNow(new Date(lead.createdAt), { addSuffix: true })}
          </p>
        </div>
        <Button variant="ghost" size="icon" onClick={onClose} className="text-muted-foreground hover:text-foreground">
          <X className="h-5 w-5" />
        </Button>
      </div>

      {/* Info grid */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <InfoItem icon={<Mail className="h-4 w-4" />} label="Email" value={lead.email} />
        <InfoItem icon={<Phone className="h-4 w-4" />} label="Phone" value={lead.phone} />
        <InfoItem icon={<Calendar className="h-4 w-4" />} label="Event" value={lead.eventType} />
        <InfoItem icon={<Users className="h-4 w-4" />} label="Guests" value={String(lead.guestCount)} />
        <InfoItem icon={<Tag className="h-4 w-4" />} label="Source" value={lead.source} />
      </div>

      {/* Status */}
      <div className="mb-6">
        <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2 block">Status</label>
        <Select value={lead.status} onValueChange={(v) => handleStatusChange(v as LeadStatus)}>
          <SelectTrigger className="bg-secondary border-border">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="new">New</SelectItem>
            <SelectItem value="contacted">Contacted</SelectItem>
            <SelectItem value="converted">Converted</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Notes */}
      <div className="flex-1 flex flex-col min-h-0">
        <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2 flex items-center gap-1">
          <MessageSquare className="h-3 w-3" /> Notes & Follow-ups
        </label>
        <div className="flex gap-2 mb-3">
          <Textarea
            value={noteText}
            onChange={(e) => setNoteText(e.target.value)}
            placeholder="Add a note or follow-up..."
            className="bg-secondary border-border resize-none text-sm"
            rows={2}
          />
          <Button onClick={handleAddNote} disabled={!noteText.trim()} className="self-end shrink-0">
            Add
          </Button>
        </div>
        <div className="flex-1 overflow-y-auto space-y-2 pr-1">
          {lead.notes.length === 0 && (
            <p className="text-sm text-muted-foreground italic">No notes yet</p>
          )}
          {lead.notes.map((note) => (
            <div key={note._id || note.id} className="bg-secondary/60 rounded-md p-3 text-sm">
              <p className="text-foreground">{note.text}</p>
              <p className="text-xs text-muted-foreground mt-1">
                {format(new Date(note.createdAt), "MMM d, yyyy 'at' h:mm a")}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-border">
        <Button variant="ghost" size="sm" onClick={handleDelete} className="text-destructive hover:text-destructive hover:bg-destructive/10">
          <Trash2 className="h-4 w-4 mr-1" /> Delete Lead
        </Button>
      </div>
    </div>
  );
}

function InfoItem({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-start gap-2">
      <span className="text-muted-foreground mt-0.5">{icon}</span>
      <div>
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-sm text-foreground capitalize">{value}</p>
      </div>
    </div>
  );
}
