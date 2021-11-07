import * as fs from "fs";
import * as path from "path";

import { Mutator } from "./mutator";
import { NameTransformer } from "./nameTransformer";

/**
 * Suffix appended to all mutator classes.
 */
const mutatorClassSuffix = "Mutator";

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
export interface MutatorClass<TMutator extends Mutator> {
  /**
   * Initializes a new instance of the TMutator class.
   *
   * @param originalFileContents   Original contents of the file.
   */
  new (originalFileContents: string): TMutator;
}

/**
 * Searches for mutator classes.
 */
export class MutatorSearcher implements MutatorSearcher {
  /**
   * Directories to search within.
   */
  private readonly directories: string[];

  /**
   * Transforms dashed-case names to camelCase.
   */
  private readonly nameTransformer: NameTransformer;

  /**
   * Initializes a new instance of the MutatorSearcher class.
   *
   * @param nameTransformer  Transforms dashed-case names to camelCase.
   * @param directories   Directories to search within.
   */
  public constructor(
    directories: string[],
    nameTransformer = new NameTransformer()
  ) {
    this.nameTransformer = nameTransformer;
    this.directories = directories;
  }

  /**
   * Searches for a mutator sub-class within the directories.
   *
   * @param name   Dashed-case name of the mutator sub-class.
   * @returns The mutator sub-class, if it can be found.
   */
  public search<TMutator extends Mutator>(
    name: string
  ): MutatorClass<TMutator> | undefined {
    const camelCaseName: string = this.nameTransformer.toCamelCase(name);

    for (const directory of this.directories) {
      const joinedPath: string = path.join(
        directory,
        `${camelCaseName}${mutatorClassSuffix}.js`
      );

      if (fs.existsSync(joinedPath)) {
        return require(joinedPath)[
          this.nameTransformer.toPascalCase(name) + mutatorClassSuffix
        ];
      }
    }

    return undefined;
  }
}
