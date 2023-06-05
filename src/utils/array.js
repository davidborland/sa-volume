export const clamp = (value, min, max) => Math.max(min, Math.min(value, max));
export const combineArrays = (a1, a2) => a1?.length && a2?.length ? [...a1, ...a2] : a2?.length ? a2 : a1;
