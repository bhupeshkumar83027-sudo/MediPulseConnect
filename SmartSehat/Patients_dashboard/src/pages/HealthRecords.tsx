import React, { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { motion } from "framer-motion";
import { FolderHeart, Upload, FileText, FlaskConical, History, Download, Eye, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import recordsImg from "@/assets/records-illustration.png";

interface Record {
  id: number;
  name: string;
  type: "prescription" | "lab_report" | "history";
  date: string;
  doctor: string;
  size: string;
}

const records: Record[] = [
  { id: 1, name: "Blood Test Report", type: "lab_report", date: "Feb 18, 2026", doctor: "Dr. Priya Sharma", size: "2.4 MB" },
  { id: 2, name: "Chest X-Ray Results", type: "lab_report", date: "Feb 10, 2026", doctor: "Dr. Vikram Singh", size: "5.1 MB" },
  { id: 3, name: "Cardiology Prescription", type: "prescription", date: "Feb 15, 2026", doctor: "Dr. Priya Sharma", size: "340 KB" },
  { id: 4, name: "Dermatology Follow-up", type: "prescription", date: "Jan 28, 2026", doctor: "Dr. Rajesh Kumar", size: "280 KB" },
  { id: 5, name: "Annual Health Checkup", type: "history", date: "Jan 5, 2026", doctor: "Dr. Anita Patel", size: "1.2 MB" },
  { id: 6, name: "Allergy Test Results", type: "lab_report", date: "Dec 20, 2025", doctor: "Dr. Meera Joshi", size: "890 KB" },
  { id: 7, name: "Diabetes Monitoring Log", type: "history", date: "Dec 15, 2025", doctor: "Dr. Anita Patel", size: "450 KB" },
];

const HealthRecords: React.FC = () => {
  const { t } = useLanguage();
  const [tab, setTab] = useState<"all" | "prescription" | "lab_report" | "history">("all");

  const tabItems = [
    { key: "all", label: "All Records", icon: FolderHeart },
    { key: "prescription", label: t("records.prescriptions"), icon: FileText },
    { key: "lab_report", label: t("records.reports"), icon: FlaskConical },
    { key: "history", label: t("records.history"), icon: History },
  ] as const;

  const typeIcon = { prescription: FileText, lab_report: FlaskConical, history: History };
  const typeColor = {
    prescription: "bg-primary/10 text-primary",
    lab_report: "bg-info/10 text-info",
    history: "bg-success/10 text-success",
  };

  const filtered = tab === "all" ? records : records.filter((r) => r.type === tab);

  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <img src={recordsImg} alt="Records" className="w-14 h-14 rounded-xl object-cover" />
          <div>
            <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
              <FolderHeart className="w-6 h-6 text-primary" />
              {t("records.title")}
            </h1>
            <p className="text-sm text-muted-foreground mt-1">{filtered.length} records found</p>
          </div>
        </div>
        <Button variant="hero">
          <Upload className="w-4 h-4" />
          {t("records.upload")}
        </Button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {tabItems.map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
              tab === key ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-secondary"
            }`}
          >
            <Icon className="w-3.5 h-3.5" />
            {label}
          </button>
        ))}
      </div>

      {/* Records */}
      <div className="space-y-3">
        {filtered.map((rec, i) => {
          const Icon = typeIcon[rec.type];
          return (
            <motion.div
              key={rec.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              className="glass-card rounded-xl p-4 flex items-center gap-4"
            >
              <div className={`p-3 rounded-xl ${typeColor[rec.type]}`}>
                <Icon className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-foreground text-sm">{rec.name}</p>
                <p className="text-xs text-muted-foreground flex items-center gap-2 mt-0.5">
                  <Calendar className="w-3 h-3" /> {rec.date} • {rec.doctor}
                </p>
              </div>
              <span className="text-xs text-muted-foreground hidden sm:block">{rec.size}</span>
              <div className="flex gap-1">
                <Button variant="ghost" size="icon" className="h-8 w-8"><Eye className="w-4 h-4" /></Button>
                <Button variant="ghost" size="icon" className="h-8 w-8"><Download className="w-4 h-4" /></Button>
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
};

export default HealthRecords;
