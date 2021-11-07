/**
 * Transforms a dashed-case name to camelCase.
 *
 * @param name   A dashed-case name.
 * @returns The name as camelCase.
 */
export const toCamelCase = (name: string): string => {
  const split: string[] = name.split("-");

  return (
    split[0].toLowerCase() +
    split
      .slice(1)
      .map(
        (part: string) =>
          part.substring(0, 1).toUpperCase() + part.substring(1).toLowerCase()
      )
      .join("")
  );
};

/**
 * Transforms a dashed-case name to PascalCase.
 *
 * @param name   A dashed-case name.
 * @returns The name as PascalCase.
 */
export const toPascalCase = (name: string): string => {
  return name
    .split("-")
    .map(
      (part: string) =>
        part.substring(0, 1).toUpperCase() + part.substring(1).toLowerCase()
    )
    .join("");
};
