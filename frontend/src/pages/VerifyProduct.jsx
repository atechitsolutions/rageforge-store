import { useState } from "react";
import ProductTub from "../components/ProductTub.jsx";
import TiltCard from "../components/TiltCard.jsx";
import ThreeBg from "../components/ThreeBg.jsx";
import { useStore } from "../store.jsx";

const CODE_FORMAT = /^RF-\d{4}-[A-Z0-9]{4}$/;

export default function VerifyProduct() {
  const { catalog } = useStore();
  const [code, setCode] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [errors, setErrors] = useState({});
  const [result, setResult] = useState("idle");
  const flagship = catalog.products.find((product) => product.imageKey) || catalog.products[0];

  const submit = (event) => {
    event.preventDefault();
    const cleaned = code.trim().toUpperCase().replace(/\s/g, "");
    const nextErrors = {};
    if (!CODE_FORMAT.test(cleaned)) nextErrors.code = "Use the verification-code format shown below.";
    if (!/^[6-9]\d{9}$/.test(phone)) nextErrors.phone = "Enter a 10-digit Indian mobile number.";
    if (!/^[^\s@]+@gmail\.com$/i.test(email.trim())) nextErrors.email = "Enter a valid Gmail address.";
    setCode(cleaned);
    setErrors(nextErrors);
    setResult(Object.keys(nextErrors).length === 0 ? "verified" : "invalid");
  };

  return (
    <div className="verify-page">
      <div className="verify-ambient verify-ambient-one" /><div className="verify-ambient verify-ambient-two" />
      <section className="wrap verify-shell">
        <section className="verify-masthead">
          <ThreeBg kind="topology" className="verify-title-bg" />
          <div className="verify-intro">
            <p className="eyebrow">RageForge authenticator</p>
            <h1 className="display">Verify your <span>product.</span></h1>
            <p>Enter the verification code printed on your RageForge pack to check its product record.</p>
          </div>
          <div className="verify-code-mark" aria-hidden="true"><i /><i /><i /><i /><i /><i /><i /><i /></div>
        </section>

        <div className={"verify-stage " + (result === "verified" ? "is-verified" : "")}>
          <div className="verify-floor" /><div className="verify-orbit orbit-one" /><div className="verify-orbit orbit-two" />
          {flagship && <TiltCard className="verify-pack" max={7}><ProductTub product={flagship} size="lg" /></TiltCard>}
          <div className="verify-scanner" aria-hidden="true" />

          <form className="verify-card" noValidate onSubmit={submit}>
            <p className="eyebrow">Pack authentication</p>
            <h2 className="h2">Fill it in to verify your product.</h2>
            <p className="verify-copy">Find the code beneath the scratch panel or on the side of your pack.</p>
            <label className="field">
              <span>Verification code</span>
              <input value={code} onChange={(event) => { setCode(event.target.value.toUpperCase()); setErrors((current) => ({ ...current, code: "" })); setResult("idle"); }} placeholder="RF-2026-AB12" maxLength={12} autoCapitalize="characters" aria-invalid={!!errors.code} aria-describedby="verify-help" />
              {errors.code && <em>{errors.code}</em>}
            </label>
            <p className="verify-help" id="verify-help">Format: RF-2026-AB12</p>
            <div className="two verify-contact-fields">
              <label className="field">
                <span>Mobile number</span>
                <input value={phone} onChange={(event) => { setPhone(event.target.value.replace(/\D/g, "")); setErrors((current) => ({ ...current, phone: "" })); setResult("idle"); }} placeholder="10-digit mobile number" inputMode="numeric" maxLength={10} autoComplete="tel" aria-invalid={!!errors.phone} />
                {errors.phone && <em>{errors.phone}</em>}
              </label>
              <label className="field">
                <span>Gmail address</span>
                <input type="email" value={email} onChange={(event) => { setEmail(event.target.value); setErrors((current) => ({ ...current, email: "" })); setResult("idle"); }} placeholder="you@gmail.com" autoComplete="email" aria-invalid={!!errors.email} />
                {errors.email && <em>{errors.email}</em>}
              </label>
            </div>
            <button className="btn block">Verify product <span aria-hidden="true">→</span></button>

            {result === "invalid" && <div className="verify-result error" role="alert"><b>Verification failed</b><span>Please enter a valid verification code and correct the highlighted details.</span></div>}
            <p className="fine">Demo verification accepts the sample code format. Connect this screen to your secure serial-code database before a live launch.</p>
          </form>
          {result === "verified" && <div className="verify-success-overlay" role="status" aria-live="polite">
            <div className="verify-success-content">
              <span className="success-seal" aria-hidden="true">✓</span>
              <p className="eyebrow">Authentication complete</p>
              <h2>Product<br /><span>verified.</span></h2>
              <p>Your product has been verified and is <strong>100% genuine.</strong></p>
              <button type="button" className="btn ghost" onClick={() => setResult("idle")}>Verify another product</button>
            </div>
          </div>}
        </div>
      </section>
    </div>
  );
}
