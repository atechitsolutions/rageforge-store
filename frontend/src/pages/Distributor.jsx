import { useState } from "react";
import { submitDistributorApplication } from "../api.js";

const INITIAL_FORM = {
  businessName: "", contactName: "", email: "", phone: "", businessType: "",
  city: "", state: "", pincode: "", productInterest: "", message: "", consent: false,
};

export default function Distributor() {
  const [form, setForm] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState({});
  const [busy, setBusy] = useState(false);
  const [submitted, setSubmitted] = useState(null);

  const update = (key) => (event) => {
    const value = event.target.type === "checkbox" ? event.target.checked : event.target.value;
    setForm((current) => ({ ...current, [key]: value }));
  };

  const validate = () => {
    const next = {};
    if (form.businessName.trim().length < 2) next.businessName = "Enter your business name";
    if (form.contactName.trim().length < 2) next.contactName = "Enter your name";
    if (!/^\S+@\S+\.\S+$/.test(form.email)) next.email = "Enter a valid email";
    if (!/^[6-9]\d{9}$/.test(form.phone)) next.phone = "Enter a 10-digit Indian mobile number";
    if (!form.businessType) next.businessType = "Choose your business type";
    if (!form.city.trim()) next.city = "Enter your city";
    if (!form.state.trim()) next.state = "Enter your state";
    if (!/^\d{6}$/.test(form.pincode)) next.pincode = "Enter a 6-digit pincode";
    if (!form.consent) next.consent = "Please agree so we can contact you";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const submit = async (event) => {
    event.preventDefault();
    if (!validate()) return;
    setBusy(true);
    try {
      setSubmitted(await submitDistributorApplication(form));
    } finally {
      setBusy(false);
    }
  };

  const Field = ({ name, label, type = "text", children, ...props }) => (
    <label className="field">
      <span>{label}</span>
      {children || <input type={type} value={form[name]} onChange={update(name)} aria-invalid={!!errors[name]} {...props} />}
      {errors[name] && <em>{errors[name]}</em>}
    </label>
  );

  if (submitted) {
    return (
      <div className="wrap page distributor-page">
        <section className="distributor-hero"><p className="eyebrow">Application received</p><h1 className="display">You’re in the <span>forge.</span></h1></section>
        <div className="application-success">
          <div className="success-mark" aria-hidden="true">✓</div>
          <h2 className="h2">Thanks, {submitted.contactName}.</h2>
          <p>We’ve received your distributor enquiry{submitted.applicationId ? ` (${submitted.applicationId})` : ""}. Our team will review it and get in touch using the contact details you provided.</p>
          {submitted.saved === "device" && <p className="fine">The API was unavailable, so this demo application was saved on this device.</p>}
          <button className="btn" onClick={() => { setForm(INITIAL_FORM); setErrors({}); setSubmitted(null); }}>Submit another application</button>
        </div>
      </div>
    );
  }

  return (
    <div className="wrap page distributor-page">
      <section className="distributor-hero">
        <p className="eyebrow">RageForge partner network</p>
        <h1 className="display">Become a <span>distributor.</span></h1>
        <p className="lead">Help athletes and everyday lifters fuel their next level. Tell us about your business and we’ll explore how we can grow together.</p>
      </section>
      <div className="distributor-layout">
        <aside className="partner-perks">
          <p className="eyebrow">Why partner</p>
          <h2 className="h2">Built for the people who build communities.</h2>
          <ul><li>Performance nutrition across key training categories</li><li>Support for retail, gym and online partners</li><li>Launch offers and product updates for your customers</li></ul>
          <p className="fine">Submitting this form is an enquiry, not a distribution agreement.</p>
        </aside>
        <form className="distributor-form" noValidate onSubmit={submit}>
          <h2 className="h2">Your details</h2>
          <div className="two"><Field name="businessName" label="Business name" autoComplete="organization" /><Field name="contactName" label="Your name" autoComplete="name" /></div>
          <div className="two"><Field name="email" label="Business email" type="email" autoComplete="email" /><Field name="phone" label="Mobile number" inputMode="numeric" maxLength={10} autoComplete="tel" /></div>
          <Field name="businessType" label="Business type">
            <select value={form.businessType} onChange={update("businessType")} aria-invalid={!!errors.businessType}>
              <option value="">Select one</option><option>Retail store</option><option>Gym / fitness centre</option><option>Online reseller</option><option>Wholesale distributor</option><option>Other</option>
            </select>
          </Field>
          <div className="three"><Field name="city" label="City" autoComplete="address-level2" /><Field name="state" label="State" autoComplete="address-level1" /><Field name="pincode" label="Pincode" inputMode="numeric" maxLength={6} autoComplete="postal-code" /></div>
          <Field name="productInterest" label="Products you’re interested in (optional)"><input value={form.productInterest} onChange={update("productInterest")} placeholder="e.g. whey protein, creatine" /></Field>
          <Field name="message" label="Tell us about your business (optional)"><textarea value={form.message} onChange={update("message")} rows="4" placeholder="Number of locations, audience, sales channels…" /></Field>
          <label className="consent"><input type="checkbox" checked={form.consent} onChange={update("consent")} aria-invalid={!!errors.consent} /> <span>I agree that RageForge may contact me about this distributor enquiry.</span></label>
          {errors.consent && <p className="field-error">{errors.consent}</p>}
          <button className="btn block" disabled={busy}>{busy ? "Submitting application…" : "Submit distributor enquiry"}</button>
        </form>
      </div>
    </div>
  );
}
