import React from "react";
import { FaWhatsapp, FaFacebookF, FaInstagram, FaTiktok } from "react-icons/fa";

export default function ContactUs() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-black py-24 px-8">
      <h1 className="text-6xl font-bold text-amber-400 mb-4 text-center">Contact Us</h1>
      <div className="w-24 h-1 bg-amber-400 mb-12 mx-auto rounded"></div>
      <div className="max-w-md w-full text-center mb-12 space-y-6">
        <p className="text-white text-lg font-semibold">
          We’d love to hear from you! For inquiries, ticket bookings, collaborations, or VIP experiences, our team is ready to assist you.
        </p>
        <p className="text-gray-300 text-md">
          Reach out to us anytime. Whether it’s a question, suggestion, or special request, we ensure a prompt and professional response.
        </p>
      </div>
      <div className="space-y-8 max-w-md w-full">
        <div className="border border-amber-400 rounded-lg shadow-[0_0_20px_rgba(255,191,0,0.15)] p-6 flex items-center space-x-4 text-white hover:scale-105 transition-transform duration-500">
          <span role="img" aria-label="email" className="text-amber-400 text-3xl">📧</span>
          <a href="mailto:vibesup.event@gmail.com" className="hover:text-amber-300 transition-colors text-lg">vibesup.event@gmail.com</a>
        </div>
        <div className="border border-amber-400 rounded-lg shadow-[0_0_20px_rgba(255,191,0,0.15)] p-6 flex items-center space-x-4 text-white hover:scale-105 transition-transform duration-500">
          <span role="img" aria-label="phone" className="text-amber-400 text-3xl">📱</span>
          <a href="tel:+19492479309" className="hover:text-amber-300 transition-colors text-lg">+1 (949) 247-9309</a>
        </div>
        <div className="border border-amber-400 rounded-lg shadow-[0_0_20px_rgba(255,191,0,0.15)] p-6 flex items-center space-x-4 text-white hover:scale-105 transition-transform duration-500">
          <span role="img" aria-label="phone" className="text-amber-400 text-3xl">📱</span>
          <a href="tel:+19178187850" className="hover:text-amber-300 transition-colors text-lg">+1 (917) 818-7850</a>
        </div>
      </div>

      <section className="mt-16 w-full max-w-md text-center">
        <h2 className="text-3xl font-semibold text-amber-400 mb-6 border-b-4 border-amber-400 inline-block pb-2">Follow Us</h2>
        <div className="flex justify-center space-x-10 text-amber-400 text-2xl">
          <a href="https://wa.me/19492479309" aria-label="WhatsApp" title="Message us on WhatsApp" className="hover:text-amber-200 transition-colors shadow-[0_0_10px_rgba(255,191,0,0.3)] rounded-full p-2"><FaWhatsapp /></a>
          <a href="https://www.facebook.com/vibeupevents" aria-label="Facebook" title="Follow us on Facebook" className="hover:text-amber-200 transition-colors shadow-[0_0_10px_rgba(255,191,0,0.3)] rounded-full p-2"><FaFacebookF /></a>
          <a href="https://www.instagram.com/vibeupevent/?__pwa=1" aria-label="Instagram" title="Follow us on Instagram" className="hover:text-amber-200 transition-colors shadow-[0_0_10px_rgba(255,191,0,0.3)] rounded-full p-2"><FaInstagram /></a>
          <a href="https://www.tiktok.com/@vibesupevent" aria-label="TikTok" title="Follow us on TikTok" className="hover:text-amber-200 transition-colors shadow-[0_0_10px_rgba(255,191,0,0.3)] rounded-full p-2"><FaTiktok /></a>
        </div>
      </section>
    </main>
  );
}
