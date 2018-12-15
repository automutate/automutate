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
 * Runs waves of mutations.
 *
 * @param settings   Settings to run waves of mutations.
 */
export const runMutations = async (settings: IAutoMutatorSettings): Promise<void> => {
    const logger = settings.logger || new ConsoleLogger();
    const mutationsApplier = settings.mutationsApplier || new FileMutationsApplier({
        logger,
    });

    while (true) {
        const mutationsWave: IMutationsWave = await settings.mutationsProvider.provide();
        if (!mutationsWave.fileMutations) {
            break;
        }

        logger.onWaveBegin(mutationsWave);
        await mutationsApplier.apply(mutationsWave.fileMutations);
        logger.onWaveEnd(mutationsWave);
    }
};
