import * as path from "path";

import { MutationsApplier } from "../../lib/mutationsApplier";
import { ConsoleLogger } from "../../lib/loggers/consoleLogger";
import { IFileProvider } from "../../lib/fileProvider";
import { MutatorFactory } from "../../lib/mutatorFactory";
import { MutatorSearcher } from "../../lib/mutatorSearcher";
import { ITestCase } from "./testCase";
import { StubFileProvider } from "./fakes/StubFileProvider";

/**
 * Directs a test harness to expect two strings to be the same.
 * 
 * @param actual   Actual string value.
 * @param extpected   Expected string value.
 */
export interface IExpect {
    (actual: string, expected: string): void;
}

/**
 * Verifies mutations described by test cases.
 */
export class CaseRunner {
    /**
     * Directs a test harness to expect two strings to be the same.
     */
    private readonly expect: IExpect;

    /**
     * Initializes a new instance of the CaseRunner class.
     * 
     * @param expect   Directs a test harness to expect two strings to be the same.
     */
    public constructor(expect: IExpect) {
        this.expect = expect;
    }

    /**
     * Runs a test case to validate its results.
     * 
     * @param testCase   Mutation test case to be verified.
     * @returns A Promise for the test case completing.
     */
    public async runCase(testCase: ITestCase): Promise<void> {
        // Arrange
        const mutatorSearcher: MutatorSearcher = new MutatorSearcher([
            path.join(__dirname, "../../lib/mutators")
        ]);
        const stubFileProvider: IFileProvider = new StubFileProvider(testCase.before);
        const mutationsApplier: MutationsApplier = new MutationsApplier(
            (): IFileProvider => stubFileProvider, new MutatorFactory(mutatorSearcher, new ConsoleLogger()));

        // Act
        const actual: string = await mutationsApplier.applyFileMutations(
            [testCase.directoryPath.join("/"), testCase.name].join("/"),
            testCase.mutations);

        // Assert
        this.expect(actual, testCase.after);
    }
}