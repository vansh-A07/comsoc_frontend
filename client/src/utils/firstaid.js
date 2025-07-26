const firstAidList = [
  {
    title: "1. Burns (जलने पर)",
    steps: [
      "Cool the burn under running cold water for 10-15 minutes.",
      "Do not apply ice or ointments.",
      "Cover with a clean, non-fluffy cloth or sterile gauze.",
    ],
  },
  {
    title: "2. Cuts & Wounds (कट या घाव)",
    steps: [
      "Wash hands, clean the wound with clean water.",
      "Apply pressure to stop bleeding.",
      "Cover with a sterile bandage.",
      "Seek help if bleeding doesn’t stop.",
    ],
  },
  {
    title: "3. Nosebleed (नाक से खून आना)",
    steps: [
      "Sit upright, lean slightly forward.",
      "Pinch the soft part of the nose for 10 minutes.",
      "Avoid blowing nose afterward.",
    ],
  },
  {
    title: "4. Choking (दम घुटना)",
    steps: [
      "Encourage the person to cough if possible.",
      "If not, perform 5 back blows between shoulder blades.",
      "Then 5 abdominal thrusts (Heimlich maneuver).",
      "Call emergency help immediately.",
    ],
  },
  {
    title: "5. Fractures (हड्डी टूटना)",
    steps: [
      "Immobilize the limb, don’t try to straighten it.",
      "Apply a splint if trained.",
      "Use ice packs to reduce swelling.",
    ],
  },
  {
    title: "6. Electric Shock",
    steps: [
      "Do not touch the person until the power source is off.",
      "Call for help.",
      "Start CPR if the person is unconscious and not breathing.",
    ],
  },
  {
    title: "7. Eye Injury",
    steps: [
      "Do not rub or apply pressure.",
      "Flush the eye gently with clean water or saline.",
      "If object is stuck, do not remove — seek medical help.",
    ],
  },
  {
    title: "8. Fainting (बेहोशी)",
    steps: [
      "Make the person lie down with feet raised.",
      "Loosen tight clothing.",
      "Check for breathing — if none, start CPR.",
    ],
  },
  {
    title: "9. Heat Stroke",
    steps: [
      "Move to a cool place.",
      "Remove excess clothing.",
      "Apply cool, wet cloths or bathe in cool water.",
      "Give water slowly if conscious.",
    ],
  },
  {
    title: "10. Seizures (दौरा पड़ना)",
    steps: [
      "Clear area around the person.",
      "Do not restrain or put anything in the mouth.",
      "After the seizure, place them in recovery position.",
    ],
  },
  {
    title: "11. Heart Attack",
    steps: [
      "Call emergency immediately.",
      "Make the person sit down, rest.",
      "Give aspirin (if not allergic).",
      "Start CPR if unconscious and not breathing.",
    ],
  },
  {
    title: "12. Animal Bites",
    steps: [
      "Wash the bite with soap and water for 5–10 mins.",
      "Apply antiseptic.",
      "Seek a doctor immediately for rabies vaccine if required.",
    ],
  },
];

export function setdata() {
  if (!localStorage.getItem("firstAidData")) {
    localStorage.setItem("firstAidData", JSON.stringify(firstAidList));
  }
}

export function getData() {
  const data = localStorage.getItem("firstAidData");
  return data ? JSON.parse(data) : [];
}
