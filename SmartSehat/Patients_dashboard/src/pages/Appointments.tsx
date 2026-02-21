import React, { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { motion } from "framer-motion";
import { CalendarDays, Clock, MapPin, Star, Search, Filter, Plus, X, Check, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Doctor {
  id: number;
  name: string;
  specialty: string;
  rating: number;
  experience: string;
  location: string;
  avatar: string;
  available: string[];
  fee: string;
}

interface Appointment {
  id: number;
  doctor: string;
  specialty: string;
  date: string;
  time: string;
  status: "upcoming" | "completed" | "cancelled";
  avatar: string;
}

const doctors: Doctor[] = [
  { id: 1, name: "Dr. Priya Sharma", specialty: "Cardiologist", rating: 4.9, experience: "15 yrs", location: "Apollo Hospital, Delhi", avatar: "PS", available: ["10:00 AM", "2:00 PM", "4:30 PM"], fee: "₹800" },
  { id: 2, name: "Dr. Rajesh Kumar", specialty: "Dermatologist", rating: 4.7, experience: "12 yrs", location: "Max Healthcare, Mumbai", avatar: "RK", available: ["9:00 AM", "11:30 AM", "3:00 PM"], fee: "₹600" },
  { id: 3, name: "Dr. Anita Patel", specialty: "General Medicine", rating: 4.8, experience: "20 yrs", location: "Fortis Hospital, Bangalore", avatar: "AP", available: ["8:30 AM", "1:00 PM", "5:00 PM"], fee: "₹500" },
  { id: 4, name: "Dr. Vikram Singh", specialty: "Orthopedic", rating: 4.6, experience: "18 yrs", location: "AIIMS, Delhi", avatar: "VS", available: ["10:30 AM", "3:30 PM"], fee: "₹1000" },
  { id: 5, name: "Dr. Meera Joshi", specialty: "Pediatrician", rating: 4.9, experience: "10 yrs", location: "Rainbow Hospital, Hyderabad", avatar: "MJ", available: ["9:30 AM", "12:00 PM", "4:00 PM"], fee: "₹700" },
];

const myAppointments: Appointment[] = [
  { id: 1, doctor: "Dr. Priya Sharma", specialty: "Cardiologist", date: "Today", time: "3:00 PM", status: "upcoming", avatar: "PS" },
  { id: 2, doctor: "Dr. Rajesh Kumar", specialty: "Dermatologist", date: "Tomorrow", time: "11:00 AM", status: "upcoming", avatar: "RK" },
  { id: 3, doctor: "Dr. Anita Patel", specialty: "General Medicine", date: "Feb 15", time: "10:30 AM", status: "completed", avatar: "AP" },
  { id: 4, doctor: "Dr. Vikram Singh", specialty: "Orthopedic", date: "Feb 10", time: "2:00 PM", status: "cancelled", avatar: "VS" },
];

const Appointments: React.FC = () => {
  const { t } = useLanguage();
  const [tab, setTab] = useState<"upcoming" | "completed" | "cancelled">("upcoming");
  const [showBooking, setShowBooking] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);

  const statusIcon = { upcoming: Clock, completed: Check, cancelled: XCircle };
  const statusStyle = {
    upcoming: "bg-info/10 text-info",
    completed: "bg-success/10 text-success",
    cancelled: "bg-destructive/10 text-destructive",
  };

  const filteredDoctors = doctors.filter(
    (d) => d.name.toLowerCase().includes(search.toLowerCase()) || d.specialty.toLowerCase().includes(search.toLowerCase())
  );

  const filteredAppointments = myAppointments.filter((a) => a.status === tab);

  const handleBook = () => {
    if (selectedDoctor && selectedSlot) {
      alert(`Appointment booked with ${selectedDoctor.name} at ${selectedSlot}!`);
      setShowBooking(false);
      setSelectedDoctor(null);
      setSelectedSlot(null);
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <CalendarDays className="w-6 h-6 text-primary" />
            {t("appointments.title")}
          </h1>
        </div>
        <Button variant="hero" onClick={() => setShowBooking(!showBooking)}>
          {showBooking ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
          {showBooking ? "Close" : t("appointments.book")}
        </Button>
      </div>

      {/* Booking Section */}
      {showBooking && (
        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="glass-card rounded-xl p-6 space-y-4">
          <div className="flex items-center gap-2">
            <Search className="w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search doctors by name or specialty..."
              className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {filteredDoctors.map((doc) => (
              <button
                key={doc.id}
                onClick={() => { setSelectedDoctor(doc); setSelectedSlot(null); }}
                className={`p-4 rounded-xl border text-left transition-all ${
                  selectedDoctor?.id === doc.id ? "border-primary bg-primary/5" : "border-border hover:border-primary/30"
                }`}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full gradient-primary flex items-center justify-center text-sm font-bold text-primary-foreground">
                    {doc.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-foreground text-sm">{doc.name}</p>
                    <p className="text-xs text-muted-foreground">{doc.specialty} • {doc.experience}</p>
                  </div>
                  <span className="text-sm font-semibold text-primary">{doc.fee}</span>
                </div>
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1"><Star className="w-3 h-3 text-warning fill-warning" /> {doc.rating}</span>
                  <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {doc.location}</span>
                </div>
              </button>
            ))}
          </div>

          {selectedDoctor && (
            <div className="space-y-3">
              <p className="text-sm font-medium text-foreground">Available Slots for {selectedDoctor.name}:</p>
              <div className="flex flex-wrap gap-2">
                {selectedDoctor.available.map((slot) => (
                  <button
                    key={slot}
                    onClick={() => setSelectedSlot(slot)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium border transition-all ${
                      selectedSlot === slot ? "bg-primary text-primary-foreground border-primary" : "border-border hover:border-primary/30"
                    }`}
                  >
                    {slot}
                  </button>
                ))}
              </div>
              <Button variant="hero" onClick={handleBook} disabled={!selectedSlot} className="mt-2">
                Confirm Booking
              </Button>
            </div>
          )}
        </motion.div>
      )}

      {/* Tabs */}
      <div className="flex gap-2 border-b border-border pb-2">
        {(["upcoming", "completed", "cancelled"] as const).map((s) => {
          const Icon = statusIcon[s];
          return (
            <button
              key={s}
              onClick={() => setTab(s)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                tab === s ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-secondary"
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              {s.charAt(0).toUpperCase() + s.slice(1)}
            </button>
          );
        })}
      </div>

      {/* Appointments List */}
      <div className="space-y-3">
        {filteredAppointments.length === 0 ? (
          <p className="text-center text-muted-foreground py-12">No {tab} appointments</p>
        ) : (
          filteredAppointments.map((apt) => (
            <motion.div
              key={apt.id}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              className="glass-card rounded-xl p-4 flex items-center gap-4"
            >
              <div className="w-12 h-12 rounded-full gradient-primary flex items-center justify-center text-sm font-bold text-primary-foreground">
                {apt.avatar}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-foreground">{apt.doctor}</p>
                <p className="text-sm text-muted-foreground">{apt.specialty}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-foreground">{apt.date}</p>
                <p className="text-xs text-muted-foreground">{apt.time}</p>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusStyle[apt.status]}`}>
                {apt.status}
              </span>
            </motion.div>
          ))
        )}
      </div>
    </motion.div>
  );
};

export default Appointments;
