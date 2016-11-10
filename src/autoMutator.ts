import { ILogger } from "./logger";
import { IMutationsApplier } from "./mutationsApplier";
import { IMutationsProvider, IMutationsWave } from "./mutationsProvider";

/**
 * Runs waves of file mutations.
 */
export interface IAutoMutator {
    /**
     * Runs waves of file mutations.
     * 
     * @returns A Promise for the waves completing.
     */
    run(): Promise<void>;
}

/**
 * Runs waves of file mutations.
 */
export class AutoMutator implements IAutoMutator {
    /**
     * Applies individual waves of file mutations.
     */
    private mutationsApplier: IMutationsApplier;

    /**
     * Provides waves of file mutations.
     */
    private mutationsProvider: IMutationsProvider;

    /**
     * Generates output messages for significant operations.
     */
    private logger: ILogger;

    /**
     * Initializes a new instance of the AutoMutator class.
     * 
     * @param mutationsApplier   Applies individual waves of file mutations.
     * @param mutationsProvider   Provides waves of file mutations.
     */
    constructor(mutationsApplier: IMutationsApplier, mutationsProvider: IMutationsProvider, logger: ILogger) {
        this.mutationsApplier = mutationsApplier;
        this.mutationsProvider = mutationsProvider;
        this.logger = logger;
    }

    /**
     * Runs waves of file mutations.
     * 
     * @returns A Promise for the waves completing.
     */
    public async run(): Promise<void> {
        while (true) {
            const mutationsWave: IMutationsWave = await this.mutationsProvider.provide();
            if (!mutationsWave.fileMutations) {
                break;
            }

            this.logger.onWaveBegin(mutationsWave);
            this.mutationsApplier.apply(mutationsWave.fileMutations);
            this.logger.onWaveEnd(mutationsWave);
        }
    }
}
