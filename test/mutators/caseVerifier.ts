import { CaseRunner } from "./caseRunner";
import { ITestDirectories, ITestDirectory } from "./testCase";

/**
 * Runs a named description of a directory of test cases.
 * 
 * @param directoryName   Name of the directory.
 * @param description   Describes the directory.
 */
export interface IDescribeDirectory {
    (directoryName: string, description: () => void): void;
}

/**
 * Runs a named description of a test case.
 * 
 * @param caseName   Name of the test case.
 * @param description   Describes the test case.
 */
export interface IDescribeCase {
    (caseName: string, description: () => void): void;
}

/**
 * Verifies that test cases match actual with expected output.
 */
export class CaseVerifier {
    /**
     * Runs test cases to validate results.
     */
    private readonly caseRunner: CaseRunner;

    /**
     * Runs a named description of a directory of test cases.
     */
    private readonly describeDirectory: IDescribeDirectory;

    /**
     * Runs a named description of a test case.
     */
    private readonly describeCase: IDescribeCase;

    /**
     * Initializes a new instance of the CaseVerifier class.
     * 
     * @param caseRunner   Runs test cases to validate results.
     * @param describeDirectory   Runs a named description of a directory of test cases.
     * @param describeCase   Runs a named description of a test case.
     */
    public constructor(caseRunner: CaseRunner, describeDirectory: IDescribeDirectory, describeCase: IDescribeCase) {
        this.caseRunner = caseRunner;
        this.describeDirectory = describeDirectory;
        this.describeCase = describeCase;
    }

    /**
     * 
     */
    public verifyDirectories(testDirectories: ITestDirectories): void {
        for (const directoryName in testDirectories) {
            this.describeDirectory(
                directoryName,
                (): void => this.verifyDirectory(testDirectories[directoryName]));
        }
    }

    /**
     * 
     */
    private verifyDirectory(testDirectory: ITestDirectory): void {
        for (const caseName in testDirectory.cases) {
            this.describeCase(
                caseName,
                async (): Promise<void> => this.caseRunner.runCase(testDirectory.cases[caseName]));
        }

        this.verifyDirectories(testDirectory.directories);
    }
}