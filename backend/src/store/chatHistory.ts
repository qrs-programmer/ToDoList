export const chatHistoryMap: Map<
  string,
  Array<{ role: "user" | "model" | "system"; parts: [{text: string}] }>
> = new Map();

