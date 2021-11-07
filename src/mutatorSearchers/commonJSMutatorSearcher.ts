import * as fs from "fs";
import * as path from "path";

import { Mutator } from "..";
import { toCamelCase, toPascalCase } from "../nameTransformer";
import { MutatorSearcher, MutatorClass } from "../types/mutatorSearcher";

/**
 * Suffix appended to all mutator classes.
 */
const mutatorClassSuffix = "Mutator";

/**
 * Searches for mutator classes on a CommonJS system.
 */
export class CommonJSMutatorSearcher implements MutatorSearcher {
  /**
   * Directories to search within.
   */
  private readonly directories: string[];

  /**
   * Initializes a new instance of the MutatorSearcher class.
   *
   * @param nameTransformer  Transforms dashed-case names to camelCase.
   * @param directories   Directories to search within.
   */
  public constructor(directories: string[]) {
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
    const camelCaseName: string = toCamelCase(name);

    for (const directory of this.directories) {
      const joinedPath: string = path.join(
        directory,
        `${camelCaseName}${mutatorClassSuffix}.js`
      );

      if (fs.existsSync(joinedPath)) {
        return require(joinedPath)[toPascalCase(name) + mutatorClassSuffix];
      }
    }

    return undefined;
  }
}
