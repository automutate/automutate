import * as fs from "fs";
import * as path from "path";

import { ITestCaseSettings, TestCase } from "./testCase";
import { IMutationsProviderFactory } from "./autoMutatorFactory";
import { AutoMutatorFactory } from "./autoMutatorFactory";

/**
 * Creates tests for provided cases.
 */
export class TestsFactory {
    /**
     * Creates test cases from test case settings.
     */
    private readonly autoMutatorFactory: AutoMutatorFactory;

    /**
     * Settings for the test cases.
     */
    private readonly settings: ITestCaseSettings;

    /**
     * Initializes a new instance of the TestsFactory class.
     * 
     * @param mutationsProviderFactory   Creates test cases from test case settings.
     * @param extension   File extension of test case files.
     */
    public constructor(mutationsProviderFactory: IMutationsProviderFactory, settings: ITestCaseSettings) {
        this.autoMutatorFactory = new AutoMutatorFactory(mutationsProviderFactory);
        this.settings = settings;
    }

    /**
     * Creates tests for the a cases directory.
     * 
     * @param casesPath   Path to the test cases.
     * @returns A Promise for creating tests for the cases directory.
     */
    public create(casesPath: string): void {
        const caseNames: string[] = fs.readdirSync(casesPath);

        describe("cases", (): void => {
            for (const caseName of caseNames) {
                it(caseName, (): Promise<void> => {
                    return this.runTest(path.join(casesPath, caseName));
                });
            }
        });
    }

    /**
     * Creates and runs a test case.
     * 
     * @param casePath   Path to the test case.
     * @returns A Promise for running the test case.
     */
    private runTest(casePath: string): Promise<void> {
        return (new TestCase(this.createTestCaseSettings(casePath), this.autoMutatorFactory))
            .run();
    }

    /**
     * Creates settings for a test case.
     * 
     * @param casePath   Path to a test case.
     * @returns Settings for the test case.
     */
    private createTestCaseSettings(casePath: string): ITestCaseSettings {
        return {
            actual: path.join(casePath, this.settings.actual),
            expected: path.join(casePath, this.settings.expected),
            original: path.join(casePath, this.settings.original),
            settings: path.join(casePath, this.settings.settings)
        };
    }
}
