import { IMutation } from "./mutation";
import { IFileMutations, IMutationsWave } from "./mutationsProvider";

/**
 * Generates output messages for significant operations.
 */
export interface ILogger {
    /**
     * Logs that mutations have completed.
     */
    onComplete(): void;

    /**
     * Logs that a mutation was applied.
     *
     * @param fileName   Name of the file to be mutated.
     * @param mutation   The requesting mutation.
     */
    onMutation(fileName: string, mutation: IMutation): void;

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

/**
 * Default no-op class to generate output messages for significant operations.
 */
export class Logger implements ILogger {
    /**
     * Mutations applied to each file, keyed by file name.
     */
    private readonly fileMutations: IFileMutations = {};

    /**
     * Waves of file mutations.
     */
    private readonly mutationsWaves: IMutationsWave[] = [];

    /**
     * Logs that mutations have completed.
     */
    public onComplete(): void {/* ... */}

    /**
     * Logs that a mutation was applied.
     *
     * @param fileName   Name of the file to be mutated.
     * @param mutation   The requesting mutation.
     */
    public onMutation(fileName: string, mutation: IMutation): void {
        if (this.fileMutations[fileName]) {
            this.fileMutations[fileName].push(mutation);
        } else {
            this.fileMutations[fileName] = [mutation];
        }
    }

    /**
     * Logs that an unknown mutator was requested.
     *
     * @param _mutation   The requesting mutation.
     */
    public onUnknownMutationType(_mutation: IMutation): void {/* ... */}

    /**
     * Logs that a muations wave is about to start.
     *
     * @param mutationsWave   A wave of file mutations.
     */
    public onWaveBegin(mutationsWave: IMutationsWave): void {
        this.mutationsWaves.push(mutationsWave);
    }

    /**
     * Logs that a muations wave finished.
     *
     * @param _mutationsWave   A wave of file mutations.
     */
    public onWaveEnd(_mutationsWave: IMutationsWave): void {/* ... */}

    /**
     * Gets file mutations for each file.
     *
     * @returns Mutations applied to each file, keyed by file name.
     */
    protected getFileMutations(): IFileMutations {
        return this.fileMutations;
    }

    /**
     * Gets waves of file mutations.
     *
     * @returns Waves of file mutations.
     */
    protected getMutationsWaves(): IMutationsWave[] {
        return this.mutationsWaves;
    }
}
