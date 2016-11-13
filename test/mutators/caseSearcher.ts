import * as fs from "fs";
import * as glob from "glob";
import * as path from "path";

import { IMutation } from "../../lib/mutation";
import { casesRoot, ITestCase, ITestCasePath } from "./testCase";

/**
 * Finds test cases that should be run.
 */
export class CaseSearcher {
    /**
     * Root directory to search for tests under.
     */
    private readonly rootDirectory: string;

    /**
     * Initializes a new instance of the CaseSearcher class.
     * 
     * @param rootDirectory   Root directory to search for tests under.
     */
    public constructor(rootDirectory: string) {
        this.rootDirectory = rootDirectory;
    }

    /**
     * Searches for test cases under the root directory.
     * 
     * @returns A Promise for test cases under the root directory.
     */
    public async search(): Promise<ITestCase[]> {
        return await this.readTestCases(await this.findMutationFiles());
    }

    /**
     * Finds full paths of mutation files under the root directory.
     * 
     * @returns A Promise for mutation file paths under the root directory.
     */
    private async findMutationFiles(): Promise<string[]> {
        return new Promise<string[]>((resolve, reject): void => {
            glob(
                path.join(this.rootDirectory, "**/mutations.json"),
                (error, files): void => {
                    error ? reject(error) : resolve(files);
                });
        });
    }

    /**
     * Reads test cases corresponding to mutation file paths.
     * 
     * @param mutationFiles   Mutation file paths under the root directory.
     * @returns A Promise for test cases corresponding to the mutation file paths.
     */
    private async readTestCases(mutationFiles: string[]): Promise<ITestCase[]> {
        return Promise.all<ITestCase>(
            mutationFiles
                .map((mutationFile: string): Promise<ITestCase> => {
                    return this.readTestCase(path.dirname(mutationFile));
                }));
    }

    /**
     * Reads a test case corresponding to a mutation file path.
     * 
     * @param mutationFiles   Mutation file path under the root directory.
     * @returns A Promise for the test case corresponding to the mutation file path.
     */
    private async readTestCase(directory: string): Promise<ITestCase> {
        const [after, before, mutations]: [string, string, IMutation[]] = await Promise.all([
            this.readFile(path.join(directory, "after.txt")),
            this.readFile(path.join(directory, "before.txt")),
            this.readFile(path.join(directory, "mutations.json")).then(JSON.parse)
        ]);
        const directorySplit: string[] = directory
            .substring(directory.indexOf(casesRoot))
            .split(/\\|\//g);
        const directoryPath: ITestCasePath = directorySplit.slice(0, directorySplit.length - 1);
        const name: string = directorySplit[directorySplit.length - 1];

        return { after, before, directoryPath, mutations, name };
    }

    /**
     * Reads a file from disk.
     * 
     * @param fileName   Name of the file.
     * @returns A Promise for the contents of the file.
     */
    private readFile(fileName: string): Promise<string> {
        return new Promise<string>((resolve, reject): void => {
            fs.readFile(fileName, (error, data): void => {
                error ? reject(error) : resolve(data.toString());
            });
        });
    }
}
