import { IMutation } from "../mutation";
import { Mutator } from "../mutator";

/**
 * Description of swapping text sections in a file.
 */
export interface ITextSwapMutation extends IMutation {
    /**
     * Text to be inserted.
     */
    insertion: string;
}

/**
 * Applies text swap mutations to a file.
 */
export class TextSwapMutator extends Mutator<ITextSwapMutation> {
    /**
     * Applies a mutation.
     * 
     * @param fileContents   Current contents of the file.
     * @param mutation   Mutation to apply.
     * @returns File contents after applying the mutation.
     */
    public mutate(fileContents: string, mutation: ITextSwapMutation): string {
        return [
            fileContents.substring(0, mutation.range[0]),
            mutation.insertion,
            fileContents.substring(mutation.range[1])
        ].join("");
    }
}
