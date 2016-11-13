import { IMutation } from "../../lib/mutation";

/**
 * Root directory name for cases.
 */
export const casesRoot: "mutations" = "mutations";

/**
 * Directory path to the test case, starting with the root directory name.
 */
export type ITestCasePath = [typeof casesRoot] | ((typeof casesRoot) | string)[]; // ["mutators", ...string[]]

/**
 * Nested directories of test cases, keyed by directory name.
 */
export interface ITestDirectories {
    [i: string]: ITestDirectory;
}

/**
 * Directory of test cases.
 */
export interface ITestDirectory {
    /**
     * Test cases, keyed by case name.
     */
    cases: ITestCases;

    /**
     * Test case directories, keyed by name.
     */
    directories: ITestDirectories;
}

/**
 * Directory of test cases, keyed by case name.
 */
export interface ITestCases {
    [i: string]: ITestCase;
}

/**
 * Single mutation test case to be verified.
 */
export interface ITestCase {
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
    directoryPath: ITestCasePath;

    /**
     * Mutations to be applied in the test.
     */
    mutations: IMutation[];

    /**
     * Friendly name of the test case.
     */
    name: string;
}
