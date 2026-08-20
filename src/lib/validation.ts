export function validateEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function validatePassword(password: string): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];
  if (password.length < 8) errors.push('At least 8 characters required');
  if (!/[A-Z]/.test(password)) errors.push('At least one uppercase letter required');
  if (!/[a-z]/.test(password)) errors.push('At least one lowercase letter required');
  if (!/[0-9]/.test(password)) errors.push('At least one number required');
  return { valid: errors.length === 0, errors };
}

export function validateEventForm(data: {
  title: string;
  description: string;
  location: string;
  start_time: string;
  end_time: string;
}): { valid: boolean; errors: Record<string, string> } {
  const errors: Record<string, string> = {};

  if (!data.title.trim()) errors.title = 'Title is required';
  else if (data.title.length < 3) errors.title = 'Title must be at least 3 characters';
  else if (data.title.length > 200) errors.title = 'Title must be less than 200 characters';

  if (!data.description.trim()) errors.description = 'Description is required';
  else if (data.description.length < 10) errors.description = 'Description must be at least 10 characters';

  if (!data.location.trim()) errors.location = 'Location is required';

  if (!data.start_time) errors.start_time = 'Start time is required';
  else if (new Date(data.start_time) < new Date()) errors.start_time = 'Start time must be in the future';

  if (!data.end_time) errors.end_time = 'End time is required';
  else if (new Date(data.end_time) <= new Date(data.start_time))
    errors.end_time = 'End time must be after start time';

  return { valid: Object.keys(errors).length === 0, errors };
}
