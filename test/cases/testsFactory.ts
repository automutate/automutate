import * as path from "path";

import { AutoMutatorFactory, IMutationsProviderFactory } from "./autoMutatorFactory";
import { CasesCrawler } from "./casesCrawler";
import { ITestCaseSettings, TestCase } from "./testCase";

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
     * Crawls a directory structure for test case settings.
     */
    private readonly casesCrawler: CasesCrawler;

    /**
     * Initializes a new instance of the TestsFactory class.
     * 
     * @param mutationsProviderFactory   Creates test cases from test case settings.
     * @param extension   File extension of test case files.
     */
    public constructor(mutationsProviderFactory: IMutationsProviderFactory, settings: ITestCaseSettings) {
        this.autoMutatorFactory = new AutoMutatorFactory(mutationsProviderFactory);
        this.settings = settings;
        this.casesCrawler = new CasesCrawler(
            this.settings.original,
            (directoryName: string): Promise<void> => this.runTest(directoryName));
    }

    /**
     * Describes tests for the cases directory.
     * 
     * @param casesPath   Path to the test cases.
     * @returns A Promise for creating tests for the cases directory.
     */
    public describe(casesPath: string): void {
        this.casesCrawler.crawl("cases", casesPath);
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
