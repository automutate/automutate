import { Logger } from "./types/logger";
import { ConsoleLogger } from "./loggers/consoleLogger";
import { MutationsApplier } from "./types/mutationsApplier";
import { FileMutationsApplier } from "./mutationsAppliers/fileMutationsApplier";
import { MutationsProvider } from "./mutationsProvider";

/**
 * Settings to run waves of mutations.
 */
export interface MutationRunSettings {
  /**
   * Generates output messages for significant operations.
   */
  logger?: Logger;

  /**
   * Applies individual waves of file mutations.
   */
  mutationsApplier?: MutationsApplier;

  /**
   * Provides waves of file mutations.
   */
  mutationsProvider: MutationsProvider;

  /**
   * Settings controlling how many waves to run.
   */
  waves?: WavesSettings;
}

export interface WavesSettings {
  /**
   * Maximum number of waves to run, if not infinite.
   */
  maximum?: number;

  /**
   * Minimum number of waves to run, if not 0.
   */
  minimum?: number;
}

/**
 * Reported results from running waves of mutations.
 */
export interface MutationRunResults {
  /**
   * Names of all files that were mutated at least once.
   */
  mutatedFileNames: string[];
}

/**
 * Runs waves of mutations.
 *
 * @param settings   Settings to run waves of mutations.
 */
export const runMutations = async (
  settings: MutationRunSettings
): Promise<MutationRunResults> => {
  const logger = settings.logger ?? new ConsoleLogger();
  const mutatedFileNames = new Set<string>();
  const mutationsApplier =
    settings.mutationsApplier ?? new FileMutationsApplier({ logger });
  const { maximum = Infinity, minimum = 0 } = settings.waves ?? {};

  for (let i = 0; i < maximum; i += 1) {
    const mutationsWave = await settings.mutationsProvider.provide();
    if (mutationsWave.fileMutations === undefined) {
      if (i < minimum) {
        continue;
      }

      break;
    }

    logger.onWaveBegin(mutationsWave);
    await mutationsApplier.apply(mutationsWave.fileMutations);
    logger.onWaveEnd(mutationsWave);

    for (const fileName of Object.keys(mutationsWave.fileMutations)) {
      mutatedFileNames.add(fileName);
    }
  }

  return {
    mutatedFileNames: Array.from(mutatedFileNames),
  };
};
