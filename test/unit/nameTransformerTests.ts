import { expect } from "chai";

import { NameTransformer } from "../../lib/nameTransformer";

describe("NameTransformer", () => {
  describe("toCamelCase", () => {
    it("doesn't change a single word", () => {
      // Arrange
      const transformer = new NameTransformer();
      const name = "aaa";

      // Act
      const transformed: string = transformer.toCamelCase(name);

      // Assert
      expect(transformed).to.be.equal("aaa");
    });

    it("combines two words", () => {
      // Arrange
      const transformer = new NameTransformer();
      const name = "aaa-bbb";

      // Act
      const transformed: string = transformer.toCamelCase(name);

      // Assert
      expect(transformed).to.be.equal("aaaBbb");
    });

    it("combines three words", () => {
      // Arrange
      const transformer = new NameTransformer();
      const name = "aaa-bbb-ccc";

      // Act
      const transformed: string = transformer.toCamelCase(name);

      // Assert
      expect(transformed).to.be.equal("aaaBbbCcc");
    });

    it("ignores casing", () => {
      // Arrange
      const transformer = new NameTransformer();
      const name = "AaA-bBb-CCC-ddd";

      // Act
      const transformed: string = transformer.toCamelCase(name);

      // Assert
      expect(transformed).to.be.equal("aaaBbbCccDdd");
    });
  });

  describe("toPascalCase", () => {
    it("changes a single word", () => {
      // Arrange
      const transformer = new NameTransformer();
      const name = "aaa";

      // Act
      const transformed: string = transformer.toPascalCase(name);

      // Assert
      expect(transformed).to.be.equal("Aaa");
    });

    it("combines two words", () => {
      // Arrange
      const transformer = new NameTransformer();
      const name = "aaa-bbb";

      // Act
      const transformed: string = transformer.toPascalCase(name);

      // Assert
      expect(transformed).to.be.equal("AaaBbb");
    });

    it("combines three words", () => {
      // Arrange
      const transformer = new NameTransformer();
      const name = "aaa-bbb-ccc";

      // Act
      const transformed: string = transformer.toPascalCase(name);

      // Assert
      expect(transformed).to.be.equal("AaaBbbCcc");
    });

    it("ignores casing", () => {
      // Arrange
      const transformer = new NameTransformer();
      const name = "AaA-bBb-CCC-ddd";

      // Act
      const transformed: string = transformer.toPascalCase(name);

      // Assert
      expect(transformed).to.be.equal("AaaBbbCccDdd");
    });
  });
});
