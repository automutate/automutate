import { ILogger } from "./logger";
import { ConsoleLogger } from "./loggers/consoleLogger";
import { IMutationsApplier } from "./mutationsApplier";
import { FileMutationsApplier } from "./mutationsAppliers/fileMutationsApplier";
import { IMutationsProvider, IMutationsWave } from "./mutationsProvider";

/**
 * Settings to initialize a new IAutoMutator.
 */
export interface IAutoMutatorSettings {
    /**
     * Applies individual waves of file mutations.
     */
    mutationsApplier?: IMutationsApplier;

    /**
     * Provides waves of file mutations.
     */
    mutationsProvider: IMutationsProvider;

    /**
     * Generates output messages for significant operations.
     */
    logger?: ILogger;
}

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
    private readonly mutationsApplier: IMutationsApplier;

    /**
     * Provides waves of file mutations.
     */
    private readonly mutationsProvider: IMutationsProvider;

    /**
     * Generates output messages for significant operations.
     */
    private readonly logger: ILogger;

    /**
     * Initializes a new instance of the AutoMutator class.
     * 
     * @param settings   Settings to be used for initialization.
     */
    constructor(settings: IAutoMutatorSettings) {
        this.logger = settings.logger || new ConsoleLogger();
        this.mutationsApplier = settings.mutationsApplier || new FileMutationsApplier({
            logger: this.logger
        });
        this.mutationsProvider = settings.mutationsProvider;
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
            await this.mutationsApplier.apply(mutationsWave.fileMutations);
            this.logger.onWaveEnd(mutationsWave);
        }
    }
}
