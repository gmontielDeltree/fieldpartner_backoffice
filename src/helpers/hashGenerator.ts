export const generateHash = (text: string): string => {
  let hash = 0;
  for (let i = 0; i < text.length; i++) {
    const char = text.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  // Generate a longer hash for more variety
  const extendedHash = Math.abs(hash).toString(16).padStart(8, '0');
  return extendedHash;
};