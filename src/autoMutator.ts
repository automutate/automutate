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
     * Generates output messages for significant operations.
     */
    private readonly logger: ILogger;

    /**
     * Applies individual waves of file mutations.
     */
    private readonly mutationsApplier: IMutationsApplier;

    /**
     * Provides waves of file mutations.
     */
    private readonly mutationsProvider: IMutationsProvider;

    /**
     * Initializes a new instance of the AutoMutator class.
     *
     * @param settings   Settings to be used for initialization.
     */
    public constructor(settings: IAutoMutatorSettings) {
        this.logger = settings.logger || new ConsoleLogger();
        this.mutationsApplier = settings.mutationsApplier || new FileMutationsApplier({
            logger: this.logger,
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
            // tslint:disable:no-console
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
