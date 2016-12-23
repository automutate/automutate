import { expect } from "chai";
import * as fs from "fs";

import { AutoMutator } from "../../lib/automutator";
import { AutoMutatorFactory } from "./autoMutatorFactory";

/**
 * Settings for a single test case.
 */
export interface ITestCaseSettings {
    /**
     * File path for the mutation result.
     */
    actual: string;

    /**
     * File path for what the mutation result should be.
     */
    expected: string;

    /**
     * File path for the original file contents.
     */
    original: string;
}

/**
 * Describes a single test case to be run.
 */
export class TestCase {
    /**
     * Settings for the test case.
     */
    private readonly settings: ITestCaseSettings;

    /**
     * Generates AutoMutator instances for testing.
     */
    private readonly autoMutatorFactory: AutoMutatorFactory;

    /**
     * Initializes a new instance of the TestCase class.
     * 
     * @param settings   Settings for the test case.
     * @param autoMutatorFactory   Generates AutoMutator instances for testing.
     */
    public constructor(settings: ITestCaseSettings, autoMutatorFactory: AutoMutatorFactory) {
        this.settings = settings;
        this.autoMutatorFactory = autoMutatorFactory;
    }

    /**
     * Runs the test case.
     * 
     * @returns A Promise for running the test case.
     * @todo Promise-ify this
     */
    public async run(): Promise<void> {
        // Arrange
        await this.arrangeFiles();
        const autoMutator: AutoMutator = this.autoMutatorFactory.create(this.settings.actual);
        const expectedContents: string = fs.readFileSync(this.settings.expected).toString();

        // Act
        await autoMutator.run();

        // Assert
        const actualContents: string = fs.readFileSync(this.settings.actual).toString();
        expect(actualContents).to.be.equal(expectedContents);
    }

    /**
     * Resets the expected file to the original file contents.
     * 
     * @returns A Promise for resetting the expected file.
     * @todo How to react to the reader finishing piping?
     */
    private arrangeFiles(): Promise<void> {
        return new Promise<void>(resolve => {
            const reader = fs.createReadStream(this.settings.original);

            reader.on("close", resolve);

            reader.pipe(fs.createWriteStream(this.settings.actual));

            setTimeout(() => reader.close(), 100);
        });
    }
}
