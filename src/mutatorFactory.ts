import { ILogger } from "./logger";
import { IMutator } from "./mutator";
import { IMutation } from "./mutation";
import { IMutatorSearcher, IMutatorClass } from "./mutatorSearcher";

/**
 * Mutator sub-classes, keyed by dashed-case name.
 */
interface IMutatorClasses {
    [i: string]: IMutatorClass<IMutator>;
}

/**
 * Creates mutators for mutations.
 */
export interface IMutatorFactory {
    /**
     * Attempts to find and instantiate a mutator sub-class.
     * 
     * @param name   Dashed-case name of the mutator sub-class.
     * @returns An instance of the mutator sub-class, if the sub-class can be found.
     */
    generate<TMutator extends IMutator>(name: string): TMutator | undefined;

    /**
     * Generates and applied a mutator, if possible.
     * 
     * @param fileName   Name of the file.
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
     * Searches for mutator classes.
     */
    private readonly searcher: IMutatorSearcher;

    /**
     * Generates output messages for significant operations.
     */
    private readonly logger: ILogger;

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
     * Attempts to find and instantiate a mutator sub-class.
     * 
     * @param name   Dashed-case name of the mutator sub-class.
     * @returns An instance of the mutator sub-class, if the sub-class can be found.
     */
    public generate<TMutator extends IMutator>(name: string): TMutator | undefined {
        if (!this.classes[name]) {
            const mutatorClass: IMutatorClass<TMutator> | undefined = this.searcher.search<TMutator>(name);
            if (!mutatorClass) {
                return undefined;
            }

            this.classes[name] = mutatorClass;
        }

        return new this.classes[name]() as TMutator;
    }

    /**
     * Generates and applied a mutator, if possible.
     * 
     * @param fileName   Name of the file.
     * @param mutation   Mutation to be applied to the file.
     * @returns The mutated file contents.
     */
    public generateAndApply(fileContents: string, mutation: IMutation): string {
        const mutator: IMutator | undefined = this.generate(mutation.type);
        if (!mutator) {
            this.logger.onUnknownMutationType(mutation);
            return fileContents;
        }

        return mutator.mutate(fileContents, mutation, this);
    }
}
