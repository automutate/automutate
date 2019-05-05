import { IAutoMutatorSettings } from "./autoMutator";
import { ILogger } from "./logger";
import { ConsoleLogger } from "./loggers/consoleLogger";
import { IMutationsApplier } from "./mutationsApplier";
import { FileMutationsApplier } from "./mutationsAppliers/fileMutationsApplier";
import { IMutationsProvider, IMutationsWave } from "./mutationsProvider";

/**
 * Settings to run waves of mutations.
 */
export interface IMutationRunSettings {
    /**
     * Generates output messages for significant operations.
     */
    logger?: ILogger;

    /**
     * Applies individual waves of file mutations.
     */
    mutationsApplier?: IMutationsApplier;

    /**
     * Provides waves of file mutations.
     */
    mutationsProvider: IMutationsProvider;
}

/**
 * Reported results from running waves of mutations.
 */
export interface IMutationRunResults {
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
export const runMutations = async (settings: IAutoMutatorSettings): Promise<IMutationRunResults> => {
    const logger = settings.logger || new ConsoleLogger();
    const mutatedFileNames = new Set<string>();
    const mutationsApplier = settings.mutationsApplier || new FileMutationsApplier({ logger });

    while (true) {
        const mutationsWave: IMutationsWave = await settings.mutationsProvider.provide();
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
