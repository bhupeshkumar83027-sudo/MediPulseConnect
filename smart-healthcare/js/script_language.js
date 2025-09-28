const translations = {
    en: { role: { chooseLanguage: "Choose Language:", continueAs: "Continue as:", patient: "🧑‍⚕️ Patient", doctor: "👨‍⚕️ Doctor" }},
    hi: { role: { chooseLanguage: "भाषा चुनें:", continueAs: "के रूप में जारी रखें:", patient: "🧑‍⚕️ मरीज़", doctor: "👨‍⚕️ डॉक्टर" }},
    pa: { role: { chooseLanguage: "ਭਾਸ਼ਾ ਚੁਣੋ:", continueAs: "ਦੇ ਤੌਰ 'ਤੇ ਜਾਰੀ ਰੱਖੋ:", patient: "🧑‍⚕️ ਮਰੀਜ਼", doctor: "👨‍⚕️ ਡਾਕਟਰ" }},
    ur: { role: { chooseLanguage: "زبان منتخب کریں:", continueAs: "کے طور پر جاری رکھیں:", patient: "🧑‍⚕️ مریض", doctor: "👨‍⚕️ ڈاکٹر" }},
    bn: { role: { chooseLanguage: "ভাষা নির্বাচন করুন:", continueAs: "হিসেবে চালিয়ে যান:", patient: "🧑‍⚕️ রোগী", doctor: "👨‍⚕️ ডাক্তার" }},
    gu: { role: { chooseLanguage: "ભાષા પસંદ કરો:", continueAs: "રૂપે ચાલુ રાખો:", patient: "🧑‍⚕️ દર્દી", doctor: "👨‍⚕️ ડોક્ટર" }},
    mr: { role: { chooseLanguage: "भाषा निवडा:", continueAs: "रुपात सुरू ठेवा:", patient: "🧑‍⚕️ रुग्ण", doctor: "👨‍⚕️ डॉक्टर" }},
    kn: { role: { chooseLanguage: "ಭಾಷೆ ಆಯ್ಕೆಮಾಡಿ:", continueAs: "ಆಗಿಯೇ ಮುಂದುವರಿಸಿ:", patient: "🧑‍⚕️ ರೋಗಿ", doctor: "👨‍⚕️ ವೈದ್ಯ" }},
    ta: { role: { chooseLanguage: "மொழியைத் தேர்ந்தெடுக்கவும்:", continueAs: "ஆக தொடரவும்:", patient: "🧑‍⚕️ நோயாளர்", doctor: "👨‍⚕️ டாக்டர்" }},
    te: { role: { chooseLanguage: "భాషను ఎంచుకోండి:", continueAs: "గా కొనసాగించండి:", patient: "🧑‍⚕️ రోగి", doctor: "👨‍⚕️ డాక్టర్" }},
    ml: { role: { chooseLanguage: "ഭാഷ തിരഞ്ഞെടുക്കുക:", continueAs: "ആകെയുള്ള തുടരണം:", patient: "🧑‍⚕️ രോഗി", doctor: "👨‍⚕️ ഡോക്ടർ" }},
    or: { role: { chooseLanguage: "ଭାଷା ବାଛନ୍ତୁ:", continueAs: "ରୂପେ ଚାଲାନ୍ତୁ:", patient: "🧑‍⚕️ ରୋଗୀ", doctor: "👨‍⚕️ ଡାକ୍ତର" }},
    as: { role: { chooseLanguage: "ভাষা বাছনি কৰক:", continueAs: "ৰূপে অব্যাহত ৰাখক:", patient: "🧑‍⚕️ ৰোগী", doctor: "👨‍⚕️ ডাক্তার" }},
    ks: { role: { chooseLanguage: "زبان منتخب کریں:", continueAs: "کے طور پر جاری رکھیں:", patient: "🧑‍⚕️ مریض", doctor: "👨‍⚕️ ڈاکٹر" }},
    doi: { role: { chooseLanguage: "भाषा चुनें:", continueAs: "के रूप में जारी रखें:", patient: "🧑‍⚕️ रोगी", doctor: "👨‍⚕️ डॉक्टर" }},
    sd: { role: { chooseLanguage: "ٻولي چونڊيو:", continueAs: "جي حيثيت جاري رکو:", patient: "🧑‍⚕️ مريض", doctor: "👨‍⚕️ ڊاڪٽر" }},
    gon: { role: { chooseLanguage: "भाषा निवडा:", continueAs: "रुपात सुरू ठेवा:", patient: "🧑‍⚕️ रुग्ण", doctor: "👨‍⚕️ डॉक्टर" }},
    mai: { role: { chooseLanguage: "भाषा चुनू:", continueAs: "के रूप में जारी रखें:", patient: "🧑‍⚕️ मरीज़", doctor: "👨‍⚕️ डॉक्टर" }},
    mwr: { role: { chooseLanguage: "भाषा चुनो:", continueAs: "रूप में जारी रखो:", patient: "🧑‍⚕️ मरीज", doctor: "👨‍⚕️ डॉक्टर" }}
};

// --- Language Utilities ---
function setLanguage(lang) {
    localStorage.setItem('selectedLanguage', lang);
    applyTranslations(lang);
}

function applyTranslations(lang) {
    const t = translations[lang] || translations['en'];

    const label = document.querySelector('label[for="language-select"]');
    if(label) label.textContent = t.role.chooseLanguage;

    const heading = document.querySelector('h1');
    if(heading) heading.textContent = t.role.continueAs;

    const patientBtn = document.querySelector('.role-btn.patient');
    if(patientBtn) patientBtn.textContent = t.role.patient;

    const doctorBtn = document.querySelector('.role-btn.doctor');
    if(doctorBtn) doctorBtn.textContent = t.role.doctor;
}

// Apply stored language on page load
function applyStoredLanguage() {
    const lang = localStorage.getItem('selectedLanguage') || 'en';
    applyTranslations(lang);

    const languageSelect = document.getElementById('language-select');
    if(languageSelect) languageSelect.value = lang;
}

// --- Event Listeners ---
document.addEventListener('DOMContentLoaded', () => {
    applyStoredLanguage();

    // Dropdown for language selection
    const languageSelect = document.getElementById('language-select');
    if(languageSelect){
        languageSelect.addEventListener('change', () => {
            setLanguage(languageSelect.value);
        });
    }

    // Buttons for language selection
    document.querySelectorAll('.lang-btn[data-lang]').forEach(btn => {
        btn.addEventListener('click', () => {
            const lang = btn.getAttribute('data-lang');
            setLanguage(lang);
            window.location.href = 'role.html';
        });
    });

    // Regional dropdown (if exists)
    const regionalSelect = document.getElementById('regionalLang');
    if(regionalSelect){
        regionalSelect.addEventListener('change', () => {
            const lang = regionalSelect.value;
            setLanguage(lang);
            window.location.href = 'role.html';
        });
    }
});
