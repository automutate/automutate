import { ILogger } from "../logger";
import { IMutation } from "../mutation";
import { IMutationsWave } from "../mutationsProvider";

/**
 * Generates console logs for significant operations.
 */
export class ConsoleLogger implements ILogger {
    /**
     * Logs that an unknown mutator was requested.
     * 
     * @param mutation   The requesting mutation of unknown type.
     */
    public onUnknownMutationType(mutation: IMutation): void {
        console.error(`Unknown mutator type: '${mutation.type}'`);
    }

    /**
     * Logs that a muations wave is about to start.
     * 
     * @param mutationsWave   A wave of file mutations.
     */
    public onWaveBegin(mutationsWave: IMutationsWave): void {
        console.log(`Applying ${mutationsWave.descriptor}.`);
    }

    /**
     * Logs that a muations wave finished.
     * 
     * @param mutationsWave   A wave of file mutations.
     */
    public onWaveEnd(mutationsWave: IMutationsWave): void {
        console.log(`Applied ${mutationsWave.descriptor}...`);
    }
}