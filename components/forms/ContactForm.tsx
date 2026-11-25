"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";

import { formUi, type FormConfig, type FormField } from "@/lib/content/forms";
import { t, type Locale } from "@/lib/locale";

type Errors = Record<string, string>;

function validateField(field: FormField, value: string, locale: Locale): string {
  const v = value.trim();
  if (field.required && v === "") return t(formUi.required, locale);
  if (!v) return "";
  if (field.kind === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v))
    return t(formUi.email, locale);
  if (field.maxLength && v.length > field.maxLength) return t(formUi.tooLong, locale);
  if (field.minLength && v.length < field.minLength) {
    return field.name === "description" || field.name === "message"
      ? t(formUi.tooShort, locale)
      : t(formUi.required, locale);
  }
  return "";
}

/**
 * Formulaire de contact — soumission AJAX (§ 8.8) avec repli POST classique
 * si JavaScript est désactivé.
 */
export default function ContactForm({
  config,
  locale = "fr",
}: {
  config: FormConfig;
  /** Langue de la page : les libellés du formulaire suivent. */
  locale?: Locale;
}) {
  const pathname = usePathname() || "/";
  const [values, setValues] = useState<Record<string, string>>({});
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState("");
  const [done, setDone] = useState(false);
  const [sending, setSending] = useState(false);

  function set(name: string, value: string) {
    setValues((v) => ({ ...v, [name]: value }));
    if (errors[name]) {
      setErrors((e) => ({ ...e, [name]: "" }));
    }
  }

  function blur(field: FormField) {
    const err = validateField(field, values[field.name] ?? "", locale);
    setErrors((e) => ({ ...e, [field.name]: err }));
  }

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;

    const nextErrors: Errors = {};
    let first: HTMLElement | null = null;
    for (const field of config.fields) {
      const err = validateField(field, values[field.name] ?? "", locale);
      if (err) {
        nextErrors[field.name] = err;
        if (!first) first = form.elements.namedItem(field.name) as HTMLElement | null;
      }
    }

    // Piège à robots : silencieux, jamais signalé.
    const honeypot = (form.elements.namedItem("societe") as HTMLInputElement | null)?.value ?? "";
    if (honeypot) {
      setDone(true);
      return;
    }

    if (Object.keys(nextErrors).length) {
      setErrors(nextErrors);
      setStatus(t(formUi.invalidGroup, locale));
      first?.focus();
      return;
    }

    setErrors({});
    setStatus("");
    setSending(true);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ kind: config.kind, redirect: pathname, ...values }),
      });
      if (!res.ok) {
        setStatus(t(formUi.server, locale));
        return;
      }
      setStatus("");
      setDone(true);
      requestAnimationFrame(() => {
        document.querySelector<HTMLElement>("[data-success]")?.scrollIntoView({ behavior: "smooth", block: "center" });
      });
    } catch {
      setStatus(t(formUi.network, locale));
    } finally {
      setSending(false);
    }
  }

  if (done) {
    return (
      <div className="success" data-success role="status">
        <i className="ph ph-check-circle" aria-hidden="true"></i>
        <h3>{t(config.success, locale)}</h3>
        <p>{t(config.reassurance, locale) || t(formUi.defaultReassurance, locale)}</p>
      </div>
    );
  }

  return (
    <form className="form" data-form method="post" action="/api/contact" onSubmit={submit} noValidate>
      <input type="hidden" name="kind" value={config.kind} />
      <input type="hidden" name="redirect" value={pathname} />

      {config.fields.map((field) => (
        <div key={field.name} className={`field${errors[field.name] ? " is-invalid" : ""}`}>
          <label className="field__label" htmlFor={`f-${field.name}`}>
            {t(field.label, locale)}
            {field.required && <span aria-hidden="true"> *</span>}
          </label>
          {field.kind === "select" ? (
            <select
              className="select"
              id={`f-${field.name}`}
              name={field.name}
              required={field.required}
              value={values[field.name] ?? ""}
              onChange={(e) => set(field.name, e.target.value)}
              onBlur={() => blur(field)}
              aria-invalid={!!errors[field.name]}
            >
              <option value="">{t(formUi.selection, locale)}</option>
              {field.options?.map((opt) => (
                <option key={opt.fr} value={t(opt, locale)}>
                  {t(opt, locale)}
                </option>
              ))}
            </select>
          ) : field.kind === "textarea" ? (
            <textarea
              className="textarea"
              id={`f-${field.name}`}
              name={field.name}
              required={field.required}
              placeholder={field.placeholder ? t(field.placeholder, locale) : undefined}
              rows={field.name === "description" || field.name === "message" ? 6 : 4}
              maxLength={field.maxLength}
              value={values[field.name] ?? ""}
              onChange={(e) => set(field.name, e.target.value)}
              onBlur={() => blur(field)}
              aria-invalid={!!errors[field.name]}
            />
          ) : (
            <input
              className="input"
              id={`f-${field.name}`}
              name={field.name}
              type={field.kind}
              required={field.required}
              placeholder={field.placeholder ? t(field.placeholder, locale) : undefined}
              autoComplete={field.autocomplete}
              value={values[field.name] ?? ""}
              onChange={(e) => set(field.name, e.target.value)}
              onBlur={() => blur(field)}
              aria-invalid={!!errors[field.name]}
            />
          )}
          <p className="field__error" role="alert">
            {errors[field.name] || t(formUi.required, locale)}
          </p>
        </div>
      ))}

      {/* Piège à robots — invisible, jamais pré-rempli par l'utilisateur */}
      <input
        className="honeypot"
        type="text"
        name="societe"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        defaultValue=""
      />

      {config.warning && (
        <p className="form__note">
          <i className="ph ph-info" aria-hidden="true"></i>
          {t(config.warning, locale)}
        </p>
      )}

      <div className="form__actions">
        <button className="btn btn--accent" type="submit" data-submit disabled={sending} data-loading={sending}>
          {sending ? t(formUi.sending, locale) : t(config.submit, locale)}
        </button>
        <p className="form__status" data-status role="status" aria-live="polite">
          {status}
        </p>
      </div>

      {config.reassurance && (
        <p className="form__note">
          <i className="ph ph-lock-key" aria-hidden="true"></i>
          {t(config.reassurance, locale)}
        </p>
      )}
    </form>
  );
}
