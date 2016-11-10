import { IMutation } from "./mutation";
import { IMutatorFactory } from "./mutatorFactory";

/**
 * Applies a type of mutation to a file.
 */
export interface IMutator {
    /**
     * Applies a mutation.
     * 
     * @param fileContents   Current contents of the file.
     * @param mutation   Mutation to apply.
     * @param mutatorFactory   Creates mutators for mutations.
     * @returns File contents after applying the mutation.
     */
    mutate(fileContents: string, mutation: IMutation, mutatorFactory: IMutatorFactory): string;
}

/**
 * Applies a type of mutation to a file.
 */
export abstract class Mutator implements IMutator {
    /**
     * Applies a mutation.
     * 
     * @param fileContents   Current contents of the file.
     * @param mutation   Mutation to apply.
     * @param mutatorFactory   Creates mutators for mutations.
     * @returns File contents after applying the mutation.
     */
    public abstract mutate(fileContents: string, mutation: IMutation, mutatorFactory: IMutatorFactory): string;
}
