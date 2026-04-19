// utils/nanoid.js — tiny unique ID generator (no dependency)
export const nanoid = () =>
  Math.random().toString(36).slice(2, 10) + Date.now().toString(36)
