import { Mutator } from "../mutator";

/**
 * Searches for mutator classes.
 */
export interface MutatorSearcher {
  /**
   * Searches for a mutator sub-class within the directories.
   *
   * @param name   Dashed-case name of the mutator sub-class.
   * @returns The mutator sub-class, if it can be found.
   */
  search<TMutator extends Mutator>(
    name: string
  ): MutatorClass<TMutator> | undefined;
}

/**
 * Implementation of the Mutator interface.
 */
export interface MutatorClass<TMutator extends Mutator = Mutator> {
  /**
   * Initializes a new instance of the TMutator class.
   *
   * @param originalFileContents   Original contents of the file.
   */
  new (originalFileContents: string): TMutator;
}
