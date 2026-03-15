"use client";

import { useState } from "react";
import type { Metadata } from "next";
import { brand } from "@/lib/brand";
import HeroBackground from "@/components/HeroBackground";
import {
  EnvelopeIcon,
  MapPinIcon,
  PhoneIcon,
} from "@heroicons/react/24/outline";
import { Input, Textarea, Button } from "@heroui/react";

const contactInfo = [
  {
    icon: EnvelopeIcon,
    label: "Email",
    value: brand.social.email,
    href: `mailto:${brand.social.email}`,
  },
  {
    icon: PhoneIcon,
    label: "Phone",
    value: "(555) 123-4567",
    href: "tel:+15551234567",
  },
];

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: integrate with backend/email service
    console.log("Contact form submitted:", formData);
    setSubmitted(true);
    setFormData({ name: "", email: "", subject: "", message: "" });
  };

  return (
    <div>
      {/* Hero */}
      <HeroBackground
        imageSrc="/Contact.jpg"
        imageAlt="Closeup of 2nd base"
        overlayOpacity="bg-black/65"
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center h-[460px] sm:h-[520px] flex flex-col items-center justify-center">
          <p className="text-brand-teal font-semibold text-sm uppercase tracking-widest mb-4 animate-slide-up">
            Get in Touch
          </p>
          <h1 className="text-4xl sm:text-6xl font-extrabold text-white mb-6 tracking-tight animate-slide-up-delay">
            Contact
            <span className="text-gradient-animated"> Us</span>
          </h1>
          <p className="text-lg text-gray-200 leading-relaxed max-w-2xl mx-auto animate-slide-up-delay-2">
            Have questions about Diamond Showdown? We&apos;re here to help. Send
            us a message and we&apos;ll get back to you as soon as possible.
          </p>
        </div>
      </HeroBackground>

      {/* Contact Content */}
      <section className="py-16 sm:py-24 bg-gradient-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
            {/* Info Cards */}
            <div className="lg:col-span-2 space-y-6">
              {contactInfo.map((item) => (
                <div
                  key={item.label}
                  className="p-6 rounded-2xl bg-brand-surface/50 border border-white/5"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-brand-teal/10 flex items-center justify-center flex-shrink-0">
                      <item.icon className="w-6 h-6 text-brand-teal" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">{item.label}</p>
                      {item.href ? (
                        <a
                          href={item.href}
                          className="text-white font-medium hover:text-brand-teal transition-colors"
                        >
                          {item.value}
                        </a>
                      ) : (
                        <p className="text-white font-medium">{item.value}</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}

              {/* Social Links */}
              <div className="p-6 rounded-2xl bg-brand-surface/50 border border-white/5">
                <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
                  Follow Us
                </h3>
                <div className="flex items-center gap-4">
                  <a
                    href={brand.social.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-xl bg-brand-teal/10 flex items-center justify-center text-gray-400 hover:text-brand-teal hover:bg-brand-teal/20 transition-all"
                    aria-label="Facebook"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
                    </svg>
                  </a>
                  <a
                    href={brand.social.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-xl bg-brand-teal/10 flex items-center justify-center text-gray-400 hover:text-brand-teal hover:bg-brand-teal/20 transition-all"
                    aria-label="Instagram"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" />
                    </svg>
                  </a>
                  <a
                    href={brand.social.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-xl bg-brand-teal/10 flex items-center justify-center text-gray-400 hover:text-brand-teal hover:bg-brand-teal/20 transition-all"
                    aria-label="X / Twitter"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-3">
              <div className="p-6 sm:p-8 rounded-2xl bg-brand-surface/50 border border-white/5">
                <h2 className="text-2xl font-bold text-white mb-6">
                  Send Us a Message
                </h2>

                {submitted ? (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 rounded-full bg-brand-teal/10 flex items-center justify-center mx-auto mb-4">
                      <EnvelopeIcon className="w-8 h-8 text-brand-teal" />
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-2">
                      Message Sent!
                    </h3>
                    <p className="text-gray-400 mb-6">
                      Thank you for reaching out. We&apos;ll get back to you
                      soon.
                    </p>
                    <Button
                      variant="light"
                      color="primary"
                      onPress={() => setSubmitted(false)}
                    >
                      Send another message
                    </Button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <Input
                        label="Name"
                        variant="bordered"
                        isRequired
                        value={formData.name}
                        onValueChange={(val) =>
                          setFormData({ ...formData, name: val })
                        }
                        placeholder="Your name"
                      />
                      <Input
                        label="Email"
                        variant="bordered"
                        type="email"
                        isRequired
                        value={formData.email}
                        onValueChange={(val) =>
                          setFormData({ ...formData, email: val })
                        }
                        placeholder="you@email.com"
                      />
                    </div>
                    <Input
                      label="Subject"
                      variant="bordered"
                      isRequired
                      value={formData.subject}
                      onValueChange={(val) =>
                        setFormData({ ...formData, subject: val })
                      }
                      placeholder="What's this about?"
                    />
                    <Textarea
                      label="Message"
                      variant="bordered"
                      isRequired
                      minRows={5}
                      value={formData.message}
                      onValueChange={(val) =>
                        setFormData({ ...formData, message: val })
                      }
                      placeholder="Your message..."
                    />
                    <Button
                      type="submit"
                      color="primary"
                      size="lg"
                      className="font-semibold"
                    >
                      Send Message
                    </Button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
