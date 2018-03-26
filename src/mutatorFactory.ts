import { ILogger } from "./logger";
import { IMutation } from "./mutation";
import { Mutator } from "./mutator";
import { IMutatorClass, IMutatorSearcher } from "./mutatorSearcher";

/**
 * Mutator sub-classes, keyed by dashed-case name.
 */
interface IMutatorClasses {
    [i: string]: IMutatorClass<Mutator>;
}

/**
 * Creates mutators for mutations.
 */
export interface IMutatorFactory {
    /**
     * Attempts to find and instantiate a mutator sub-class for a file.
     *
     * @param name   Dashed-case name of the mutator sub-class.
     * @param fileContents   Contents of the file.
     * @returns An instance of the mutator sub-class, if the sub-class can be found.
     */
    generate<TMutator extends Mutator>(name: string, fileContents: string): TMutator | undefined;

    /**
     * Generates and applies a mutator, if possible.
     *
     * @param fileContents   Contents of the file.
     * @param mutation   Mutation to be applied to the file.
     * @returns The mutated file contents.
     */
    generateAndApply(fileContents: string, mutation: IMutation): string;
}

/**
 * Creates mutators for mutations.
 */
export class MutatorFactory implements IMutatorFactory {
    /**
     * Mutator sub-classes, keyed by dashed-case name.
     */
    private readonly classes: IMutatorClasses = {};

    /**
     * Generates output messages for significant operations.
     */
    private readonly logger: ILogger;

    /**
     * Searches for mutator classes.
     */
    private readonly searcher: IMutatorSearcher;

    /**
     * Initializes a new instance of the MutatorFactory class.
     *
     * @param searcher   Searches for mutator classes.
     */
    public constructor(mutatorSearcher: IMutatorSearcher, logger: ILogger) {
        this.searcher = mutatorSearcher;
        this.logger = logger;
    }

    /**
     * Attempts to find and instantiate a mutator sub-class for a file.
     *
     * @param name   Dashed-case name of the mutator sub-class.
     * @param fileContents   Contents of the file.
     * @returns An instance of the mutator sub-class, if the sub-class can be found.
     */
    public generate<TMutator extends Mutator>(name: string, fileContents: string): TMutator | undefined {
        if (!this.classes[name]) {
            const mutatorClass: IMutatorClass<TMutator> | undefined = this.searcher.search<TMutator>(name);
            if (!mutatorClass) {
                return undefined;
            }

            this.classes[name] = mutatorClass;
        }

        // @todo Use some form of "implements" keyword when TypeScript supports it
        return new (this.classes[name])(fileContents) as TMutator;
    }

    /**
     * Generates and applied a mutator, if possible.
     *
     * @param fileContents   Contents of the file.
     * @param mutation   Mutation to be applied to the file.
     * @returns The mutated file contents.
     */
    public generateAndApply(fileContents: string, mutation: IMutation): string {
        const mutator: Mutator | undefined = this.generate(mutation.type, fileContents);
        if (!mutator) {
            this.logger.onUnknownMutationType(mutation);

            return fileContents;
        }

        return mutator.mutate(fileContents, mutation, this);
    }
}
