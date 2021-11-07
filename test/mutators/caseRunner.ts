import * as path from "path";

import { FileProvider } from "../../src/fileProvider";
import { FileProviderFactory } from "../../src/fileProviderFactory";
import { StubFileProvider } from "../../src/fileProviders/stubFileProvider";
import { NoopLogger } from "../../src/loggers/noopLogger";
import { MutationsApplier } from "../../src/mutationsApplier";
import { MutatorFactory } from "../../src/mutatorFactory";
import { MutatorSearcher } from "../../src/mutatorSearcher";
import { TestCase } from "./testCase";
import { getMetaUrlDirname } from "./utils";

/**
 * Directs a test harness to expect two strings to be the same.
 *
 * @param actual   Actual string value.
 * @param expected   Expected string value.
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
  private readonly expect: Expect;

  /**
   * Initializes a new instance of the CaseRunner class.
   *
   * @param expect   Directs a test harness to expect two strings to be the same.
   */
  public constructor(expect: Expect) {
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
    const mutatorSearcher = new MutatorSearcher([
      path.join(getMetaUrlDirname(import.meta.url), "../../src/mutators"),
    ]);
    const stubLogger = new NoopLogger();
    const stubFileProvider = new StubFileProvider(testCase.before);
    const mutationsApplier = new MutationsApplier({
      fileProviderFactory: new FileProviderFactory(() => stubFileProvider),
      logger: stubLogger,
      mutatorFactory: new MutatorFactory(mutatorSearcher, stubLogger),
    });

    // Act
    const actual = await mutationsApplier.applyFileMutations(
      [testCase.directoryPath.join("/"), testCase.name].join("/"),
      testCase.mutations
    );

    // Assert
    this.expect(actual, testCase.after);
  }
}
