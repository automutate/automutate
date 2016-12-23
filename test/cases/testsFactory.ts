import * as fs from "fs";
import * as path from "path";

import { TestCaseFactory } from "./testCaseFactory";
import { IMutationsProviderFactory } from "./autoMutatorFactory";
import { AutoMutatorFactory } from "./autoMutatorFactory";

/**
 * Creates tests for provided cases.
 */
export class TestsFactory {
    /**
     * Creates test cases from test case settings.
     */
    private readonly caseFactory: TestCaseFactory;

    /**
     * Initializes a new instance of the TestsFactory class.
     * 
     * @param mutationsProviderFactory   Creates test cases from test case settings.
     * @param extension   File extension of test case files.
     */
    public constructor(mutationsProviderFactory: IMutationsProviderFactory, extension: string) {
        this.caseFactory = new TestCaseFactory(
            new AutoMutatorFactory(mutationsProviderFactory),
            extension);
    }

    /**
     * Creates tests for the a cases directory.
     * 
     * @param casesPath   Path to the test cases.
     * @returns A Promise for creating tests for the cases directory.
     * @todo Promise-ify this.
     */
    public create(casesPath: string): void {
        const caseNames: string[] = fs.readdirSync(casesPath);

        describe("cases", (): void => {
            for (const caseName of caseNames) {
                it(caseName, async (): Promise<void> => {
                    return (await this.caseFactory.create(path.join(casesPath, caseName)))
                        .run();
                });
            }
        });
    }
}
