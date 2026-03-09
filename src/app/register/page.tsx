"use client";

import { useState } from "react";
import { brand } from "@/lib/brand";
import HeroBackground from "@/components/HeroBackground";
import { CheckCircleIcon } from "@heroicons/react/24/outline";

interface PlayerFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  position1: string;
  position2: string;
  position3: string;
  notes: string;
}

const positions = [
  "Pitcher",
  "Catcher",
  "First Base",
  "Second Base",
  "Shortstop",
  "Third Base",
  "Left Field",
  "Center Field",
  "Right Field",
  "Utility / Any",
];

export default function RegisterPage() {
  const [submitted, setSubmitted] = useState(false);

  const [playerData, setPlayerData] = useState<PlayerFormData>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    position1: "",
    position2: "",
    position3: "",
    notes: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Player registration:", playerData);
    setSubmitted(true);
  };

  const inputStyles =
    "w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-brand-teal/50 focus:ring-1 focus:ring-brand-teal/50 transition-colors";
  const labelStyles = "block text-sm font-medium text-gray-300 mb-2";
  const selectStyles =
    "w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-brand-teal/50 focus:ring-1 focus:ring-brand-teal/50 transition-colors appearance-none";

  if (submitted) {
    return (
      <div className="bg-gradient-dark min-h-[70vh] flex items-center justify-center">
        <div className="max-w-md mx-auto px-4 text-center">
          <div className="w-20 h-20 rounded-full bg-brand-teal/10 flex items-center justify-center mx-auto mb-6">
            <CheckCircleIcon className="w-10 h-10 text-brand-teal" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-4">
            Registration Received!
          </h1>
          <p className="text-gray-400 mb-8">
            Thank you for registering for {brand.name}! We&apos;ll review your
            submission and reach out via email with next steps, including
            payment details.
          </p>
          <button
            onClick={() => {
              setSubmitted(false);
              setPlayerData({
                firstName: "",
                lastName: "",
                email: "",
                phone: "",
                position1: "",
                position2: "",
                position3: "",
                notes: "",
              });
            }}
            className="inline-flex items-center justify-center px-8 py-3.5 text-base font-semibold text-white bg-gradient-brand rounded-xl shadow-lg shadow-brand-teal/25 hover:shadow-brand-teal/40 hover:scale-105 transition-all duration-300"
          >
            Register Another
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Hero */}
      <HeroBackground
        imageSrc="/Register.jpg"
        imageAlt="Softball player on the field"
        overlayOpacity="bg-black/60"
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center h-[460px] sm:h-[520px] flex flex-col items-center justify-center">
          <p className="text-brand-teal font-semibold text-sm uppercase tracking-widest mb-4 animate-slide-up">
            Sign Up
          </p>
          <h1 className="text-4xl sm:text-6xl font-extrabold text-white mb-6 tracking-tight animate-slide-up-delay">
            Register for
            <span className="text-gradient-animated"> {brand.name}</span>
          </h1>
          <p className="text-lg text-gray-200 leading-relaxed max-w-2xl mx-auto animate-slide-up-delay-2">
            Register as a player to enter the draft. Coaches will build their
            teams — all you have to do is show up and play.
          </p>
        </div>
      </HeroBackground>

      <section className="pb-16 sm:pb-24 bg-gradient-dark">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Pricing Info */}
          <div className="mb-8 p-4 rounded-xl bg-brand-teal/5 border border-brand-teal/20 text-center">
            <p className="text-sm text-gray-300">
              Player registration fee:{" "}
              <span className="text-brand-teal font-bold text-lg">
                {brand.tournament.freeAgentFee}
              </span>
              <span className="text-gray-500 ml-2">
                (you&apos;ll be drafted onto a team)
              </span>
            </p>
          </div>

          {/* Player Form */}
          <form
            onSubmit={handleSubmit}
            className="p-6 sm:p-8 rounded-2xl bg-brand-surface/50 border border-white/5 space-y-5"
          >
            <h2 className="text-xl font-bold text-white mb-2">
              Player Registration
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label htmlFor="firstName" className={labelStyles}>
                  First Name *
                </label>
                <input
                  type="text"
                  id="firstName"
                  required
                  value={playerData.firstName}
                  onChange={(e) =>
                    setPlayerData({ ...playerData, firstName: e.target.value })
                  }
                  className={inputStyles}
                  placeholder="First name"
                />
              </div>
              <div>
                <label htmlFor="lastName" className={labelStyles}>
                  Last Name *
                </label>
                <input
                  type="text"
                  id="lastName"
                  required
                  value={playerData.lastName}
                  onChange={(e) =>
                    setPlayerData({ ...playerData, lastName: e.target.value })
                  }
                  className={inputStyles}
                  placeholder="Last name"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label htmlFor="email" className={labelStyles}>
                  Email *
                </label>
                <input
                  type="email"
                  id="email"
                  required
                  value={playerData.email}
                  onChange={(e) =>
                    setPlayerData({ ...playerData, email: e.target.value })
                  }
                  className={inputStyles}
                  placeholder="you@email.com"
                />
              </div>
              <div>
                <label htmlFor="phone" className={labelStyles}>
                  Phone *
                </label>
                <input
                  type="tel"
                  id="phone"
                  required
                  value={playerData.phone}
                  onChange={(e) =>
                    setPlayerData({ ...playerData, phone: e.target.value })
                  }
                  className={inputStyles}
                  placeholder="(555) 123-4567"
                />
              </div>
            </div>

            {/* Position Preferences */}
            <div>
              <p className={labelStyles}>Position Preferences *</p>
              <p className="text-xs text-gray-500 mb-3">
                Select your top 3 positions in order of preference.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label
                    htmlFor="position1"
                    className="block text-xs font-medium text-gray-400 mb-1.5"
                  >
                    1st Choice
                  </label>
                  <select
                    id="position1"
                    required
                    value={playerData.position1}
                    onChange={(e) =>
                      setPlayerData({
                        ...playerData,
                        position1: e.target.value,
                      })
                    }
                    className={selectStyles}
                  >
                    <option value="" disabled>
                      Select...
                    </option>
                    {positions.map((pos) => (
                      <option key={pos} value={pos} className="bg-brand-dark">
                        {pos}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label
                    htmlFor="position2"
                    className="block text-xs font-medium text-gray-400 mb-1.5"
                  >
                    2nd Choice
                  </label>
                  <select
                    id="position2"
                    required
                    value={playerData.position2}
                    onChange={(e) =>
                      setPlayerData({
                        ...playerData,
                        position2: e.target.value,
                      })
                    }
                    className={selectStyles}
                  >
                    <option value="" disabled>
                      Select...
                    </option>
                    {positions.map((pos) => (
                      <option key={pos} value={pos} className="bg-brand-dark">
                        {pos}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label
                    htmlFor="position3"
                    className="block text-xs font-medium text-gray-400 mb-1.5"
                  >
                    3rd Choice
                  </label>
                  <select
                    id="position3"
                    required
                    value={playerData.position3}
                    onChange={(e) =>
                      setPlayerData({
                        ...playerData,
                        position3: e.target.value,
                      })
                    }
                    className={selectStyles}
                  >
                    <option value="" disabled>
                      Select...
                    </option>
                    {positions.map((pos) => (
                      <option key={pos} value={pos} className="bg-brand-dark">
                        {pos}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div>
              <label htmlFor="notes" className={labelStyles}>
                Additional Notes
              </label>
              <textarea
                id="notes"
                rows={3}
                value={playerData.notes}
                onChange={(e) =>
                  setPlayerData({ ...playerData, notes: e.target.value })
                }
                className={`${inputStyles} resize-none`}
                placeholder="Anything else we should know?"
              />
            </div>
            <button
              type="submit"
              className="w-full inline-flex items-center justify-center px-8 py-4 text-base font-semibold text-white bg-gradient-brand rounded-xl shadow-lg shadow-brand-teal/25 hover:shadow-brand-teal/40 hover:scale-[1.02] transition-all duration-300"
            >
              Submit Registration
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}
