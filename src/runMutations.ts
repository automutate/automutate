import { AutoMutatorSettings } from "./autoMutator";
import { Logger } from "./logger";
import { ConsoleLogger } from "./loggers/consoleLogger";
import { MutationsApplier } from "./mutationsApplier";
import { FileMutationsApplier } from "./mutationsAppliers/fileMutationsApplier";
import { MutationsProvider, MutationsWave } from "./mutationsProvider";

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
  settings: AutoMutatorSettings
): Promise<MutationRunResults> => {
  const logger = settings.logger || new ConsoleLogger();
  const mutatedFileNames = new Set<string>();
  const mutationsApplier =
    settings.mutationsApplier || new FileMutationsApplier({ logger });

  while (true) {
    const mutationsWave: MutationsWave =
      await settings.mutationsProvider.provide();
    if (mutationsWave.fileMutations === undefined) {
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
