import { IMutation } from "./mutation";
import { IMutator } from "./mutator";
import { IMutatorSearcher, IMutatorClass } from "./mutatorSearcher";

/**
 * Mutator sub-classes, keyed by dashed-case name.
 */
interface IMutatorClasses {
    [i: string]: IMutatorClass<IMutator<IMutation>>;
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
    generate<TMutator extends IMutator<TMutation>, TMutation extends IMutation>(name: string): TMutator | undefined;
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
     * Initializes a new instance of the MutatorFactory class.
     * 
     * @param searcher   Searches for mutator classes.
     */
    public constructor(searcher: IMutatorSearcher) {
        this.searcher = searcher;
    }

    /**
     * Attempts to find and instantiate a mutator sub-class.
     * 
     * @param name   Dashed-case name of the mutator sub-class.
     * @returns An instance of the mutator sub-class, if the sub-class can be found.
     */
    public generate<TMutator extends IMutator<TMutation>, TMutation extends IMutation>(name: string): TMutator | undefined {
        if (!this.classes[name]) {
            const mutatorClass: IMutatorClass<TMutator> | undefined = this.searcher.search<TMutator>(name);
            if (!mutatorClass) {
                return undefined;
            }

            this.classes[name] = mutatorClass;
        }

        return new this.classes[name]() as TMutator;
    }
}
