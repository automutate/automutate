import { IMutation } from "./mutation";

/**
 * Applies a type of mutation to a file.
 */
export interface IMutator<TMutation extends IMutation> {
    /**
     * Applies a mutation.
     * 
     * @param fileContents   Current contents of the file.
     * @param mutation   Mutation to apply.
     * @returns File contents after applying the mutation.
     */
    mutate(fileContents: string, mutation: TMutation): string;
}

/**
 * Applies a type of mutation to a file.
 */
export abstract class Mutator<TMutation extends IMutation> implements IMutator<TMutation> {
    /**
     * Applies a mutation.
     * 
     * @param fileContents   Current contents of the file.
     * @param mutation   Mutation to apply.
     * @returns File contents after applying the mutation.
     */
    public abstract mutate(fileContents: string, mutation: TMutation): string;
}
