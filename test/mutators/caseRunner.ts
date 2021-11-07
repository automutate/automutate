import * as path from "path";

import { FileProvider } from "../../lib/fileProvider";
import { FileProviderFactory } from "../../lib/fileProviderFactory";
import { StubFileProvider } from "../../lib/fileProviders/stubFileProvider";
import { Logger, Logger } from "../../lib/logger";
import { MutationsApplier, MutationsApplier } from "../../lib/mutationsApplier";
import { MutatorFactory } from "../../lib/mutatorFactory";
import { MutatorSearcher, MutatorSearcher } from "../../lib/mutatorSearcher";
import { TestCase } from "./testCase";

/**
 * Directs a test harness to expect two strings to be the same.
 *
 * @param actual   Actual string value.
 * @param extpected   Expected string value.
 */
export interface Expect {
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
   * Initializes a new nstance of the CaseRunner class.
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
  public async runCase(testCase: TestCase): Promise<void> {
    // Arrange
    const mutatorSearcher: MutatorSearcher = new MutatorSearcher([
      path.join(__dirname, "../../lib/mutators"),
    ]);
    const stubLogger: Logger = new Logger();
    const stubFileProvider: FileProvider = new StubFileProvider(
      testCase.before
    );
    const mutationsApplier: MutationsApplier = new MutationsApplier({
      fileProviderFactory: new FileProviderFactory(
        (): FileProvider => stubFileProvider
      ),
      logger: stubLogger,
      mutatorFactory: new MutatorFactory(mutatorSearcher, stubLogger),
    });

    // Act
    const actual: string = await mutationsApplier.applyFileMutations(
      [testCase.directoryPath.join("/"), testCase.name].join("/"),
      testCase.mutations
    );

    // Assert
    this.expect(actual, testCase.after);
  }
}
