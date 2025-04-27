/**
 * Deep merge two objects.
 * @param target The target object to merge into
 * @param source The source object to merge from
 * @returns A new merged object
 */
export function deepMerge<T extends Record<string, any>>(target: T, source: Partial<T>): T {
  const output = { ...target } as T;
  
  if (!source) {
    return output;
  }

  Object.keys(source).forEach(key => {
    const targetValue = output[key as keyof T];
    const sourceValue = source[key as keyof T];

    if (
      targetValue && 
      sourceValue && 
      typeof targetValue === 'object' && 
      typeof sourceValue === 'object' &&
      !Array.isArray(targetValue) && 
      !Array.isArray(sourceValue)
    ) {
      output[key as keyof T] = deepMerge(targetValue, sourceValue) as any;
    } else if (sourceValue !== undefined) {
      output[key as keyof T] = sourceValue as any;
    }
  });

  return output;
} 