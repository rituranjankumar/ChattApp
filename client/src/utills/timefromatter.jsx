export function timeFormatter(isoString) {
  const date = new Date(isoString);
  
  // Options for date and time formatting
  const options = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    // second: '2-digit' // Uncomment if you need seconds
  };
  
  return date.toLocaleString('en-US', options);
  // Example output: "Apr 28, 2025, 10:23 AM"
}

