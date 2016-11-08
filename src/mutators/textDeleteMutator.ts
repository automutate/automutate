import { IMutation } from "../mutation";
import { Mutator } from "../mutator";

/**
 * Description of deleting a part of a file.
 */
export interface ITextDeleteMutation extends IMutation { }

/**
 * Applies text deletion mutations to a file.
 */
export class TextDeleteMutator extends Mutator<ITextDeleteMutation> {
    /**
     * Applies a mutation.
     * 
     * @param fileContents   Current contents of the file.
     * @param mutation   Mutation to apply.
     * @returns File contents after applying the mutation.
     */
    public mutate(fileContents: string, mutation: ITextDeleteMutation): string {
        return [
            fileContents.substring(0, mutation.range[0]),
            fileContents.substring(mutation.range[1])
        ].join("");
    }
}
