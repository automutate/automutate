import { CaseRunner } from "./caseRunner";
import { TestDirectories, TestDirectory } from "./testCase";

/**
 * Runs a named description of a directory of test cases.
 *
 * @param directoryName   Name of the directory.
 * @param description   Describes the directory.
 */
export interface DescribeDirectory {
  (directoryName: string, description: () => void): void;
}

/**
 * Runs a named description of a test case.
 *
 * @param caseName   Name of the test case.
 * @param description   Describes the test case.
 */
export interface DescribeCase {
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
  private readonly describeDirectory: DescribeDirectory;

  /**
   * Runs a named description of a test case.
   */
  private readonly describeCase: DescribeCase;

  /**
   * Initializes a new instance of the CaseVerifier class.
   *
   * @param caseRunner   Runs test cases to validate results.
   * @param describeDirectory   Runs a named description of a directory of test cases.
   * @param describeCase   Runs a named description of a test case.
   */
  public constructor(
    caseRunner: CaseRunner,
    describeDirectory: DescribeDirectory,
    describeCase: DescribeCase
  ) {
    this.caseRunner = caseRunner;
    this.describeDirectory = describeDirectory;
    this.describeCase = describeCase;
  }

  /**
   *
   */
  public verifyDirectories(testDirectories: TestDirectories) {
    for (const directoryName in testDirectories) {
      this.describeDirectory(directoryName, () =>
        this.verifyDirectory(testDirectories[directoryName])
      );
    }
  }

  /**
   *
   */
  private verifyDirectory(testDirectory: TestDirectory) {
    for (const caseName in testDirectory.cases) {
      this.describeCase(
        caseName,
        async (): Promise<void> =>
          this.caseRunner.runCase(testDirectory.cases[caseName])
      );
    }

    this.verifyDirectories(testDirectory.directories);
  }
}
