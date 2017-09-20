import { IMutation } from "./mutation";
import { IMutatorFactory } from "./mutatorFactory";

/**
 * Applies a type of mutation to a file.
 */
export abstract class Mutator {
    /**
     * Original contents of the file.
     */
    private readonly originalFileContents: string;

    /**
     * Initializes a new instance of the Mutator class.
     *
     * @param originalFileContents   Original contents of the file.
     */
    public constructor(originalFileContents: string) {
        this.originalFileContents = originalFileContents;
    }

    /**
     * Applies a mutation.
     *
     * @param fileContents   Current contents of the file.
     * @param mutation   Mutation to apply.
     * @param mutatorFactory   Creates mutators for mutations.
     * @returns File contents after applying the mutation.
     */
    public abstract mutate(fileContents: string, mutation: IMutation, mutatorFactory: IMutatorFactory): string;

    /**
     * Gets the original contents of the file.
     *
     * @returns Original contents of the file.
     */
    protected getOriginalFileContents(): string {
        return this.originalFileContents;
    }
}
