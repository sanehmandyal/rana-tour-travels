import { useState } from "react";
import { useLocation } from "react-router-dom";
import { CheckCircle2, Loader2 } from "lucide-react";
import client from "../api/client";

const TRIP_TYPES = ["One Way", "Round Trip", "Local", "Airport Transfer", "Outstation", "Sightseeing", "Corporate", "Group Travel"];

export default function Enquiry() {
  const location = useLocation();
  const prefill = location.state || {};

  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    email: "",
    pickupLocation: prefill.from || "",
    dropLocation: prefill.to || prefill.destination || "",
    travelDate: prefill.travelDate || "",
    travelTime: "",
    returnDate: "",
    travellers: prefill.travellers || 1,
    vehicleType: prefill.vehicleType || "",
    tripType: "One Way",
    additionalRequirements: prefill.service || prefill.package ? `Interested in: ${prefill.service || prefill.package}` : "",
  });
  const [status, setStatus] = useState("idle"); // idle | loading | success | error
  const [errorMsg, setErrorMsg] = useState("");
  const [enquiryId, setEnquiryId] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});

  const update = (key, value) => setForm((f) => ({ ...f, [key]: value }));

  const validate = () => {
    const errs = {};
    if (!form.fullName.trim()) errs.fullName = "Full name is required.";
    if (!form.phone.trim() || form.phone.replace(/\D/g, "").length < 10) errs.phone = "A valid phone number is required.";
    if (!form.pickupLocation.trim()) errs.pickupLocation = "Pickup location is required.";
    setFieldErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setStatus("loading");
    setErrorMsg("");
    try {
      const { data } = await client.post("/enquiries", form);
      setEnquiryId(data.enquiryId);
      setStatus("success");
    } catch (err) {
      setStatus("error");
      setErrorMsg(err.response?.data?.message || "Something went wrong. Please try again or call us directly.");
    }
  };

  if (status === "success") {
    return (
      <div className="container-app py-24 max-w-lg mx-auto text-center">
        <CheckCircle2 className="mx-auto text-forest mb-4" size={56} />
        <h1 className="font-display text-3xl font-bold text-navy mb-3">Your travel request has been received.</h1>
        <p className="text-navy/70 mb-2">Your enquiry ID:</p>
        <p className="text-2xl font-mono font-bold text-teal mb-6">{enquiryId}</p>
        <p className="text-navy/60 text-sm">Our team will contact you shortly to confirm availability and share a quote. No payment is required at this stage.</p>
      </div>
    );
  }

  return (
    <div>
      <section className="bg-evening text-white py-14">
        <div className="container-app">
          <h1 className="font-display text-4xl font-bold mb-2">Request a Callback</h1>
          <p className="text-white/75">Tell us about your trip — no payment required to submit an enquiry.</p>
        </div>
      </section>

      <form onSubmit={submit} className="container-app py-12 max-w-2xl mx-auto card p-6 md:p-10 space-y-5">
        <div className="grid md:grid-cols-2 gap-5">
          <Field label="Full Name" error={fieldErrors.fullName}>
            <input className="input" value={form.fullName} onChange={(e) => update("fullName", e.target.value)} />
          </Field>
          <Field label="Phone" error={fieldErrors.phone}>
            <input className="input" value={form.phone} onChange={(e) => update("phone", e.target.value)} />
          </Field>
        </div>

        <Field label="Email (optional)">
          <input type="email" className="input" value={form.email} onChange={(e) => update("email", e.target.value)} />
        </Field>

        <div className="grid md:grid-cols-2 gap-5">
          <Field label="Pickup Location" error={fieldErrors.pickupLocation}>
            <input className="input" value={form.pickupLocation} onChange={(e) => update("pickupLocation", e.target.value)} />
          </Field>
          <Field label="Drop Location">
            <input className="input" value={form.dropLocation} onChange={(e) => update("dropLocation", e.target.value)} />
          </Field>
        </div>

        <div className="grid md:grid-cols-3 gap-5">
          <Field label="Travel Date">
            <input type="date" className="input" value={form.travelDate} onChange={(e) => update("travelDate", e.target.value)} />
          </Field>
          <Field label="Travel Time">
            <input type="time" className="input" value={form.travelTime} onChange={(e) => update("travelTime", e.target.value)} />
          </Field>
          <Field label="Return Date (optional)">
            <input type="date" className="input" value={form.returnDate} onChange={(e) => update("returnDate", e.target.value)} />
          </Field>
        </div>

        <div className="grid md:grid-cols-3 gap-5">
          <Field label="Number of Travellers">
            <input type="number" min="1" className="input" value={form.travellers} onChange={(e) => update("travellers", e.target.value)} />
          </Field>
          <Field label="Vehicle Type">
            <select className="input" value={form.vehicleType} onChange={(e) => update("vehicleType", e.target.value)}>
              <option value="">Select Vehicle</option>
              <option>Sedan (Maruti Dzire / Toyota Etios)</option>
              <option>SUV (Toyota Innova Crysta / Fortuner)</option>
              <option>4x4 Mountain (Mahindra Scorpio / Thar)</option>
              <option>Tempo Traveller (Force 12 / 17 / 26 Seat)</option>
              <option>Luxury VIP (Audi / BMW / Fortuner Legender)</option>
              <option>Tourist Minibus Coach (27 to 35 Seater)</option>
              <option>Other / Custom Fleet</option>
            </select>
          </Field>
          <Field label="Trip Type">
            <select className="input" value={form.tripType} onChange={(e) => update("tripType", e.target.value)}>
              {TRIP_TYPES.map((t) => (
                <option key={t}>{t}</option>
              ))}
            </select>
          </Field>
        </div>

        <Field label="Additional Requirements">
          <textarea rows={4} className="input" value={form.additionalRequirements} onChange={(e) => update("additionalRequirements", e.target.value)} />
        </Field>

        {status === "error" && <p className="text-red-600 text-sm font-medium">{errorMsg}</p>}

        <button type="submit" disabled={status === "loading"} className="btn-accent w-full flex items-center justify-center gap-2 disabled:opacity-60">
          {status === "loading" && <Loader2 className="animate-spin" size={18} />}
          Request a Callback
        </button>
        <p className="text-xs text-navy/50 text-center">This is not a payment request — we'll contact you to confirm your trip.</p>
      </form>

      <style>{`.input { border: 1px solid #e2e8ea; border-radius: 10px; padding: 0.65rem 0.85rem; width: 100%; font-size: 0.9rem; }
      .input:focus { outline: 2px solid #F5B83D; border-color: transparent; }`}</style>
    </div>
  );
}

function Field({ label, error, children }) {
  return (
    <label className="block">
      <span className="text-sm font-semibold text-navy/80 block mb-1.5">{label}</span>
      {children}
      {error && <span className="text-red-600 text-xs mt-1 block">{error}</span>}
    </label>
  );
}
