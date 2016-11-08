import { IMutation } from "../mutation";
import { Mutator } from "../mutator";

/**
 * Description of replacing text substrings in a file.
 */
export interface ITextReplaceMutation extends IMutation {
    /**
     * String to be inserted.
     */
    replace: string;

    /**
     * String to be removed.
     */
    search: string;
}

/**
 * Applies text replace mutations to a file.
 */
export class TextReplaceMutator extends Mutator<ITextReplaceMutation> {
    /**
     * Applies a mutation.
     * 
     * @param fileContents   Current contents of the file.
     * @param mutation   Mutation to apply.
     * @returns File contents after applying the mutation.
     */
    public mutate(fileContents: string, mutation: ITextReplaceMutation): string {
        return fileContents.replace(new RegExp(mutation.search, "g"), mutation.replace);
    }
}
