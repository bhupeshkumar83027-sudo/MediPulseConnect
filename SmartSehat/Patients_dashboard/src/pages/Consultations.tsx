import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { motion } from "framer-motion";
import { Video, Phone, MessageSquare, Star, MapPin, Clock, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import consultImg from "@/assets/consultation-illustration.png";
import doctorImg from "@/assets/doctor-illustration.png";

interface DoctorProfile {
  id: number;
  name: string;
  specialty: string;
  rating: number;
  reviews: number;
  experience: string;
  location: string;
  avatar: string;
  available: boolean;
  fee: string;
  languages: string[];
}

const consultDoctors: DoctorProfile[] = [
  { id: 1, name: "Dr. Priya Sharma", specialty: "Cardiologist", rating: 4.9, reviews: 234, experience: "15 yrs", location: "Apollo Hospital, Delhi", avatar: "PS", available: true, fee: "₹800", languages: ["English", "Hindi"] },
  { id: 2, name: "Dr. Rajesh Kumar", specialty: "Dermatologist", rating: 4.7, reviews: 189, experience: "12 yrs", location: "Max Healthcare, Mumbai", avatar: "RK", available: true, fee: "₹600", languages: ["English", "Hindi", "Marathi"] },
  { id: 3, name: "Dr. Anita Patel", specialty: "General Medicine", rating: 4.8, reviews: 312, experience: "20 yrs", location: "Fortis Hospital, Bangalore", avatar: "AP", available: false, fee: "₹500", languages: ["English", "Hindi", "Kannada"] },
  { id: 4, name: "Dr. Vikram Singh", specialty: "Orthopedic", rating: 4.6, reviews: 156, experience: "18 yrs", location: "AIIMS, Delhi", avatar: "VS", available: true, fee: "₹1000", languages: ["English", "Hindi", "Punjabi"] },
  { id: 5, name: "Dr. Meera Joshi", specialty: "Pediatrician", rating: 4.9, reviews: 278, experience: "10 yrs", location: "Rainbow Hospital, Hyderabad", avatar: "MJ", available: true, fee: "₹700", languages: ["English", "Hindi", "Telugu"] },
  { id: 6, name: "Dr. Suresh Reddy", specialty: "ENT Specialist", rating: 4.5, reviews: 145, experience: "14 yrs", location: "Care Hospital, Chennai", avatar: "SR", available: false, fee: "₹650", languages: ["English", "Tamil"] },
];

const Consultations: React.FC = () => {
  const { t } = useLanguage();

  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="flex items-center gap-4">
        <img src={consultImg} alt="Consultations" className="w-14 h-14 rounded-xl object-cover" />
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Video className="w-6 h-6 text-primary" />
            {t("consult.title")}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">Connect with top doctors via voice, video, or chat</p>
        </div>
      </div>

      {/* Info Banner */}
      <div className="gradient-primary rounded-xl p-5 text-primary-foreground">
        <div className="flex items-start gap-3">
          <Shield className="w-5 h-5 mt-0.5 shrink-0" />
          <div>
            <p className="font-semibold">Secure & Private Consultations</p>
            <p className="text-sm opacity-90 mt-1">All consultations are end-to-end encrypted. Your medical data remains confidential.</p>
          </div>
        </div>
      </div>

      {/* Doctors Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {consultDoctors.map((doc, i) => (
          <motion.div
            key={doc.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
            className="glass-card rounded-xl p-5 space-y-4"
          >
            <div className="flex items-center gap-3">
              <div className="relative">
                <img src={doctorImg} alt={doc.name} className="w-14 h-14 rounded-full object-cover border-2 border-primary/20" />
                {doc.available && (
                  <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full bg-success border-2 border-card" />
                )}
              </div>
              <div className="flex-1">
                <p className="font-semibold text-foreground">{doc.name}</p>
                <p className="text-sm text-muted-foreground">{doc.specialty} • {doc.experience}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="flex items-center gap-0.5 text-xs">
                    <Star className="w-3 h-3 text-warning fill-warning" /> {doc.rating}
                  </span>
                  <span className="text-xs text-muted-foreground">({doc.reviews} reviews)</span>
                </div>
              </div>
              <span className="text-lg font-bold text-primary">{doc.fee}</span>
            </div>

            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {doc.location}</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {doc.languages.map((l) => (
                <span key={l} className="px-2 py-0.5 rounded-md bg-secondary text-secondary-foreground text-xs">{l}</span>
              ))}
            </div>

            <div className="flex gap-2 pt-1">
              <Button variant="hero" size="sm" disabled={!doc.available} className="flex-1">
                <Video className="w-3.5 h-3.5" /> {t("consult.videoCall")}
              </Button>
              <Button variant="outline" size="sm" disabled={!doc.available} className="flex-1">
                <Phone className="w-3.5 h-3.5" /> {t("consult.voiceCall")}
              </Button>
              <Button variant="ghost" size="sm" disabled={!doc.available}>
                <MessageSquare className="w-3.5 h-3.5" />
              </Button>
            </div>

            {!doc.available && (
              <p className="text-xs text-center text-muted-foreground flex items-center justify-center gap-1">
                <Clock className="w-3 h-3" /> Currently unavailable — next available tomorrow
              </p>
            )}
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default Consultations;
