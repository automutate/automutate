import { Mutation } from "../types/mutation";
import { Mutator } from "../mutator";

/**
 * Description of inserting text into a file.
 */
export interface TextInsertMutation extends Mutation {
  /**
   * Text to be inserted.
   */
  insertion: string;

  /**
   * Unique type name identifying text insert mutations.
   */
  type: "text-insert";
}

/**
 * Applies text insertion mutations to a file.
 */
export class TextInsertMutator extends Mutator {
  /**
   * Applies a mutation.
   *
   * @param fileContents   Current contents of the file.
   * @param mutation   Mutation to apply.
   * @returns File contents after applying the mutation.
   */
  public mutate(fileContents: string, mutation: TextInsertMutation): string {
    return [
      fileContents.substring(0, mutation.range.begin),
      mutation.insertion,
      fileContents.substring(mutation.range.begin),
    ].join("");
  }
}
