import { useState, useMemo, useCallback, useEffect } from "react";
import { Lead, LeadStatus } from "@/types/lead";
import { useAuth } from "@/contexts/AuthContext";
import { leadsAPI } from "@/lib/api";
import { LeadTable } from "@/components/LeadTable";
import { LeadDetail } from "@/components/LeadDetail";
import { AddLeadForm } from "@/components/AddLeadForm";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Search, UtensilsCrossed, Users, UserCheck, UserPlus, ArrowUpRight, LogOut } from "lucide-react";

export default function Index() {
  const { user, logout } = useAuth();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<LeadStatus | "all">("all");
  const [isLoading, setIsLoading] = useState(true);

  const fetchLeads = useCallback(async () => {
    try {
      const data = await leadsAPI.getAll();
      setLeads(data);
    } catch (error) {
      console.error("Error fetching leads:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const refresh = useCallback(() => {
    fetchLeads();
    if (selectedLead) {
      const found = leads.find((l) => l.id === selectedLead.id);
      setSelectedLead(found || null);
    }
  }, [fetchLeads, selectedLead, leads]);

  useEffect(() => {
    fetchLeads();
  }, [fetchLeads]);

  const filteredLeads = useMemo(() => {
    return leads.filter((lead) => {
      const matchesSearch =
        !searchQuery ||
        lead.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lead.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lead.eventType.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === "all" || lead.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [leads, searchQuery, statusFilter]);

  const stats = useMemo(() => ({
    total: leads.length,
    new: leads.filter((l) => l.status === "new").length,
    contacted: leads.filter((l) => l.status === "contacted").length,
    converted: leads.filter((l) => l.status === "converted").length,
  }), [leads]);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/50 bg-card/30 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-lg bg-primary/15 flex items-center justify-center">
              <UtensilsCrossed className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h1 className="text-lg font-heading font-semibold text-foreground">Restaurant CRM</h1>
              <p className="text-xs text-muted-foreground">Lead Management</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-muted-foreground">Welcome, {user?.name}</span>
            <Button variant="outline" size="sm" onClick={logout}>
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
            <AddLeadForm onAdd={refresh} />
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          <StatCard label="Total Leads" value={stats.total} icon={<Users className="h-4 w-4" />} />
          <StatCard label="New" value={stats.new} icon={<UserPlus className="h-4 w-4" />} accent="info" />
          <StatCard label="Contacted" value={stats.contacted} icon={<ArrowUpRight className="h-4 w-4" />} accent="warning" />
          <StatCard label="Converted" value={stats.converted} icon={<UserCheck className="h-4 w-4" />} accent="success" />
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search leads..."
              className="pl-9 bg-card border-border"
            />
          </div>
          <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as LeadStatus | "all")}>
            <SelectTrigger className="w-full sm:w-44 bg-card border-border">
              <SelectValue placeholder="Filter status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="new">New</SelectItem>
              <SelectItem value="contacted">Contacted</SelectItem>
              <SelectItem value="converted">Converted</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Content */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          <div className={selectedLead ? "lg:col-span-3" : "lg:col-span-5"}>
            <LeadTable leads={filteredLeads} onSelect={setSelectedLead} selectedId={selectedLead?.id} />
          </div>
          {selectedLead && (
            <div className="lg:col-span-2">
              <div className="sticky top-24">
                <LeadDetail lead={selectedLead} onClose={() => setSelectedLead(null)} onUpdate={refresh} />
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

function StatCard({ label, value, icon, accent }: { label: string; value: number; icon: React.ReactNode; accent?: string }) {
  const accentMap: Record<string, string> = {
    info: "text-info",
    warning: "text-warning",
    success: "text-success",
  };
  return (
    <div className="glass-card p-4">
      <div className="flex items-center justify-between mb-2">
        <span className={`${accent ? accentMap[accent] : "text-muted-foreground"}`}>{icon}</span>
      </div>
      <p className="text-2xl font-semibold text-foreground">{value}</p>
      <p className="text-xs text-muted-foreground">{label}</p>
    </div>
  );
}
