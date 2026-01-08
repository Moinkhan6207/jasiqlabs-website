import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { submitLead } from "../../utils/api"; // Ensure path is correct
import Field from "../ui/Field"; // Ensure path is correct
import Button from "../ui/Button"; // Ensure path is correct

export default function ApplyForm({ programs = [] }) {
  const [searchParams] = useSearchParams();
  const programParam = searchParams.get("program");

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    program: programParam || "",
  });

  const [status, setStatus] = useState({ state: "idle", message: "" });

  // Auto-fill program if present in URL
  useEffect(() => {
    if (programParam && programs.length > 0) {
      const programExists = programs.some((p) => p.id === programParam);
      if (programExists) {
        setForm((prev) => ({ ...prev, program: programParam }));
      }
    }
  }, [programParam, programs]);

  async function onSubmit(e) {
    e.preventDefault();
    setStatus({ state: "loading", message: "" });

    if (!form.program) {
      setStatus({ state: "error", message: "Please select a program" });
      return;
    }

    // Program ka sahi naam nikalein
    const selectedProgramTitle = programs.find(p => p.id === form.program)?.title || form.program;

    try {
      // ✅ FINAL FIX: Payload exactly matching your Neon Database Screenshot
      await submitLead({
        // Trick: Program name ko Name ke saath jod rahe hain taaki ye miss na ho
        name: `${form.name} (${selectedProgramTitle})`, 
        
        email: form.email,
        phone: form.phone,
        
        interestType: "STUDENT",
        
        // Fix 1: Database me value "RWS" hai, "REALWORK_STUDIO" nahi
        division: "RWS", 
        
        // Fix 2: Database column "sourcePage" hai. Hum dono bhejenge safety ke liye.
        sourcePage: "realworkstudio",
        source: "realworkstudio", 
        
        // Fix 3: Message field me bhi daal dete hain backup ke liye
        message: `Applied for: ${selectedProgramTitle}`
      });

      setStatus({
        state: "success",
        message: "Application submitted successfully! We will contact you soon.",
      });
      setForm({ name: "", email: "", phone: "", program: programParam || "" });
    } catch (err) {
      console.error("Submission Error:", err);
      setStatus({
        state: "error",
        message: err?.message || "Failed to submit application. Please try again.",
      });
    }
  }

  return (
    <form onSubmit={onSubmit} className="max-w-2xl mx-auto">
      <div className="bg-white rounded-xl shadow-lg p-8">
        <div className="space-y-6">
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

          <Field label="Email">
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="your.email@example.com"
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

          <Field label="Select Program">
            <select
              value={form.program}
              onChange={(e) => setForm({ ...form, program: e.target.value })}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all text-gray-900 bg-white"
            >
              <option value="">Choose a program</option>
              {programs.map((program) => (
                <option key={program.id} value={program.id}>
                  {program.title}
                </option>
              ))}
            </select>
          </Field>

          <Button type="submit" variant="primary" className="w-full" disabled={status.state === "loading"}>
            {status.state === "loading" ? "Submitting..." : "Submit Application"}
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
