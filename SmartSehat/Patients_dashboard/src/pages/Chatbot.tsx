import React, { useState, useRef, useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { motion } from "framer-motion";
import { MessageSquare, Send, Mic, MicOff, Bot, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import chatbotImg from "@/assets/chatbot-illustration.png";

interface Message {
  id: number;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

const initialMessages: Message[] = [
  {
    id: 1,
    role: "assistant",
    content: "Hello! I'm your SmartSehat AI Health Assistant. 🏥\n\nI can help you with:\n- **Health questions** and general guidance\n- **Symptom explanations** and next steps\n- **Medication info** and side effects\n- **Wellness tips** and preventive care\n\nHow can I help you today?",
    timestamp: new Date(),
  },
];

const mockResponses: Record<string, string> = {
  headache: "**Headache Relief Tips:**\n\n1. **Stay hydrated** — Dehydration is a common trigger\n2. **Rest** in a quiet, dark room\n3. **OTC Options:** Paracetamol (500mg) or Ibuprofen (400mg)\n4. **Apply** a cold compress to your forehead\n\n⚠️ See a doctor if headaches are severe, sudden, or recurring frequently.",
  fever: "**Managing Fever:**\n\n🌡️ Normal body temperature: 98.6°F (37°C)\n\n1. **Paracetamol** 500mg every 6 hours\n2. **Stay hydrated** — water, ORS, clear broths\n3. **Light clothing** and rest\n4. **Tepid sponging** if temp > 102°F\n\n🚨 **Seek immediate care** if fever exceeds 103°F or persists beyond 3 days.",
  default: "Thank you for sharing that. Based on what you've described, I'd recommend:\n\n1. **Monitor your symptoms** for the next 24-48 hours\n2. **Stay hydrated** and get adequate rest\n3. **Avoid self-medication** without professional advice\n\nWould you like me to help you book an appointment with a specialist? I can also provide more specific guidance if you share additional details about your symptoms.",
};

const Chatbot: React.FC = () => {
  const { t } = useLanguage();
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const getResponse = (text: string): string => {
    const lower = text.toLowerCase();
    for (const key of Object.keys(mockResponses)) {
      if (key !== "default" && lower.includes(key)) return mockResponses[key];
    }
    return mockResponses.default;
  };

  const handleSend = () => {
    if (!input.trim()) return;
    const userMsg: Message = { id: Date.now(), role: "user", content: input, timestamp: new Date() };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    setTimeout(() => {
      const reply: Message = {
        id: Date.now() + 1,
        role: "assistant",
        content: getResponse(userMsg.content),
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, reply]);
      setIsTyping(false);
    }, 1500);
  };

  const handleVoice = () => {
    if (!("webkitSpeechRecognition" in window || "SpeechRecognition" in window)) return;
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onresult = (e: any) => setInput(e.results[0][0].transcript);
    recognition.start();
  };

  const formatTime = (d: Date) => d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col h-[calc(100vh-6rem)]">
      {/* Header with illustration */}
      <div className="mb-4 flex items-center gap-4">
        <img src={chatbotImg} alt="AI Assistant" className="w-14 h-14 rounded-xl object-cover" />
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <MessageSquare className="w-6 h-6 text-primary" />
            {t("chat.title")}
          </h1>
          <p className="text-muted-foreground text-sm mt-1">{t("chat.subtitle")}</p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto rounded-xl glass-card p-4 space-y-4">
        {messages.map((msg) => (
          <motion.div
            key={msg.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : ""}`}
          >
            <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
              msg.role === "assistant" ? "gradient-primary" : "bg-secondary"
            }`}>
              {msg.role === "assistant" ? (
                <Bot className="w-4 h-4 text-primary-foreground" />
              ) : (
                <User className="w-4 h-4 text-secondary-foreground" />
              )}
            </div>
            <div className={`max-w-[75%] ${msg.role === "user" ? "text-right" : ""}`}>
              <div className={`inline-block rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                msg.role === "user"
                  ? "bg-primary text-primary-foreground rounded-br-md"
                  : "bg-secondary text-secondary-foreground rounded-bl-md"
              }`}>
                <div className="whitespace-pre-wrap" dangerouslySetInnerHTML={{
                  __html: msg.content
                    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
                    .replace(/\n/g, "<br/>")
                }} />
              </div>
              <p className="text-[10px] text-muted-foreground mt-1">{formatTime(msg.timestamp)}</p>
            </div>
          </motion.div>
        ))}

        {isTyping && (
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full gradient-primary flex items-center justify-center">
              <Bot className="w-4 h-4 text-primary-foreground" />
            </div>
            <div className="bg-secondary rounded-2xl rounded-bl-md px-4 py-3 flex gap-1">
              <div className="w-2 h-2 rounded-full bg-muted-foreground animate-pulse-dot" />
              <div className="w-2 h-2 rounded-full bg-muted-foreground animate-pulse-dot" style={{ animationDelay: "0.2s" }} />
              <div className="w-2 h-2 rounded-full bg-muted-foreground animate-pulse-dot" style={{ animationDelay: "0.4s" }} />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="mt-3 flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder={t("chat.placeholder")}
          className="flex-1 px-4 py-3 rounded-xl border border-input bg-card text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
        />
        <Button variant={isListening ? "destructive" : "outline"} size="icon" onClick={handleVoice} className="shrink-0 h-[46px] w-[46px]">
          {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
        </Button>
        <Button variant="hero" size="icon" onClick={handleSend} className="shrink-0 h-[46px] w-[46px]">
          <Send className="w-4 h-4" />
        </Button>
      </div>
    </motion.div>
  );
};

export default Chatbot;
