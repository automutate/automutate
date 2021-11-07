import {
  orderMutationsFirstToLast,
  orderMutationsLastToFirst,
  orderMutationsLastToFirstWithoutOverlaps,
} from "../../src/ordering";

const createSampleMutation = (alias: string, begin: number, end?: number) => ({
  insertion: alias,
  range: { begin, end },
  type: "text-insert",
});

describe("orderMutationsFirstToLast", () => {
  it("orders mutations without end ranges", () => {
    // Arrange
    const mutations = {
      a: createSampleMutation("a", 1),
      b: createSampleMutation("b", 3),
      c: createSampleMutation("c", 2),
    };

    // Act
    const ordered = orderMutationsFirstToLast([
      mutations.a,
      mutations.b,
      mutations.c,
    ]);

    // Assert
    expect(ordered).toEqual([mutations.a, mutations.c, mutations.b]);
  });

  it("orders mutations with end ranges", () => {
    // Arrange
    const mutations = {
      a: createSampleMutation("a", 1, 3),
      b: createSampleMutation("b", 3, 1),
      c: createSampleMutation("c", 2, 2),
    };

    // Act
    const ordered = orderMutationsFirstToLast([
      mutations.a,
      mutations.b,
      mutations.c,
    ]);

    // Assert
    expect(ordered).toEqual([mutations.b, mutations.c, mutations.a]);
  });
});

describe("orderMutationsLastToFirst", () => {
  it("orders mutations without end ranges", () => {
    // Arrange
    const mutations = {
      a: createSampleMutation("a", 1),
      b: createSampleMutation("b", 3),
      c: createSampleMutation("c", 2),
    };

    // Act
    const ordered = orderMutationsLastToFirst([
      mutations.a,
      mutations.b,
      mutations.c,
    ]);

    // Assert
    expect(ordered).toEqual([mutations.b, mutations.c, mutations.a]);
  });

  it("orders mutations with end ranges", () => {
    // Arrange
    const mutations = {
      a: createSampleMutation("a", 1, 3),
      b: createSampleMutation("b", 3, 1),
      c: createSampleMutation("c", 2, 2),
    };

    // Act
    const ordered = orderMutationsLastToFirst([
      mutations.a,
      mutations.b,
      mutations.c,
    ]);

    // Assert
    expect(ordered).toEqual([mutations.a, mutations.c, mutations.b]);
  });
});

describe("orderMutationsLastToFirstWithoutOverlaps", () => {
  it("orders mutations without end ranges", () => {
    // Arrange
    const mutations = {
      a: createSampleMutation("a", 1),
      b: createSampleMutation("b", 3),
      c: createSampleMutation("c", 2),
    };

    // Act
    const ordered = orderMutationsLastToFirstWithoutOverlaps([
      mutations.a,
      mutations.b,
      mutations.c,
    ]);

    // Assert
    expect(ordered).toEqual([mutations.b, mutations.c, mutations.a]);
  });

  it("orders mutations with end ranges", () => {
    // Arrange
    const mutations = {
      a: createSampleMutation("a", 1, 3),
      b: createSampleMutation("b", 3, 1),
      c: createSampleMutation("c", 2, 2),
    };

    // Act
    const ordered = orderMutationsLastToFirstWithoutOverlaps([
      mutations.a,
      mutations.b,
      mutations.c,
    ]);

    // Assert
    expect(ordered).toEqual([mutations.a, mutations.b]);
  });
});
