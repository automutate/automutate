import { Logger } from "./types/logger";
import { Mutation } from "./types/mutation";
import { Mutator } from "./mutator";
import { MutatorClass, MutatorSearcher } from "./types/mutatorSearcher";

/**
 * Mutator sub-classes, keyed by dashed-case name.
 */
interface MutatorClasses {
  [i: string]: MutatorClass<Mutator>;
}

/**
 * Creates mutators for mutations.
 */
export class MutatorFactory {
  /**
   * Mutator sub-classes, keyed by dashed-case name.
   */
  private readonly classes: MutatorClasses = {};

  /**
   * Generates output messages for significant operations.
   */
  private readonly logger: Logger;

  /**
   * Searches for mutator classes.
   */
  private readonly searcher: MutatorSearcher;

  /**
   * Initializes a new instance of the MutatorFactory class.
   *
   * @param searcher   Searches for mutator classes.
   */
  public constructor(mutatorSearcher: MutatorSearcher, logger: Logger) {
    this.searcher = mutatorSearcher;
    this.logger = logger;
  }

  /**
   * Attempts to find and instantiate a mutator sub-class for a file.
   *
   * @param name   Dashed-case name of the mutator sub-class.
   * @param fileContents   Contents of the file.
   * @returns An instance of the mutator sub-class, if the sub-class can be found.
   */
  public generate<TMutator extends Mutator>(
    name: string,
    fileContents: string
  ): TMutator | undefined {
    if (!this.classes[name]) {
      const mutatorClass = this.searcher.search<TMutator>(name);
      if (!mutatorClass) {
        return undefined;
      }

      this.classes[name] = mutatorClass;
    }

    // @todo Use some form of "implements" keyword when TypeScript supports it
    return new this.classes[name](fileContents) as TMutator;
  }

  /**
   * Generates and applied a mutator, if possible.
   *
   * @param fileContents   Contents of the file.
   * @param mutation   Mutation to be applied to the file.
   * @returns The mutated file contents.
   */
  public generateAndApply(fileContents: string, mutation: Mutation): string {
    const mutator = this.generate(mutation.type, fileContents);
    if (!mutator) {
      this.logger.onUnknownMutationType?.(mutation);

      return fileContents;
    }

    return mutator.mutate(fileContents, mutation, this);
  }
}
