import { FileMutations } from "../mutationsProvider";

/**
 * Applies individual waves of mutations.
 */
export interface MutationsApplier {
  /**
   * Applies an iteration of file mutations.
   *
   * @param mutations   Mutations to be applied to files.
   * @returns A Promise for the file mutations being applied.
   */
  apply(mutations: FileMutations): Promise<void>;
}
