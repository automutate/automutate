import { AutoMutator } from "../../lib/automutator";
import { Logger } from "../../lib/logger";
import { FileMutationsApplier } from "../../lib/mutationsAppliers/fileMutationsApplier";
import { IMutationsProvider } from "../../lib/mutationsProvider";

/**
 * Creates mutation providers for files.
 * 
 * @param fileName   Name of a file to mutate.
 * @returns A mutation provider for the file.
 */
export interface IMutationsProviderFactory {
    (fileName: string): IMutationsProvider;
}

/**
 * Generates AutoMutator instances for testing.
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
     * @param Name of a .less file to automutate.
     * @returns A new AutoMutator for testing.
     */
    public create(fileName: string) {
        const logger = new Logger();

        return new AutoMutator(
            new FileMutationsApplier(logger),
            this.mutationsProviderFactory(fileName),
            logger);
    }
}
