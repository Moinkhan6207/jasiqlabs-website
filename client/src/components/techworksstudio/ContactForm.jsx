import { useState } from "react";
import { submitLead } from "../../utils/api";
import Field from "../ui/Field";
import Button from "../ui/Button";

export default function ContactForm({ successMessage }) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    projectDetails: "",
  });

  const [status, setStatus] = useState({ state: "idle", message: "" });

  async function onSubmit(e) {
    e.preventDefault();
    setStatus({ state: "loading", message: "" });

    try {
      // ✅ FIX 1: Company ko Name ke saath jod rahe hain taaki Dashboard par saamne dikhe
      // Example: "Sahil (Kisan Pure Milk)"
      const nameWithCompany = `${form.name} (${form.company})`;

      // ✅ FIX 2: Project details ko message banaya
      const fullMessage = `Company: ${form.company} | Requirements: ${form.projectDetails}`;

      await submitLead({
        name: nameWithCompany, // Name + Company combined
        email: form.email,
        phone: form.phone,
        
        interestType: "CLIENT",
        
        // ✅ FIX 3: Division ko 'TWS' bhejein (Database screenshot ke hisab se RWS/TWS use ho raha hai)
        division: "TWS", 
        
        // ✅ FIX 4: Sabse Important - 'sourcePage' key use karein (Database column yehi hai)
        sourcePage: "techworksstudio",
        source: "techworksstudio", // Backup ke liye dono bhej rahe hain
        
        message: fullMessage 
      });

      setStatus({
        state: "success",
        message: successMessage || "Request received. We will contact you within 24 hours.",
      });
      setForm({ name: "", email: "", phone: "", company: "", projectDetails: "" });
    } catch (err) {
      console.error(err);
      setStatus({
        state: "error",
        message: err?.message || "Failed to submit request. Please try again.",
      });
    }
  }

  return (
    <form onSubmit={onSubmit} className="max-w-2xl mx-auto">
      <div className="bg-white rounded-xl shadow-lg p-8">
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Field label="Full Name">
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Your full name"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all text-gray-900"
              />
            </Field>

            <Field label="Company Name">
              <input
                type="text"
                value={form.company}
                onChange={(e) => setForm({ ...form, company: e.target.value })}
                placeholder="Your company name"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all text-gray-900"
              />
            </Field>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Field label="Email">
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="your.email@company.com"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all text-gray-900"
              />
            </Field>

            <Field label="Phone">
              <input
                type="tel"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                placeholder="Your phone number"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all text-gray-900"
              />
            </Field>
          </div>

          <Field label="Project Details">
            <textarea
              value={form.projectDetails}
              onChange={(e) => setForm({ ...form, projectDetails: e.target.value })}
              placeholder="Tell us about your project requirements..."
              rows={5}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all text-gray-900"
            />
          </Field>

          <Button type="submit" variant="primary" className="w-full" disabled={status.state === "loading"}>
            {status.state === "loading" ? "Submitting..." : "Submit Request"}
          </Button>

          {status.state !== "idle" && (
            <div
              className={`p-4 rounded-lg text-center font-medium ${
                status.state === "success"
                  ? "bg-green-50 text-green-800 border border-green-200"
                  : "bg-red-50 text-red-800 border border-red-200"
              }`}
            >
              {status.message}
            </div>
          )}
        </div>
      </div>
    </form>
  );
}