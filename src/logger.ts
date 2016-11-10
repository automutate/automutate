import { IMutation } from "./mutation";
import { IMutationsWave } from "./mutationsProvider";

/**
 * Generates output messages for significant operations.
 */
export interface ILogger {
    /**
     * Logs that an unknown mutator was requested.
     * 
     * @param mutation   The requesting mutation of unknown type.
     */
    onUnknownMutationType(mutation: IMutation): void;

    /**
     * Logs that a muations wave is about to start.
     * 
     * @param mutationsWave   A wave of file mutations.
     */
    onWaveBegin(mutationsWave: IMutationsWave): void;

    /**
     * Logs that a muations wave finished.
     * 
     * @param mutationsWave   A wave of file mutations.
     */
    onWaveEnd(mutationsWave: IMutationsWave): void;
}
