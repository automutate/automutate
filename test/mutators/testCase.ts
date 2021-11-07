import { Mutation } from "../../lib/mutation";

/**
 * Root directory name for cases.
 */
export const casesRoot: "mutations" = "mutations";

/**
 * Directory path to the test case, starting with the root directory name.
 */
export type TestCasePath = [typeof casesRoot] | (typeof casesRoot | string)[]; // ["mutators", ...string[]]

/**
 * Nested directories of test cases, keyed by directory name.
 */
export interface TestDirectories {
  [i: string]: TestDirectory;
}

/**
 * Directory of test cases.
 */
export interface TestDirectory {
  /**
   * Test cases, keyed by case name.
   */
  cases: TestCases;

  /**
   * Test case directories, keyed by name.
   */
  directories: TestDirectories;
}

/**
 * Directory of test cases, keyed by case name.
 */
export interface TestCases {
  [i: string]: TestCase;
}

/**
 * Single mutation test case to be verified.
 */
export interface TestCase {
  /**
   * Expected results after mutation.
   */
  after: string;

  /**
   * Original contents before mutation.
   */
  before: string;

  /**
   * Directory path to the test case, starting with the root directory name for cases.
   */
  directoryPath: TestCasePath;

  /**
   * Mutations to be applied in the test.
   */
  mutations: Mutation[];

  /**
   * Friendly name of the test case.
   */
  name: string;
}
