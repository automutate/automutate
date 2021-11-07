import { Mutation } from "./types/mutation";

/**
 * Mutations to be applied to files, keyed by file name.
 */
export interface FileMutations {
  [i: string]: ReadonlyArray<Mutation>;
}

/**
 * A wave of file mutations.
 */
export interface MutationsWave {
  /**
   * Mutations to be applied to files, if any.
   */
  readonly fileMutations?: FileMutations;
}

/**
 * Provides waves of file mutations.
 */
export interface MutationsProvider {
  /**
   * @returns A Promise for a wave of file mutations.
   */
  readonly provide: () => Promise<MutationsWave>;
}
