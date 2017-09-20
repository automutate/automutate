import { IMutation } from "../mutation";
import { Mutator } from "../mutator";
import { IMutatorFactory } from "../mutatorFactory";

/**
 * Multiple mutations to be applied together.
 */
export interface IMultipleMutations extends IMutation {
    /**
     * Mutations to be applied together.
     */
    mutations: IMutation[];

    /**
     * Unique type name identifying multiple mutations.
     */
    type: "multiple";
}

/**
 * Applies multiple mutations to a file.
 */
export class MultipleMutator extends Mutator {
    /**
     * Applies a mutation.
     *
     * @param fileContents   Current contents of the file.
     * @param mutation   Mutation to apply.
     * @returns File contents after applying the mutation.
     */
    public mutate(fileContents: string, mutation: IMultipleMutations, mutatorFactory: IMutatorFactory): string {
        for (const childMutation of mutation.mutations) {
            fileContents = mutatorFactory.generateAndApply(fileContents, childMutation);
        }

        return fileContents;
    }
}
