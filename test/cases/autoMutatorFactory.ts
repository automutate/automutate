import { AutoMutator } from "../../lib/automutator";
import { Logger } from "../../lib/logger";
import { FileMutationsApplier } from "../../lib/mutationsAppliers/fileMutationsApplier";
import { IMutationsProvider } from "../../lib/mutationsProvider";

/**
 * Creates mutation providers for files.
 * 
 * @param fileName   Name of a file to mutate.
 * @param settingsFileName   Name of its settings file, if any.
 * @returns A mutation provider for the file.
 */
export interface IMutationsProviderFactory {
    (fileName: string, settingsFileName?: string): IMutationsProvider;
}

/**
 * Creates AutoMutators for testing.
 */
export class AutoMutatorFactory {
    /**
     * Creates mutation providers for files.
     */
    private readonly mutationsProviderFactory: IMutationsProviderFactory;

    /**
     * Initializes a new instance of the TestAutoMutatorFactory class.
     * 
     * @param mutationsProviderFactory   Creates mutation providers for files.
     */
    public constructor(mutationsProviderFactory: IMutationsProviderFactory) {
        this.mutationsProviderFactory = mutationsProviderFactory;
    }

    /**
     * Creates an AutoMutator for testing.
     * 
     * @param fileName   Name of a .less file to automutate.
     * @param settingsFileName   Name of its settings file, if any.
     * @returns A new AutoMutator for testing.
     */
    public create(fileName: string, settingsFileName?: string) {
        const logger = new Logger();

        return new AutoMutator(
            new FileMutationsApplier(logger),
            this.mutationsProviderFactory(fileName, settingsFileName),
            logger);
    }
}
