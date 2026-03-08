"use client";

import { useState } from "react";
import { brand } from "@/lib/brand";
import HeroBackground from "@/components/HeroBackground";
import {
  UserGroupIcon,
  UserIcon,
  CheckCircleIcon,
} from "@heroicons/react/24/outline";

type RegistrationType = "team" | "freeagent";

interface TeamFormData {
  teamName: string;
  managerName: string;
  managerEmail: string;
  managerPhone: string;
  playerCount: string;
  division: string;
  notes: string;
}

interface FreeAgentFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  position: string;
  experience: string;
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

const experienceLevels = [
  "Beginner (0-2 years)",
  "Intermediate (3-5 years)",
  "Advanced (6-10 years)",
  "Expert (10+ years)",
];

export default function RegisterPage() {
  const [type, setType] = useState<RegistrationType>("team");
  const [submitted, setSubmitted] = useState(false);

  const [teamData, setTeamData] = useState<TeamFormData>({
    teamName: "",
    managerName: "",
    managerEmail: "",
    managerPhone: "",
    playerCount: "",
    division: "",
    notes: "",
  });

  const [agentData, setAgentData] = useState<FreeAgentFormData>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    position: "",
    experience: "",
    notes: "",
  });

  const handleTeamSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Team registration:", teamData);
    setSubmitted(true);
  };

  const handleAgentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Free agent registration:", agentData);
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
              setTeamData({
                teamName: "",
                managerName: "",
                managerEmail: "",
                managerPhone: "",
                playerCount: "",
                division: "",
                notes: "",
              });
              setAgentData({
                firstName: "",
                lastName: "",
                email: "",
                phone: "",
                position: "",
                experience: "",
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
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-36 text-center">
          <p className="text-brand-teal font-semibold text-sm uppercase tracking-widest mb-4 animate-slide-up">
            Sign Up
          </p>
          <h1 className="text-4xl sm:text-6xl font-extrabold text-white mb-6 tracking-tight animate-slide-up-delay">
            Register for
            <span className="text-gradient-animated"> {brand.name}</span>
          </h1>
          <p className="text-lg text-gray-200 leading-relaxed max-w-2xl mx-auto animate-slide-up-delay-2">
            Register your full team or sign up as a free agent. Space is limited
            to {brand.tournament.maxTeams} teams — don&apos;t miss out!
          </p>
        </div>
      </HeroBackground>

      {/* Registration Type Toggle */}
      <section className="pb-16 sm:pb-24 bg-gradient-dark">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Toggle */}
          <div className="flex rounded-2xl bg-brand-surface/50 border border-white/5 p-1.5 mb-10">
            <button
              onClick={() => setType("team")}
              className={`flex-1 flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl text-sm font-semibold transition-all duration-200 ${
                type === "team"
                  ? "bg-gradient-brand text-white shadow-lg shadow-brand-teal/20"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              <UserGroupIcon className="w-5 h-5" />
              Team Registration
            </button>
            <button
              onClick={() => setType("freeagent")}
              className={`flex-1 flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl text-sm font-semibold transition-all duration-200 ${
                type === "freeagent"
                  ? "bg-gradient-brand text-white shadow-lg shadow-brand-teal/20"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              <UserIcon className="w-5 h-5" />
              Free Agent
            </button>
          </div>

          {/* Pricing Info */}
          <div className="mb-8 p-4 rounded-xl bg-brand-teal/5 border border-brand-teal/20 text-center">
            <p className="text-sm text-gray-300">
              {type === "team" ? (
                <>
                  Team registration fee:{" "}
                  <span className="text-brand-teal font-bold text-lg">
                    {brand.tournament.teamFee}
                  </span>
                  <span className="text-gray-500 ml-2">
                    ({brand.tournament.playersPerTeam} players per team)
                  </span>
                </>
              ) : (
                <>
                  Free agent registration fee:{" "}
                  <span className="text-brand-teal font-bold text-lg">
                    {brand.tournament.freeAgentFee}
                  </span>
                  <span className="text-gray-500 ml-2">
                    (we&apos;ll find you a team!)
                  </span>
                </>
              )}
            </p>
          </div>

          {/* Team Form */}
          {type === "team" && (
            <form
              onSubmit={handleTeamSubmit}
              className="p-6 sm:p-8 rounded-2xl bg-brand-surface/50 border border-white/5 space-y-5"
            >
              <h2 className="text-xl font-bold text-white mb-2">
                Team Registration
              </h2>
              <div>
                <label htmlFor="teamName" className={labelStyles}>
                  Team Name *
                </label>
                <input
                  type="text"
                  id="teamName"
                  required
                  value={teamData.teamName}
                  onChange={(e) =>
                    setTeamData({ ...teamData, teamName: e.target.value })
                  }
                  className={inputStyles}
                  placeholder="Your team name"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label htmlFor="managerName" className={labelStyles}>
                    Manager / Captain Name *
                  </label>
                  <input
                    type="text"
                    id="managerName"
                    required
                    value={teamData.managerName}
                    onChange={(e) =>
                      setTeamData({ ...teamData, managerName: e.target.value })
                    }
                    className={inputStyles}
                    placeholder="Full name"
                  />
                </div>
                <div>
                  <label htmlFor="playerCount" className={labelStyles}>
                    Expected # of Players *
                  </label>
                  <select
                    id="playerCount"
                    required
                    value={teamData.playerCount}
                    onChange={(e) =>
                      setTeamData({ ...teamData, playerCount: e.target.value })
                    }
                    className={selectStyles}
                  >
                    <option value="" disabled>
                      Select...
                    </option>
                    {Array.from({ length: 4 }, (_, i) => i + 12).map((n) => (
                      <option
                        key={n}
                        value={String(n)}
                        className="bg-brand-dark"
                      >
                        {n} players
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label htmlFor="managerEmail" className={labelStyles}>
                    Email *
                  </label>
                  <input
                    type="email"
                    id="managerEmail"
                    required
                    value={teamData.managerEmail}
                    onChange={(e) =>
                      setTeamData({ ...teamData, managerEmail: e.target.value })
                    }
                    className={inputStyles}
                    placeholder="manager@email.com"
                  />
                </div>
                <div>
                  <label htmlFor="managerPhone" className={labelStyles}>
                    Phone *
                  </label>
                  <input
                    type="tel"
                    id="managerPhone"
                    required
                    value={teamData.managerPhone}
                    onChange={(e) =>
                      setTeamData({ ...teamData, managerPhone: e.target.value })
                    }
                    className={inputStyles}
                    placeholder="(555) 123-4567"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="teamNotes" className={labelStyles}>
                  Additional Notes
                </label>
                <textarea
                  id="teamNotes"
                  rows={3}
                  value={teamData.notes}
                  onChange={(e) =>
                    setTeamData({ ...teamData, notes: e.target.value })
                  }
                  className={`${inputStyles} resize-none`}
                  placeholder="Anything else we should know?"
                />
              </div>
              <button
                type="submit"
                className="w-full inline-flex items-center justify-center px-8 py-4 text-base font-semibold text-white bg-gradient-brand rounded-xl shadow-lg shadow-brand-teal/25 hover:shadow-brand-teal/40 hover:scale-[1.02] transition-all duration-300"
              >
                Submit Team Registration
              </button>
            </form>
          )}

          {/* Free Agent Form */}
          {type === "freeagent" && (
            <form
              onSubmit={handleAgentSubmit}
              className="p-6 sm:p-8 rounded-2xl bg-brand-surface/50 border border-white/5 space-y-5"
            >
              <h2 className="text-xl font-bold text-white mb-2">
                Free Agent Sign-Up
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
                    value={agentData.firstName}
                    onChange={(e) =>
                      setAgentData({ ...agentData, firstName: e.target.value })
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
                    value={agentData.lastName}
                    onChange={(e) =>
                      setAgentData({ ...agentData, lastName: e.target.value })
                    }
                    className={inputStyles}
                    placeholder="Last name"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label htmlFor="agentEmail" className={labelStyles}>
                    Email *
                  </label>
                  <input
                    type="email"
                    id="agentEmail"
                    required
                    value={agentData.email}
                    onChange={(e) =>
                      setAgentData({ ...agentData, email: e.target.value })
                    }
                    className={inputStyles}
                    placeholder="you@email.com"
                  />
                </div>
                <div>
                  <label htmlFor="agentPhone" className={labelStyles}>
                    Phone *
                  </label>
                  <input
                    type="tel"
                    id="agentPhone"
                    required
                    value={agentData.phone}
                    onChange={(e) =>
                      setAgentData({ ...agentData, phone: e.target.value })
                    }
                    className={inputStyles}
                    placeholder="(555) 123-4567"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label htmlFor="position" className={labelStyles}>
                    Primary Position *
                  </label>
                  <select
                    id="position"
                    required
                    value={agentData.position}
                    onChange={(e) =>
                      setAgentData({ ...agentData, position: e.target.value })
                    }
                    className={selectStyles}
                  >
                    <option value="" disabled>
                      Select position...
                    </option>
                    {positions.map((pos) => (
                      <option key={pos} value={pos} className="bg-brand-dark">
                        {pos}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="experience" className={labelStyles}>
                    Experience Level *
                  </label>
                  <select
                    id="experience"
                    required
                    value={agentData.experience}
                    onChange={(e) =>
                      setAgentData({
                        ...agentData,
                        experience: e.target.value,
                      })
                    }
                    className={selectStyles}
                  >
                    <option value="" disabled>
                      Select level...
                    </option>
                    {experienceLevels.map((level) => (
                      <option
                        key={level}
                        value={level}
                        className="bg-brand-dark"
                      >
                        {level}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label htmlFor="agentNotes" className={labelStyles}>
                  Additional Notes
                </label>
                <textarea
                  id="agentNotes"
                  rows={3}
                  value={agentData.notes}
                  onChange={(e) =>
                    setAgentData({ ...agentData, notes: e.target.value })
                  }
                  className={`${inputStyles} resize-none`}
                  placeholder="Tell us about yourself — positions you can play, availability, etc."
                />
              </div>
              <button
                type="submit"
                className="w-full inline-flex items-center justify-center px-8 py-4 text-base font-semibold text-white bg-gradient-brand rounded-xl shadow-lg shadow-brand-teal/25 hover:shadow-brand-teal/40 hover:scale-[1.02] transition-all duration-300"
              >
                Submit Free Agent Registration
              </button>
            </form>
          )}
        </div>
      </section>
    </div>
  );
}
