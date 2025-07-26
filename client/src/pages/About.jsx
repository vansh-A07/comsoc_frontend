import React from 'react';
import '../styles/about.css';

const About = () => {
  return (
    <div className="about-wrapper">
      <h1 className="about-title">SehatSathi — Your Health Companion</h1>

      <p className="about-intro">
        SehatSathi is built for real people — the ones living in small towns, villages, and places where help isn’t always nearby. We make it easy to find a doctor, get first-aid tips, or locate a nearby clinic — all in one place, without any confusion or tech-heavy stuff.
      </p>

      <section className="about-section">
        <h2>🌱 Our Mission</h2>
        <p>
          We believe everyone should be able to get medical help when they need it — no matter where they live or how tech-savvy they are. Our goal is simple: make healthcare easy, fast, and friendly for everyone.
        </p>
      </section>

      <section className="about-section">
        <h2>❓ Why SehatSathi?</h2>
        <p>
          In India, many lives are lost every day just because help came too late — or never came at all. SehatSathi wants to change that. We're using simple tools, real humans, and trusted networks to bring healthcare to your fingertips.
        </p>
      </section>

      <section className="about-section">
        <h2>💡 What You Can Do on SehatSathi</h2>
        <ul className="about-list">
          <li><strong>👨‍⚕️ Talk to a Doctor:</strong> Reach verified doctors for advice or appointments — fast and easy.</li>
          <li><strong>⛑️ First-Aid Help:</strong> Get step-by-step visual and written guidance for common injuries or emergencies.</li>
          <li><strong>🏥 Nearby Clinics & Hospitals:</strong> Find trusted health centers and pharmacies around you — even with low mobile signal.</li>
          <li><strong>💊 Order Medicines:</strong> Get basic medicines delivered at home with help from your local chemist.</li>
        </ul>
      </section>

      <section className="about-section highlight-box">
        <h2>🫶 Made for Everyone</h2>
        <p>No complicated steps. No forced logins. No ads. No data-selling. Just help when you need it.</p>
        <p>It works for elders, kids, anyone — in your language, at your speed.</p>
      </section>

      <section className="about-section">
        <h2>🔮 What’s Coming Next</h2>
        <ul className="about-list">
          <li>🎙️ Voice-based help</li>
          <li>🤖 AI Chatbot</li>
          <li>📱 SMS / WhatsApp doctor contact</li>
          <li>🌐 Language toggle based on your region</li>
          <li>🧑‍🤝‍🧑 NGO partnerships for outreach</li>
          <li>📲 App version</li>
          <li>📕 Offline First-Aid access</li>
        </ul>
      </section>

      <blockquote className="about-quote">
        "Healthcare shouldn’t be a luxury or a puzzle. <br />
        SehatSathi is here to make sure help finds you — wherever you are."
      </blockquote>

      <p className="about-tagline">Sehat ka SAATHI, HAR Pal ke SAATH Hi!!</p>
    </div>
  );
};

export default About;
