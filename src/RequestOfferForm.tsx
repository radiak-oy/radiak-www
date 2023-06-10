import React, { useCallback, useRef, useState } from "react";
import emailjs from "@emailjs/browser";
import ReCAPTCHA from "react-google-recaptcha";

export default function RequestOfferForm() {
  const formRef = useRef<HTMLFormElement>(null);

  const [wantsFacelift, setWantsFacelift] = useState(false);

  const [recaptchaToken, setRecaptchaToken] = useState<string | null>(null);
  const [state, setState] = useState<"NOT_SENT" | "SENDING" | "SENT">(
    "NOT_SENT"
  );
  const [errorMessage, setErrorMessage] = useState("");

  const onSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      if (formRef.current == null) throw new Error("Form ref is null.");

      setErrorMessage("");

      if (recaptchaToken == null) {
        setErrorMessage("Suorita reCAPTCHA-testi ensin.");
        return;
      }

      const formData = new FormData(formRef.current);
      const templateParams: { [key: string]: any } = {
        "g-recaptcha-response": recaptchaToken,
        consent:
          "Hyväksyn, että tietoni käsitellään rekisteri- ja tietosuojaselosteen mukaisesti.",
      };

      formData.forEach((value, key) => (templateParams[key] = value));

      setState("SENDING");

      try {
        const response = await emailjs.send(
          "default_service",
          "template_requestoffer",
          templateParams,
          "W85Db0e6PUMOJ_y2c"
        );
        if (response.status !== 200) throw new Error();

        setState("SENT");
      } catch (e: any) {
        setState("NOT_SENT");
        setErrorMessage(
          "Pyynnön lähetyksessä tapahtui virhe. Yritä uudelleen."
        );
      }
    },
    [formRef, recaptchaToken]
  );

  return (
    <form ref={formRef} className="flex flex-col" onSubmit={onSubmit}>
      <label htmlFor="input-name" className="font-medium">
        Nimi
      </label>
      <input
        id="input-name"
        className="mb-2"
        name="name"
        type="text"
        required
        maxLength={64}
      />
      <label htmlFor="input-company-name" className="font-medium">
        Yrityksen nimi
      </label>
      <input
        id="input-company-name"
        className="mb-2"
        name="companyName"
        type="text"
        required
        maxLength={64}
      />
      <label htmlFor="input-email" className="font-medium">
        Sähköpostiosoite
      </label>
      <input
        id="input-email"
        className="mb-2"
        name="email"
        type="email"
        required
        maxLength={64}
      />
      <div className="mb-2 flex items-baseline">
        <input
          id="input-facelift"
          name="wantsFacelift"
          type="checkbox"
          className="mr-2"
          defaultChecked={wantsFacelift}
          onChange={(e) => setWantsFacelift(e.target.checked)}
        />
        <label htmlFor="input-facelift" className="font-medium">
          Haluan uudistaa nykyiset verkkosivuni
        </label>
      </div>
      {wantsFacelift && (
        <>
          <label htmlFor="input-current-website" className="font-medium">
            Sivujen osoite
          </label>
          <input
            id="input-current-website"
            className="mb-2"
            name="currentWebsite"
            type="url"
            required={wantsFacelift}
            maxLength={128}
          />
        </>
      )}
      {state === "SENT" ? (
        <span className="block text-lg font-bold text-center">
          Olemme vastaanottaneet tarjouspyyntösi. Kiitos.
        </span>
      ) : (
        <>
          <div className="mb-4 flex items-baseline">
            <input
              id="input-consent"
              type="checkbox"
              className="mr-2"
              required
              disabled
            />
            <label htmlFor="input-consent" className="font-medium">
              Hyväksyn, että tietoni tallennetaan
              <a
                href="rekisteri-ja-tietosuojaseloste.html"
                target="_blank"
                rel="noopener noreferrer"
                className="underline underline-offset-4 hover:text-secondary-700"
              >
                {" "}
                rekisteri- ja tietosuojaselosteen{" "}
              </a>
              mukaisesti.
            </label>
          </div>
          <ReCAPTCHA
            className="mb-4"
            style={{
              transformOrigin: "0 0",
              transform: `scale(${window.innerWidth < 374 ? 0.826 : 1})`,
            }}
            sitekey="6Lf9BjwmAAAAAJSIcN6mw3LjyS32U07qvxSXaxVA"
            onChange={(token) => setRecaptchaToken(token)}
          />
          <button
            disabled
            type="submit"
            className="p-2 rounded font-bold border-2 border-secondary-500 text-secondary-500 transition"
          >
            {state === "SENDING" ? "..." : "Lähetä"}
          </button>
          <span className="pt-4 text-secondary-800">
            Radiak Oy:tä ei ole vielä perustettu. Lomaketta ei voi lähettää eikä
            sen tietoja tallenneta.
          </span>
          <span className="pt-2 font-medium text-red-500">{errorMessage}</span>
        </>
      )}
    </form>
  );
}
