import * as fs from "fs";
import * as path from "path";

import { IMutation } from "./mutation";
import { IMutator } from "./mutator";
import { NameTransformer } from "./nameTransformer";

/**
 * Suffix appended to all mutator classes.
 */
const mutatorClassSuffix: string = "Mutator";

/**
 * Searches for mutator classes.
 */
export interface IMutatorSearcher {
    /**
     * Searches for a mutator sub-class within the directories.
     * 
     * @param name   Dashed-case name of the mutator sub-class.
     * @returns The mutator sub-class, if it can be found.
     */
    search<TMutator extends IMutator<IMutation>>(name: string): IMutatorClass<TMutator> | undefined;
}

/**
 * Implementation of the IMutator interface.
 */
export interface IMutatorClass<TMutator extends IMutator<IMutation>> {
    /**
     * Initializes a new instance of the TMutator class.
     */
    new(): TMutator;
}

/**
 * Searches for mutator classes.
 */
export class MutatorSearcher implements IMutatorSearcher {
    /**
     * Transforms dashed-case names to camelCase.
     */
    private readonly nameTransformer: NameTransformer;

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
    public constructor(nameTransformer: NameTransformer, directories: string[]) {
        this.nameTransformer = nameTransformer;
        this.directories = directories;
    }

    /**
     * Searches for a mutator sub-class within the directories.
     * 
     * @param name   Dashed-case name of the mutator sub-class.
     * @returns The mutator sub-class, if it can be found.
     */
    public search<TMutator extends IMutator<IMutation>>(name: string): IMutatorClass<TMutator> | undefined {
        const camelCaseName: string = this.nameTransformer.toCamelCase(name);

        for (const directory of this.directories) {
            const joinedPath: string = path.join(directory, camelCaseName + mutatorClassSuffix + ".js");

            if (fs.existsSync(joinedPath)) {
                return require(joinedPath)[this.nameTransformer.toPascalCase(name) + mutatorClassSuffix];
            }
        }

        return undefined;
    }
}
