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

  // Strict GitHub username validation:
  // - 1 to 39 chars
  // - alphanumeric or single hyphens between alphanumerics
  // - no leading/trailing hyphen, no consecutive hyphens
  const githubUsernamePattern = /^(?=.{1,39}$)(?!.*--)[a-zA-Z0-9]+(?:-[a-zA-Z0-9]+)*$/;
  if (!githubUsernamePattern.test(username)) {
    return null;
  }
  
  return username || null;
};
