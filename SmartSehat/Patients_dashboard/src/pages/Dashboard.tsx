import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { motion } from "framer-motion";
import {
  Activity,
  CalendarDays,
  FileText,
  Stethoscope,
  MessageSquare,
  Video,
  TrendingUp,
  Droplets,
  Heart,
  Moon,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import healthHeart from "@/assets/health-heart.png";
import wellnessImg from "@/assets/wellness-illustration.png";
import doctorImg from "@/assets/doctor-illustration.png";
import consultImg from "@/assets/consultation-illustration.png";
import chatbotImg from "@/assets/chatbot-illustration.png";
import appointmentImg from "@/assets/appointment-illustration.png";

const fadeUp = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
};

const StatCard: React.FC<{
  icon: React.ElementType;
  label: string;
  value: string;
  trend?: string;
  color: string;
  image?: string;
}> = ({ icon: Icon, label, value, trend, color, image }) => (
  <motion.div
    variants={fadeUp}
    className="glass-card rounded-xl p-5 hover:shadow-md transition-shadow"
  >
    <div className="flex items-start justify-between">
      <div>
        <p className="text-sm text-muted-foreground font-medium">{label}</p>
        <p className="text-2xl font-bold mt-1 text-foreground">{value}</p>
        {trend && (
          <p className="text-xs text-success flex items-center gap-1 mt-1">
            <TrendingUp className="w-3 h-3" /> {trend}
          </p>
        )}
      </div>
      {image ? (
        <img src={image} alt={label} className="w-12 h-12 rounded-xl object-cover" />
      ) : (
        <div className={`p-2.5 rounded-xl ${color}`}>
          <Icon className="w-5 h-5" />
        </div>
      )}
    </div>
  </motion.div>
);

const QuickAction: React.FC<{
  icon: React.ElementType;
  label: string;
  path: string;
  color: string;
  image?: string;
}> = ({ icon: Icon, label, path, color, image }) => {
  const navigate = useNavigate();
  return (
    <button
      onClick={() => navigate(path)}
      className="flex flex-col items-center gap-2 p-4 rounded-xl glass-card hover:shadow-md transition-all group"
    >
      {image ? (
        <img src={image} alt={label} className="w-12 h-12 rounded-xl object-cover transition-transform group-hover:scale-110" />
      ) : (
        <div className={`p-3 rounded-xl ${color} transition-transform group-hover:scale-110`}>
          <Icon className="w-5 h-5" />
        </div>
      )}
      <span className="text-xs font-medium text-foreground">{label}</span>
    </button>
  );
};

const Dashboard: React.FC = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();

  const appointments = [
    { id: 1, doctor: "Dr. Priya Sharma", specialty: "Cardiologist", date: "Today, 3:00 PM", avatar: "PS" },
    { id: 2, doctor: "Dr. Rajesh Kumar", specialty: "Dermatologist", date: "Tomorrow, 11:00 AM", avatar: "RK" },
    { id: 3, doctor: "Dr. Anita Patel", specialty: "General Medicine", date: "Feb 23, 10:30 AM", avatar: "AP" },
  ];

  return (
    <motion.div
      initial="initial"
      animate="animate"
      transition={{ staggerChildren: 0.06 }}
      className="space-y-8"
    >
      {/* Header */}
      <motion.div variants={fadeUp} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            {t("dashboard.welcome")}, <span className="text-gradient">Aarav</span> 👋
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Here's your health overview for today
          </p>
        </div>
        <Button variant="hero" onClick={() => navigate("/symptom-checker")}>
          <Stethoscope className="w-4 h-4" />
          Check Symptoms
        </Button>
      </motion.div>

      {/* Stats */}
      <motion.div
        variants={fadeUp}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
      >
        <StatCard icon={Heart} label={t("dashboard.healthScore")} value="87/100" trend="+3% this week" color="bg-primary/10 text-primary" image={healthHeart} />
        <StatCard icon={Droplets} label="Blood Pressure" value="120/80" color="bg-info/10 text-info" />
        <StatCard icon={Activity} label="Heart Rate" value="72 bpm" trend="Normal" color="bg-success/10 text-success" />
        <StatCard icon={Moon} label="Sleep Score" value="7.5 hrs" color="bg-accent/10 text-accent" />
      </motion.div>

      {/* Quick Actions */}
      <motion.div variants={fadeUp}>
        <h2 className="text-lg font-semibold text-foreground mb-4">{t("dashboard.quickActions")}</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3">
          <QuickAction icon={Stethoscope} label="Symptom Check" path="/symptom-checker" color="bg-primary/10 text-primary" />
          <QuickAction icon={MessageSquare} label="AI Assistant" path="/chatbot" color="bg-info/10 text-info" image={chatbotImg} />
          <QuickAction icon={CalendarDays} label="Book Appointment" path="/appointments" color="bg-success/10 text-success" image={appointmentImg} />
          <QuickAction icon={Video} label="Consult Doctor" path="/consultations" color="bg-warning/10 text-warning" image={consultImg} />
          <QuickAction icon={FileText} label="Health Records" path="/health-records" color="bg-accent/10 text-accent" />
          <QuickAction icon={Activity} label="Vitals Tracker" path="/profile" color="bg-destructive/10 text-destructive" />
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Upcoming Appointments */}
        <motion.div variants={fadeUp} className="lg:col-span-2 glass-card rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-foreground">{t("dashboard.upcomingAppointments")}</h2>
            <Button variant="ghost" size="sm" onClick={() => navigate("/appointments")}>
              View All <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
          <div className="space-y-3">
            {appointments.map((apt) => (
              <div
                key={apt.id}
                className="flex items-center gap-4 p-3 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors"
              >
                <img src={doctorImg} alt={apt.doctor} className="w-10 h-10 rounded-full object-cover border-2 border-primary/20" />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-foreground text-sm">{apt.doctor}</p>
                  <p className="text-xs text-muted-foreground">{apt.specialty}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-foreground">{apt.date}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Health Tip */}
        <motion.div variants={fadeUp} className="glass-card rounded-xl p-6">
          <h2 className="text-lg font-semibold text-foreground mb-3">{t("dashboard.todaysTip")}</h2>
          <div className="rounded-lg gradient-primary p-5 text-primary-foreground relative overflow-hidden">
            <img src={wellnessImg} alt="Wellness" className="absolute right-0 bottom-0 w-20 h-20 object-cover opacity-30 rounded-lg" />
            <p className="text-sm font-medium leading-relaxed relative z-10">
              💧 Stay hydrated! Drinking 8 glasses of water daily helps maintain energy levels,
              supports digestion, and keeps your skin healthy.
            </p>
            <p className="text-xs mt-3 opacity-80 relative z-10">— SmartSehat Health AI</p>
          </div>
          <div className="mt-4 space-y-3">
            <div className="flex items-center gap-3 text-sm">
              <div className="w-2 h-2 rounded-full bg-success" />
              <span className="text-muted-foreground">2 reports uploaded this week</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <div className="w-2 h-2 rounded-full bg-warning" />
              <span className="text-muted-foreground">1 prescription expiring soon</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <div className="w-2 h-2 rounded-full bg-info" />
              <span className="text-muted-foreground">Next checkup in 5 days</span>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Dashboard;
