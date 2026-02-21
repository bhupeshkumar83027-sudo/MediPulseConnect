import React, { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { motion, AnimatePresence } from "framer-motion";
import { Stethoscope, Mic, MicOff, X, AlertTriangle, Pill, ShieldCheck, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import healthHeart from "@/assets/health-heart.png";

const symptomsList = [
  "Headache", "Fever", "Cough", "Sore Throat", "Fatigue", "Nausea",
  "Body Ache", "Runny Nose", "Chest Pain", "Shortness of Breath",
  "Dizziness", "Stomach Pain", "Back Pain", "Joint Pain", "Skin Rash",
  "Insomnia", "Loss of Appetite", "Blurred Vision", "Ear Pain", "Swelling",
];

interface AnalysisResult {
  condition: string;
  probability: string;
  severity: "low" | "medium" | "high";
  medicines: string[];
  advice: string;
}

const mockAnalysis: AnalysisResult[] = [
  {
    condition: "Common Cold / Upper Respiratory Infection",
    probability: "75%",
    severity: "low",
    medicines: ["Paracetamol 500mg", "Cetirizine 10mg", "Steam Inhalation"],
    advice: "Rest well, stay hydrated, and monitor symptoms for 3-5 days. If fever persists beyond 3 days, consult a doctor.",
  },
  {
    condition: "Seasonal Flu",
    probability: "45%",
    severity: "medium",
    medicines: ["Oseltamivir 75mg", "Ibuprofen 400mg", "Vitamin C supplements"],
    advice: "Get a flu test. Avoid public spaces. Consult a physician if symptoms worsen.",
  },
];

const SymptomChecker: React.FC = () => {
  const { t } = useLanguage();
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [manualInput, setManualInput] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [results, setResults] = useState<AnalysisResult[] | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const toggleSymptom = (symptom: string) => {
    setSelectedSymptoms((prev) =>
      prev.includes(symptom) ? prev.filter((s) => s !== symptom) : [...prev, symptom]
    );
  };

  const removeSymptom = (symptom: string) => {
    setSelectedSymptoms((prev) => prev.filter((s) => s !== symptom));
  };

  const handleVoice = () => {
    if (!("webkitSpeechRecognition" in window || "SpeechRecognition" in window)) {
      alert("Speech recognition is not supported in your browser.");
      return;
    }
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = false;

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setManualInput((prev) => (prev ? prev + ", " + transcript : transcript));
    };
    recognition.start();
  };

  const handleAnalyze = () => {
    if (selectedSymptoms.length === 0 && !manualInput.trim()) return;
    setIsAnalyzing(true);
    setTimeout(() => {
      setResults(mockAnalysis);
      setIsAnalyzing(false);
    }, 2000);
  };

  const handleClear = () => {
    setSelectedSymptoms([]);
    setManualInput("");
    setResults(null);
  };

  const severityColor = {
    low: "bg-success/10 text-success border-success/20",
    medium: "bg-warning/10 text-warning border-warning/20",
    high: "bg-destructive/10 text-destructive border-destructive/20",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Header with illustration */}
      <div className="flex items-center gap-4">
        <img src={healthHeart} alt="Health" className="w-14 h-14 rounded-xl object-cover" />
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Stethoscope className="w-6 h-6 text-primary" />
            {t("symptom.title")}
          </h1>
          <p className="text-muted-foreground text-sm mt-1">{t("symptom.subtitle")}</p>
        </div>
      </div>

      {/* Symptom Input Area */}
      <div className="glass-card rounded-xl p-6 space-y-5">
        {selectedSymptoms.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {selectedSymptoms.map((s) => (
              <span
                key={s}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium"
              >
                {s}
                <button onClick={() => removeSymptom(s)}>
                  <X className="w-3.5 h-3.5" />
                </button>
              </span>
            ))}
          </div>
        )}

        <div>
          <p className="text-sm font-medium text-foreground mb-2">{t("symptom.selectSymptom")}</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
            {symptomsList.map((s) => (
              <button
                key={s}
                onClick={() => toggleSymptom(s)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all border ${
                  selectedSymptoms.includes(s)
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-secondary/50 text-foreground border-border hover:bg-secondary"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        <div className="flex gap-2">
          <input
            type="text"
            value={manualInput}
            onChange={(e) => setManualInput(e.target.value)}
            placeholder={t("symptom.enterManually")}
            className="flex-1 px-4 py-2.5 rounded-lg border border-input bg-background text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
          <Button
            variant={isListening ? "destructive" : "outline"}
            size="icon"
            onClick={handleVoice}
            title={t("symptom.voiceInput")}
          >
            {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
          </Button>
        </div>

        <div className="flex gap-3">
          <Button variant="hero" onClick={handleAnalyze} disabled={isAnalyzing}>
            {isAnalyzing ? (
              <>
                <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <Stethoscope className="w-4 h-4" />
                {t("symptom.analyze")}
              </>
            )}
          </Button>
          <Button variant="outline" onClick={handleClear}>
            <RotateCcw className="w-4 h-4" />
            {t("symptom.clear")}
          </Button>
        </div>
      </div>

      {/* Results */}
      <AnimatePresence>
        {results && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="space-y-4"
          >
            <h2 className="text-lg font-semibold text-foreground">{t("symptom.results")}</h2>

            {results.map((r, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="glass-card rounded-xl p-6 space-y-4"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-foreground">{r.condition}</h3>
                    <p className="text-sm text-muted-foreground">Probability: {r.probability}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium border ${severityColor[r.severity]}`}>
                    {r.severity.charAt(0).toUpperCase() + r.severity.slice(1)} Risk
                  </span>
                </div>

                <div>
                  <p className="text-sm font-medium text-foreground flex items-center gap-1.5 mb-2">
                    <Pill className="w-4 h-4 text-primary" /> Suggested Medicines
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {r.medicines.map((m) => (
                      <span key={m} className="px-3 py-1.5 rounded-lg bg-secondary text-secondary-foreground text-sm">
                        {m}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex items-start gap-2 p-3 rounded-lg bg-info/5 border border-info/10">
                  <ShieldCheck className="w-4 h-4 text-info mt-0.5 shrink-0" />
                  <p className="text-sm text-foreground">{r.advice}</p>
                </div>
              </motion.div>
            ))}

            <div className="flex items-start gap-2 p-4 rounded-lg bg-warning/5 border border-warning/10">
              <AlertTriangle className="w-4 h-4 text-warning mt-0.5 shrink-0" />
              <p className="text-sm text-muted-foreground">{t("symptom.disclaimer")}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default SymptomChecker;
