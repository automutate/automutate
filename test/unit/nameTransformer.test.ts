import { toCamelCase, toPascalCase } from "../../src/nameTransformer";

describe("toCamelCase", () => {
  it("doesn't change a single word", () => {
    // Arrange
    const name = "aaa";

    // Act
    const transformed = toCamelCase(name);

    // Assert
    expect(transformed).toBe("aaa");
  });

  it("combines two words", () => {
    // Arrange
    const name = "aaa-bbb";

    // Act
    const transformed = toCamelCase(name);

    // Assert
    expect(transformed).toBe("aaaBbb");
  });

  it("combines three words", () => {
    // Arrange
    const name = "aaa-bbb-ccc";

    // Act
    const transformed = toCamelCase(name);

    // Assert
    expect(transformed).toBe("aaaBbbCcc");
  });

  it("ignores casing", () => {
    // Arrange
    const name = "AaA-bBb-CCC-ddd";

    // Act
    const transformed = toCamelCase(name);

    // Assert
    expect(transformed).toBe("aaaBbbCccDdd");
  });
});

describe("toPascalCase", () => {
  it("changes a single word", () => {
    // Arrange
    const name = "aaa";

    // Act
    const transformed = toPascalCase(name);

    // Assert
    expect(transformed).toBe("Aaa");
  });

  it("combines two words", () => {
    // Arrange
    const name = "aaa-bbb";

    // Act
    const transformed = toPascalCase(name);

    // Assert
    expect(transformed).toBe("AaaBbb");
  });

  it("combines three words", () => {
    // Arrange
    const name = "aaa-bbb-ccc";

    // Act
    const transformed = toPascalCase(name);

    // Assert
    expect(transformed).toBe("AaaBbbCcc");
  });

  it("ignores casing", () => {
    // Arrange
    const name = "AaA-bBb-CCC-ddd";

    // Act
    const transformed = toPascalCase(name);

    // Assert
    expect(transformed).toBe("AaaBbbCccDdd");
  });
});
