import { FileProviderFactory } from "../../src/fileProviderFactory";
import { StubFileProvider } from "../../src/fileProviders/stubFileProvider";
import { NoopLogger } from "../../src/loggers/noopLogger";
import { MutationsApplier } from "../../src/mutationsApplier";
import { MutatorFactory } from "../../src/mutatorFactory";
import { TestCase } from "./testCase";

import { MultipleMutator } from "../../src/mutators/multipleMutator";
import { TextDeleteMutator } from "../../src/mutators/textDeleteMutator";
import { TextInsertMutator } from "../../src/mutators/textInsertMutator";
import { TextReplaceMutator } from "../../src/mutators/textReplaceMutator";
import { TextSwapMutator } from "../../src/mutators/textSwapMutator";
import { MutatorClass } from "../../src/mutatorSearcher";
import { Mutator } from "../../src/mutator";

/**
 * Directs a test harness to expect two strings to be the same.
 *
 * @param actual   Actual string value.
 * @param expected   Expected string value.
 */
export interface Expect {
  (actual: string, expected: string): void;
}

const stubLogger = new NoopLogger();

const mutatorClasses = new Map<string, MutatorClass>([
  ["multiple", MultipleMutator],
  ["text-delete", TextDeleteMutator],
  ["text-insert", TextInsertMutator],
  ["text-replace", TextReplaceMutator],
  ["text-swap", TextSwapMutator],
]);

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
    const stubFileProvider = new StubFileProvider(testCase.before);
    const mutationsApplier = new MutationsApplier({
      fileProviderFactory: new FileProviderFactory(() => stubFileProvider),
      logger: stubLogger,
      mutatorFactory: new MutatorFactory(
        {
          search: <TMutator extends Mutator>(name: string) => {
            return mutatorClasses.get(name) as MutatorClass<TMutator>;
          },
        },
        stubLogger
      ),
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
