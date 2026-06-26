export const extractUsername = (input) => {
  if (!input) return null;
  
  let username = input.trim();
  
  // Remove trailing slashes
  if (username.endsWith('/')) {
    username = username.slice(0, -1);
  }
  
  // Handle URLs
  if (username.includes('github.com/')) {
    const parts = username.split('github.com/');
    if (parts.length > 1) {
      username = parts[1].split('/')[0];
    }
  }
  
  // Handle @username
  if (username.startsWith('@')) {
    username = username.substring(1);
  }
  
  return username || null;
};
