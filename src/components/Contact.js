"use client";

import { useRef, useState } from "react";
import emailjs from "@emailjs/browser";
import { Github, Linkedin, Mail, MessageSquare, Send } from "./ui/Icons";

import Section, { SectionHeader } from "./ui/Section";
import Button from "./ui/Button";
import { useContact } from "@/lib/content-context";
import styles from "./Contact.module.css";
import { cn } from "@/lib/utils";

function validUrl(value) {
  if (!value || typeof value !== "string") return false;

  try {
    const url = new URL(value);
    return url.protocol === "https:" || url.protocol === "http:";
  } catch {
    return false;
  }
}

export default function Contact() {
  const contact = useContact();
  const formRef = useRef(null);

  const [status, setStatus] = useState(null);
  const [sending, setSending] = useState(false);

  const email =
    contact?.email && contact.email !== "your.email@example.com"
      ? contact.email
      : "";

  const socialLinks = [
    {
      name: "GitHub",
      url: contact?.github || contact?.social?.github,
      icon: <Github size={22} />,
    },
    {
      name: "LinkedIn",
      url: contact?.linkedin || contact?.social?.linkedin,
      icon: <Linkedin size={22} />,
    },
    {
      name: "Instagram",
      url: contact?.instagram || contact?.social?.instagram,
      icon: (
        <span className={styles.socialTextIcon} aria-hidden="true">
          ◎
        </span>
      ),
    },
    {
      name: "Facebook",
      url: contact?.facebook || contact?.social?.facebook,
      icon: (
        <span className={styles.socialTextIcon} aria-hidden="true">
          f
        </span>
      ),
    },
  ].filter((item) => validUrl(item.url));

  const whatsapp =
    validUrl(contact?.whatsapp) &&
    !contact.whatsapp.toLowerCase().includes("yournumber")
      ? contact.whatsapp
      : "";

  async function handleSubmit(e) {
    e.preventDefault();

    if (!formRef.current || sending) return;

    const serviceId = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID;
    const templateId = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID;
    const publicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY;

    if (!serviceId || !templateId || !publicKey) {
      setStatus("configuration");
      return;
    }

    const form = formRef.current;

    const name = form.elements.namedItem("name").value.trim();
    const senderEmail = form.elements.namedItem("email").value.trim();
    const subject = form.elements.namedItem("subject").value.trim();
    const message = form.elements.namedItem("message").value.trim();

    if (!name || !senderEmail || !subject || message.length < 10) {
      setStatus("error");
      return;
    }

    setSending(true);
    setStatus(null);

    try {
      const response = await emailjs.send(
        serviceId,
        templateId,
        {
          from_name: name,
          from_email: senderEmail,
          subject,
          message,
        },
        publicKey,
      );

      if (response.status !== 200) {
        throw new Error("Message delivery failed");
      }

      setStatus("success");
      form.reset();
    } catch (error) {
      console.error("Contact form error:", error);
      setStatus("error");
    } finally {
      setSending(false);
    }
  }

  return (
    <Section id="contact">
      <SectionHeader>
        <h2>Let&#39;s Build Something Together</h2>
      </SectionHeader>

      <p className={styles.intro}>
        I&#39;m open to Semester 4 internship opportunities, full-stack
        development projects, and connecting with people who enjoy building
        useful digital products. Have an opportunity or an idea? I&#39;d love to
        hear from you.
      </p>

      <div className={styles.columns}>
        <form ref={formRef} className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.formHeading}>
            <h3>Send me a message</h3>
            <p>I&#39;ll get back to you as soon as I can.</p>
          </div>

          <div className={styles.inputRow}>
            <div className={styles.field}>
              <label className={styles.label} htmlFor="contact-name">
                Your Name
              </label>
              <input
                className={styles.input}
                id="contact-name"
                name="name"
                type="text"
                autoComplete="name"
                required
                maxLength={100}
                placeholder="Enter your name"
              />
            </div>

            <div className={styles.field}>
              <label className={styles.label} htmlFor="contact-email">
                Email Address
              </label>
              <input
                className={styles.input}
                id="contact-email"
                name="email"
                type="email"
                autoComplete="email"
                required
                maxLength={150}
                placeholder="you@example.com"
              />
            </div>
          </div>

          <div className={styles.field}>
            <label className={styles.label} htmlFor="contact-subject">
              Subject
            </label>
            <input
              className={styles.input}
              id="contact-subject"
              name="subject"
              type="text"
              required
              maxLength={150}
              placeholder="Internship opportunity, collaboration..."
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label} htmlFor="contact-message">
              Message
            </label>
            <textarea
              className={styles.textarea}
              id="contact-message"
              name="message"
              required
              minLength={10}
              maxLength={3000}
              rows={5}
              placeholder="Tell me a little about your opportunity or idea..."
            />
          </div>

          <Button
            variant="brand"
            type="submit"
            disabled={sending}
            icon={sending ? null : Send}
          >
            {sending ? "Sending..." : "Send Message"}
          </Button>

          <div className={styles.feedback} aria-live="polite">
            {status === "success" && (
              <p className={cn(styles.status, styles.success)}>
                Message sent successfully! Thank you for reaching out.
              </p>
            )}

            {status === "error" && (
              <p className={cn(styles.status, styles.error)}>
                Your message could not be sent. Please try again or contact me
                directly by email.
              </p>
            )}

            {status === "configuration" && (
              <p className={cn(styles.status, styles.error)}>
                The contact form is not configured yet. Please contact me
                directly using the email link.
              </p>
            )}
          </div>
        </form>

        <div className={styles.rightColumn}>
          <div className={styles.card}>
            <div className={styles.cardIcon}>
              <Mail size={22} />
            </div>

            <p className={styles.cardTitle}>Get in Touch</p>

            <p className={styles.cardDescription}>
              Feel free to reach out about internships, projects, or development
              opportunities.
            </p>

            <div className={styles.quickLinks}>
              {email && (
                <a href={`mailto:${email}`} className={styles.quickLink}>
                  <Mail />
                  <span>{email}</span>
                </a>
              )}

              {whatsapp && (
                <a
                  href={whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.quickLink}
                >
                  <MessageSquare />
                  <span>Chat on WhatsApp</span>
                </a>
              )}
            </div>
          </div>

          <div className={styles.card}>
            <p className={styles.cardTitle}>Find Me Online</p>

            <p className={styles.cardDescription}>
              Explore my projects and connect with me professionally.
            </p>

            <div className={styles.social}>
              {socialLinks.map((item) => (
                <a
                  key={item.name}
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  title={item.name}
                  aria-label={`Visit my ${item.name} profile`}
                >
                  {item.icon}
                  <span>{item.name}</span>
                </a>
              ))}
            </div>
          </div>

          <div className={styles.availability}>
            <span className={styles.availabilityDot} />
            <span>Open to internship opportunities</span>
          </div>

          <div className={styles.availability}>
            <span className={styles.availabilityDot} />
            <span>Available for Freelancer work</span>
          </div>
        </div>
      </div>
    </Section>
  );
}
