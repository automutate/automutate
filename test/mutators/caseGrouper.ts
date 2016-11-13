import { ITestCase, ITestDirectories } from "./testCase";

/**
 * Groups test cases into directories.
 */
export class CaseGrouper {
    /**
     * Groups test cases into directories.
     * 
     * @param testCases   Test cases to be grouped.
     * @returns The test cases grouped into directories.
     */
    public group(testCases: ITestCase[]): ITestDirectories {
        const testDirectories: ITestDirectories = {};

        for (const testCase of testCases) {
            this.addTestCaseToDirectories(testCase, testDirectories);
        }

        return testDirectories;
    }

    /**
     * Adds a test case under its directory, creating directories as needed.
     * 
     * @param testCase   A test case to be grouped.
     * @param tesDirectories   Nested directories of test cases.
     */
    private addTestCaseToDirectories(testCase: ITestCase, testDirectories: ITestDirectories): void {
        let currentDirectories: ITestDirectories = testDirectories;

        for (let i: number = 0; i < testCase.directoryPath.length - 1; i += 1) {
            const directoryName: string = testCase.directoryPath[i];
            if (!currentDirectories[directoryName]) {
                currentDirectories[directoryName] = {
                    cases: {},
                    directories: {}
                };
            }

            currentDirectories = currentDirectories[directoryName].directories;
        }

        const lastDirectoryName: string = testCase.directoryPath[testCase.directoryPath.length - 1];
        if (!currentDirectories[lastDirectoryName]) {
            currentDirectories[lastDirectoryName] = {
                cases: {},
                directories: {}
            };
        }

        currentDirectories[lastDirectoryName].cases[testCase.name] = testCase;
    }
}
