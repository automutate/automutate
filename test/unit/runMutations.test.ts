import { jest } from "@jest/globals";
import { FileMutations, Mutation, MutationsWave } from "../../src";

import { NoopLogger } from "../../src/loggers/noopLogger";
import { runMutations } from "../../src/runMutations";

const apply = jest.fn(async () => {});
const provide = jest.fn<Promise<MutationsWave>, []>();
const stubLogger = new NoopLogger();

describe("runMutations", () => {
  it("returns immediately by default when no mutations are provided", async () => {
    // Act
    await runMutations({
      logger: stubLogger,
      mutationsApplier: { apply },
      mutationsProvider: { provide: async () => ({}) },
    });

    // Assert
    expect(apply).not.toHaveBeenCalled();
  });

  it("re-runs when mutations are provided", async () => {
    // Arrange
    const fileMutations: FileMutations = {
      "some-file.txt": [{ range: { begin: 0, end: 1 }, type: "text-delete" }],
    };

    provide
      .mockResolvedValueOnce({
        fileMutations,
      })
      .mockResolvedValueOnce({
        fileMutations,
      })
      .mockResolvedValue({});

    // Act
    await runMutations({
      logger: stubLogger,
      mutationsApplier: { apply },
      mutationsProvider: { provide },
    });

    // Assert
    expect(apply).toHaveBeenCalledTimes(2);
    expect(apply).toHaveBeenCalledWith(fileMutations);
  });

  it("re-runs when no mutations are provided and the minimum is not yet met", async () => {
    // Arrange
    provide.mockResolvedValue({});

    // Act
    await runMutations({
      logger: stubLogger,
      mutationsApplier: { apply },
      mutationsProvider: { provide },
      waves: { minimum: 2 },
    });

    // Assert
    expect(apply).not.toHaveBeenCalled();
    expect(provide).toHaveBeenCalledTimes(3);
  });

  it("stops running when mutations are provided and the maximum is met", async () => {
    // Arrange
    const fileMutations: FileMutations = {
      "some-file.txt": [{ range: { begin: 0, end: 1 }, type: "text-delete" }],
    };
    provide.mockResolvedValue({
      fileMutations,
    });

    // Act
    await runMutations({
      logger: stubLogger,
      mutationsApplier: { apply },
      mutationsProvider: { provide },
      waves: { maximum: 2 },
    });

    // Assert
    expect(apply).toHaveBeenCalledTimes(2);
    expect(apply).toHaveBeenCalledWith(fileMutations);
    expect(provide).toHaveBeenCalledTimes(2);
  });
});
