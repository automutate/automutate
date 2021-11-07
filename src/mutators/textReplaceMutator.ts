import { Mutation } from "../types/mutation";
import { Mutator } from "../mutator";

/**
 * Description of replacing text substrings in a file.
 */
export interface TextReplaceMutation extends Mutation {
  /**
   * String to be inserted.
   */
  replace: string;

  /**
   * String to be removed.
   */
  search: string;

  /**
   * Unique type name identifying text replace mutations.
   */
  type: "text-replace";
}

/**
 * Applies text replace mutations to a file.
 */
export class TextReplaceMutator extends Mutator {
  /**
   * Applies a mutation.
   *
   * @param fileContents   Current contents of the file.
   * @param mutation   Mutation to apply.
   * @returns File contents after applying the mutation.
   */
  public mutate(fileContents: string, mutation: TextReplaceMutation): string {
    return fileContents.replace(
      new RegExp(mutation.search, "g"),
      mutation.replace
    );
  }
}
