/* Brand constants for Diamond Showdown */

export const brand = {
  name: "Diamond Showdown",
  tagline: "Step Up to the Plate. Claim the Diamond.",
  year: 2026,

  colors: {
    primary: "#0ED3CF",
    primaryDark: "#099E9B",
    primaryLight: "#5EEAE6",
    background: "#0F0F1A",
    surface: "#16162A",
    charcoal: "#2D2D3D",
    white: "#FFFFFF",
    textMuted: "#94A3B8",
    textLight: "#CBD5E1",
  },

  fonts: {
    heading: "Geist Sans",
    body: "Geist Sans",
  },

  social: {
    facebook: "https://www.facebook.com/profile.php?id=61575130084541",
    instagram: "https://www.instagram.com/diamond_showdown1",
    twitter: "https://twitter.com/diamondshowdown",
    email: "info@diamondshowdown.com",
  },

  tournament: {
    date: "June 20-22, 2026",
    location: "TBD",
    teamFee: "$350",
    freeAgentFee: "$50",
    maxTeams: 16,
    playersPerTeam: "12-15",
    format: "Double Elimination",
  },
} as const;
