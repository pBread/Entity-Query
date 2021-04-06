// Same as Java's hashCode()
export function hashCode(...args: any[]): number {
  const json = JSON.stringify(args);

  for (var i = 0, hashed = 0; i < json.length; i++)
    hashed = (Math.imul(31, hashed) + json.charCodeAt(i)) | 0;

  return hashed;
}
