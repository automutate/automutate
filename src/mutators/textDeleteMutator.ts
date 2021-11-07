import { Mutation } from "../types/mutation";
import { Mutator } from "../mutator";

/**
 * Description of deleting a part of a file.
 */
export interface TextDeleteMutation extends Mutation {
  /**
   * Unique type name identifying text delete mutations.
   */
  type: "text-delete";
}

/**
 * Applies text deletion mutations to a file.
 */
export class TextDeleteMutator extends Mutator {
  /**
   * Applies a mutation.
   *
   * @param fileContents   Current contents of the file.
   * @param mutation   Mutation to apply.
   * @returns File contents after applying the mutation.
   */
  public mutate(fileContents: string, mutation: TextDeleteMutation): string {
    return [
      fileContents.substring(0, mutation.range.begin),
      fileContents.substring(mutation.range.end || mutation.range.begin),
    ].join("");
  }
}
