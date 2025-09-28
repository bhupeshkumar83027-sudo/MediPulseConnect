// Load symptoms into dropdown from CSV
async function loadSymptoms() {
  const response = await fetch("symptoms_medicines.csv");
  const data = await response.text();
  const rows = data.split("\n").slice(1); // skip header

  const dropdown = document.getElementById("symptomDropdown");
  dropdown.innerHTML = `<option value="">-- Select Symptom --</option>`; // default

  rows.forEach(row => {
    const cols = row.split(",");
    if (cols.length >= 2) {
      const symptom = cols[0].trim();
      if (symptom) {
        const option = document.createElement("option");
        option.value = symptom;
        option.textContent = symptom;
        dropdown.appendChild(option);
      }
    }
  });
}

// Helper: Find closest match symptom
function findClosestSymptom(input, symptoms) {
  input = input.toLowerCase();
  let closest = "";
  let minDistance = Infinity;

  function levenshtein(a, b) {
    const dp = Array.from({ length: a.length + 1 }, (_, i) =>
      Array(b.length + 1).fill(0)
    );
    for (let i = 0; i <= a.length; i++) dp[i][0] = i;
    for (let j = 0; j <= b.length; j++) dp[0][j] = j;

    for (let i = 1; i <= a.length; i++) {
      for (let j = 1; j <= b.length; j++) {
        if (a[i - 1] === b[j - 1]) dp[i][j] = dp[i - 1][j - 1];
        else dp[i][j] = 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
      }
    }
    return dp[a.length][b.length];
  }

  symptoms.forEach(symptom => {
    const distance = levenshtein(input, symptom.toLowerCase());
    if (distance < minDistance) {
      minDistance = distance;
      closest = symptom;
    }
  });

  return minDistance <= 3 ? closest : null;
}

// Suggest medicine
async function getSuggestion() {
  const input = document.getElementById("symptomInputMed").value.trim().toLowerCase();
  const dropdown = document.getElementById("symptomDropdown").value.trim().toLowerCase();
  let selectedSymptom = input || dropdown;

  if (!selectedSymptom) {
    showResult("⚠️ Please enter or select a symptom.");
    return;
  }

  const response = await fetch("symptoms_medicines.csv");
  const data = await response.text();
  const rows = data.split("\n").slice(1);

  let found = null;
  let symptomsList = [];

  rows.forEach(row => {
    const cols = row.split(",");
    if (cols.length >= 2) {
      const symptom = cols[0].trim();
      const medicine = cols[1].trim();
      symptomsList.push(symptom);

      if (symptom.toLowerCase() === selectedSymptom) {
        found = `💊 Suggested Medicine for <b>${symptom}</b>: <b>${medicine}</b>`;
      }
    }
  });

  if (!found) {
    const closest = findClosestSymptom(selectedSymptom, symptomsList);
    if (closest) {
      const correctedRow = rows.find(r => r.toLowerCase().startsWith(closest.toLowerCase()));
      if (correctedRow) {
        const cols = correctedRow.split(",");
        found = `🤔 Did you mean <b>${cols[0]}</b>?<br> 💊 Suggested Medicine: <b>${cols[1]}</b>`;
      }
    }
  }

  if (!found) found = "⚠️ No suggestion found. Please check spelling.";
  showResult(found);
}

function showResult(message) {
  const resultBox = document.getElementById("resultBox");
  resultBox.innerHTML = message;
  resultBox.style.opacity = 0;
  resultBox.style.display = "block";
  setTimeout(() => {
    resultBox.style.transition = "opacity 0.5s ease-in-out";
    resultBox.style.opacity = 1;
  }, 50);
}

function clearResult() {
  document.getElementById("symptomInputMed").value = "";
  document.getElementById("symptomDropdown").value = "";
  const resultBox = document.getElementById("resultBox");
  resultBox.style.opacity = 0;
  setTimeout(() => {
    resultBox.innerHTML = "";
    resultBox.style.display = "none";
  }, 300);
}

// Load symptoms on page load
window.onload = loadSymptoms;

// 🎙️ SpeechRecognition
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

// Symptom voice input → medicine suggestion
function startRecognitionMedicine() {
  if (!SpeechRecognition) return alert("Your browser doesn't support Speech Recognition.");
  const recognition = new SpeechRecognition();
  recognition.lang = 'en-US';
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;

  recognition.start();
  recognition.onresult = function(event) {
    const transcript = event.results[0][0].transcript.trim();
    document.getElementById("symptomInputMed").value = transcript;
    getSuggestion();
  };
}
// Initialize Chatbase API
window.chatbase = window.chatbase || function() {
  if (!window.chatbase.q) window.chatbase.q = [];
  window.chatbase.q.push(arguments);
};
window.chatbase = new Proxy(window.chatbase, {
  get(target, prop) {
    if (prop === "q") return target.q;
    return (...args) => target(prop, ...args);
  }
});

function startRecognitionChatbot() {
  if (!SpeechRecognition) return alert("Your browser doesn't support Speech Recognition.");
  const recognition = new SpeechRecognition();
  recognition.lang = 'en-US';
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;

  recognition.start();
  document.getElementById("chatbotOutput").textContent = "🎤 Listening...";

  recognition.onresult = function(event) {
    const transcript = event.results[0][0].transcript.trim();
    document.getElementById("chatbotOutput").textContent = "You said: " + transcript;

    // Send directly via Chatbase API
    if (window.chatbase) {
      window.chatbase("message", transcript, { userId: "patient" });
    } else {
      console.warn("Chatbase not initialized");
    }

    // iframe attempt (optional, but may fail cross-domain)
    const iframe = document.querySelector("iframe[src*='chatbase']");
    if (iframe) {
      try {
        const innerDoc = iframe.contentDocument || iframe.contentWindow.document;
        const inputBox = innerDoc.querySelector("input[type='text'], textarea");
        const sendBtn = innerDoc.querySelector("button, svg");
        if (inputBox) {
          inputBox.value = transcript;
          inputBox.dispatchEvent(new Event("input", { bubbles: true }));
          if (sendBtn) sendBtn.click();
        }
      } catch(e) {
        console.warn("Cannot access iframe (cross-origin)", e);
      }
    }
  };
}
