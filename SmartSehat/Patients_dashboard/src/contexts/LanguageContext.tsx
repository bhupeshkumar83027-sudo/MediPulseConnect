import React, { createContext, useContext, useState } from "react";

type Language = "en" | "hi";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations: Record<Language, Record<string, string>> = {
  en: {
    "nav.dashboard": "Dashboard",
    "nav.symptomChecker": "Symptom Checker",
    "nav.chatbot": "AI Assistant",
    "nav.appointments": "Appointments",
    "nav.healthRecords": "Health Records",
    "nav.consultations": "Consultations",
    "nav.profile": "My Profile",
    "nav.logout": "Log Out",
    "dashboard.welcome": "Welcome back",
    "dashboard.healthScore": "Health Score",
    "dashboard.upcomingAppointments": "Upcoming Appointments",
    "dashboard.recentRecords": "Recent Records",
    "dashboard.quickActions": "Quick Actions",
    "dashboard.todaysTip": "Today's Health Tip",
    "symptom.title": "AI Symptom Checker",
    "symptom.subtitle": "Describe your symptoms and get AI-powered preliminary guidance",
    "symptom.selectSymptom": "Select a symptom",
    "symptom.enterManually": "Or type your symptoms...",
    "symptom.voiceInput": "Voice Input",
    "symptom.analyze": "Analyze Symptoms",
    "symptom.clear": "Clear All",
    "symptom.results": "Analysis Results",
    "symptom.disclaimer": "This is not a medical diagnosis. Please consult a doctor.",
    "chat.title": "AI Health Assistant",
    "chat.subtitle": "Ask any health-related questions",
    "chat.placeholder": "Type your health question...",
    "chat.send": "Send",
    "appointments.title": "Appointments",
    "appointments.book": "Book Appointment",
    "appointments.upcoming": "Upcoming",
    "appointments.past": "Past",
    "appointments.cancelled": "Cancelled",
    "records.title": "Health Records",
    "records.upload": "Upload Record",
    "records.prescriptions": "Prescriptions",
    "records.reports": "Lab Reports",
    "records.history": "Medical History",
    "consult.title": "Doctor Consultations",
    "consult.voiceCall": "Voice Call",
    "consult.videoCall": "Video Call",
    "consult.chat": "Chat",
    "profile.title": "My Profile",
    "profile.personal": "Personal Information",
    "profile.medical": "Medical Information",
    "profile.settings": "Settings",
  },
  hi: {
    "nav.dashboard": "डैशबोर्ड",
    "nav.symptomChecker": "लक्षण जांच",
    "nav.chatbot": "AI सहायक",
    "nav.appointments": "अपॉइंटमेंट",
    "nav.healthRecords": "स्वास्थ्य रिकॉर्ड",
    "nav.consultations": "परामर्श",
    "nav.profile": "मेरी प्रोफ़ाइल",
    "nav.logout": "लॉग आउट",
    "dashboard.welcome": "वापसी पर स्वागत",
    "dashboard.healthScore": "स्वास्थ्य स्कोर",
    "dashboard.upcomingAppointments": "आगामी अपॉइंटमेंट",
    "dashboard.recentRecords": "हाल के रिकॉर्ड",
    "dashboard.quickActions": "त्वरित कार्य",
    "dashboard.todaysTip": "आज का स्वास्थ्य सुझाव",
    "symptom.title": "AI लक्षण जांचकर्ता",
    "symptom.subtitle": "अपने लक्षणों का वर्णन करें और AI-संचालित मार्गदर्शन प्राप्त करें",
    "symptom.selectSymptom": "एक लक्षण चुनें",
    "symptom.enterManually": "या अपने लक्षण टाइप करें...",
    "symptom.voiceInput": "वॉइस इनपुट",
    "symptom.analyze": "लक्षणों का विश्लेषण करें",
    "symptom.clear": "सब साफ़ करें",
    "symptom.results": "विश्लेषण परिणाम",
    "symptom.disclaimer": "यह चिकित्सा निदान नहीं है। कृपया डॉक्टर से परामर्श करें।",
    "chat.title": "AI स्वास्थ्य सहायक",
    "chat.subtitle": "स्वास्थ्य संबंधी कोई भी प्रश्न पूछें",
    "chat.placeholder": "अपना स्वास्थ्य प्रश्न टाइप करें...",
    "chat.send": "भेजें",
    "appointments.title": "अपॉइंटमेंट",
    "appointments.book": "अपॉइंटमेंट बुक करें",
    "appointments.upcoming": "आगामी",
    "appointments.past": "पिछले",
    "appointments.cancelled": "रद्द",
    "records.title": "स्वास्थ्य रिकॉर्ड",
    "records.upload": "रिकॉर्ड अपलोड करें",
    "records.prescriptions": "प्रिस्क्रिप्शन",
    "records.reports": "लैब रिपोर्ट",
    "records.history": "चिकित्सा इतिहास",
    "consult.title": "डॉक्टर परामर्श",
    "consult.voiceCall": "वॉइस कॉल",
    "consult.videoCall": "वीडियो कॉल",
    "consult.chat": "चैट",
    "profile.title": "मेरी प्रोफ़ाइल",
    "profile.personal": "व्यक्तिगत जानकारी",
    "profile.medical": "चिकित्सा जानकारी",
    "profile.settings": "सेटिंग्स",
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>("en");

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) throw new Error("useLanguage must be used within LanguageProvider");
  return context;
};
