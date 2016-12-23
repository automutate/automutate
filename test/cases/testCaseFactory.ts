import * as path from "path";

import { ITestCaseSettings, TestCase } from "./testCase";
import { AutoMutatorFactory } from "./autoMutatorFactory";

/**
 * Creates test cases from test case settings.
 */
export class TestCaseFactory {
    /**
     * Generates AutoMutator instances for testing.
     */
    private readonly autoMutatorFactory: AutoMutatorFactory;

    /**
     * File extension of test case files.
     */
    private readonly extension: string;

    /**
     * Initializes a new instance of the TestCaseFactory class.
     * 
     * @param autoMutatorFactory   Generates AutoMutator instances for testing.
     * @param extension   File extension of test case files.
     */
    public constructor(autoMutatorFactory: AutoMutatorFactory, extension: string) {
        this.autoMutatorFactory = autoMutatorFactory;
        this.extension = extension;
    }

    /**
     * Creates a test case from its path.
     * 
     * @param casePath   Path to the test case.
     * @returns A Promise for creating tests for the cases directory.
     * @todo Promise-ify this.
     */
    public create(casePath: string): Promise<TestCase> {
        const settings: ITestCaseSettings = {
            actual: path.join(casePath, "actual" + this.extension),
            expected: path.join(casePath, "expected" + this.extension),
            original: path.join(casePath, "original" + this.extension)
        };

        return Promise.resolve(new TestCase(settings, this.autoMutatorFactory));
    }
}
