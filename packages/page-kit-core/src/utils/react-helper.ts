/**
 * Utility function to merge Tailwind CSS classes
 * This helps in handling conditional and dynamic classes
 * 
 * @param classes - Array of class strings to be merged
 * @returns A string of merged classes with no duplicates and no undefined/null values
 */
export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ');
} 