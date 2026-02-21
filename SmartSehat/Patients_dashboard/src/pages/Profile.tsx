import React, { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { motion } from "framer-motion";
import { User, Mail, Phone, MapPin, Calendar, Heart, Droplets, Activity, Shield, Bell, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import wellnessImg from "@/assets/wellness-illustration.png";

const Profile: React.FC = () => {
  const { t } = useLanguage();
  const [tab, setTab] = useState<"personal" | "medical" | "settings">("personal");

  const tabs = [
    { key: "personal" as const, label: t("profile.personal"), icon: User },
    { key: "medical" as const, label: t("profile.medical"), icon: Heart },
    { key: "settings" as const, label: t("profile.settings"), icon: Shield },
  ];

  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
        <User className="w-6 h-6 text-primary" />
        {t("profile.title")}
      </h1>

      {/* Profile Card */}
      <div className="glass-card rounded-xl p-6">
        <div className="flex flex-col sm:flex-row items-center gap-5">
          <img src={wellnessImg} alt="Profile" className="w-20 h-20 rounded-full object-cover border-2 border-primary/20" />
          <div className="text-center sm:text-left flex-1">
            <h2 className="text-xl font-bold text-foreground">Aarav Kumar</h2>
            <p className="text-muted-foreground text-sm">Patient ID: SM-2026-00142</p>
            <div className="flex flex-wrap justify-center sm:justify-start gap-3 mt-2 text-xs text-muted-foreground">
              <span className="flex items-center gap-1"><Mail className="w-3 h-3" /> aarav@email.com</span>
              <span className="flex items-center gap-1"><Phone className="w-3 h-3" /> +91 98765 43210</span>
              <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> New Delhi, India</span>
            </div>
          </div>
          <Button variant="outline" size="sm">Edit Profile</Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2">
        {tabs.map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              tab === key ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-secondary"
            }`}
          >
            <Icon className="w-3.5 h-3.5" /> {label}
          </button>
        ))}
      </div>

      {/* Content */}
      {tab === "personal" && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-card rounded-xl p-6 space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { label: "Full Name", value: "Aarav Kumar", icon: User },
              { label: "Date of Birth", value: "March 15, 1992", icon: Calendar },
              { label: "Gender", value: "Male", icon: User },
              { label: "Phone", value: "+91 98765 43210", icon: Phone },
              { label: "Email", value: "aarav@email.com", icon: Mail },
              { label: "Address", value: "42, Hauz Khas, New Delhi 110016", icon: MapPin },
            ].map(({ label, value, icon: Icon }) => (
              <div key={label} className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground flex items-center gap-1"><Icon className="w-3 h-3" /> {label}</label>
                <input
                  type="text"
                  defaultValue={value}
                  className="w-full px-3 py-2 rounded-lg border border-input bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
            ))}
          </div>
          <div className="flex justify-end">
            <Button variant="hero"><Save className="w-4 h-4" /> Save Changes</Button>
          </div>
        </motion.div>
      )}

      {tab === "medical" && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { label: "Blood Type", value: "O+", icon: Droplets, color: "bg-destructive/10 text-destructive" },
              { label: "Height", value: "175 cm", icon: Activity, color: "bg-info/10 text-info" },
              { label: "Weight", value: "72 kg", icon: Activity, color: "bg-success/10 text-success" },
            ].map(({ label, value, icon: Icon, color }) => (
              <div key={label} className="glass-card rounded-xl p-4 flex items-center gap-3">
                <div className={`p-2.5 rounded-xl ${color}`}><Icon className="w-5 h-5" /></div>
                <div>
                  <p className="text-xs text-muted-foreground">{label}</p>
                  <p className="font-bold text-foreground">{value}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="glass-card rounded-xl p-6 space-y-4">
            <h3 className="font-semibold text-foreground">Medical Conditions</h3>
            <div className="flex flex-wrap gap-2">
              {["Mild Hypertension", "Seasonal Allergies"].map((c) => (
                <span key={c} className="px-3 py-1.5 rounded-full bg-warning/10 text-warning text-sm font-medium">{c}</span>
              ))}
            </div>
          </div>

          <div className="glass-card rounded-xl p-6 space-y-4">
            <h3 className="font-semibold text-foreground">Current Medications</h3>
            <div className="space-y-2">
              {[
                { name: "Amlodipine 5mg", freq: "Once daily", doctor: "Dr. Priya Sharma" },
                { name: "Cetirizine 10mg", freq: "As needed", doctor: "Dr. Rajesh Kumar" },
              ].map((m) => (
                <div key={m.name} className="flex items-center justify-between p-3 rounded-lg bg-secondary/50">
                  <div>
                    <p className="font-medium text-foreground text-sm">{m.name}</p>
                    <p className="text-xs text-muted-foreground">{m.freq} • Prescribed by {m.doctor}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="glass-card rounded-xl p-6 space-y-4">
            <h3 className="font-semibold text-foreground">Allergies</h3>
            <div className="flex flex-wrap gap-2">
              {["Penicillin", "Pollen", "Dust Mites"].map((a) => (
                <span key={a} className="px-3 py-1.5 rounded-full bg-destructive/10 text-destructive text-sm font-medium">{a}</span>
              ))}
            </div>
          </div>

          <div className="glass-card rounded-xl p-6 space-y-4">
            <h3 className="font-semibold text-foreground">Emergency Contact</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
              <div><span className="text-muted-foreground">Name: </span><span className="text-foreground font-medium">Riya Kumar</span></div>
              <div><span className="text-muted-foreground">Relation: </span><span className="text-foreground font-medium">Spouse</span></div>
              <div><span className="text-muted-foreground">Phone: </span><span className="text-foreground font-medium">+91 98765 43211</span></div>
            </div>
          </div>
        </motion.div>
      )}

      {tab === "settings" && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-card rounded-xl p-6 space-y-5">
          {[
            { label: "Email Notifications", desc: "Receive appointment reminders via email", icon: Mail },
            { label: "SMS Notifications", desc: "Get SMS alerts for appointments", icon: Phone },
            { label: "Push Notifications", desc: "Browser push notifications", icon: Bell },
            { label: "Two-Factor Authentication", desc: "Extra security for your account", icon: Shield },
          ].map(({ label, desc, icon: Icon }) => (
            <div key={label} className="flex items-center justify-between py-2">
              <div className="flex items-center gap-3">
                <Icon className="w-4 h-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium text-foreground">{label}</p>
                  <p className="text-xs text-muted-foreground">{desc}</p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" defaultChecked className="sr-only peer" />
                <div className="w-9 h-5 bg-muted rounded-full peer-checked:bg-primary transition-colors peer-focus:ring-2 peer-focus:ring-ring after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-card after:rounded-full after:h-4 after:w-4 after:transition-transform peer-checked:after:translate-x-4" />
              </label>
            </div>
          ))}
        </motion.div>
      )}
    </motion.div>
  );
};

export default Profile;
