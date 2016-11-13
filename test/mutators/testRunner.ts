import { CaseSearcher } from "./caseSearcher";
import { CaseGrouper } from "./caseGrouper";
import { CaseVerifier } from "./caseVerifier";

/**
 * Generates and runs tests validating mutations.
 */
export class TestRunner {
    /**
     * Finds test cases that should be run.
     */
    private readonly caseSearcher: CaseSearcher;

    /**
     * Groups test cases into directories.
     */
    private readonly caseGrouper: CaseGrouper;

    /**
     * Verifies that test cases match actual with expected output.
     */
    private readonly caseVerifier: CaseVerifier;

    /**
     * Initializes a new instance of the TestRunner class.
     * 
     * @param caseSearcher   Finds test cases that should be run.
     */
    public constructor(caseSearcher: CaseSearcher, caseGrouper: CaseGrouper, caseVerifier: CaseVerifier) {
        this.caseSearcher = caseSearcher;
        this.caseGrouper = caseGrouper;
        this.caseVerifier = caseVerifier;
    }

    /**
     * Searches, groups, and verifies test cases.
     * 
     * @returns A Promise for completing the test cases.
     */
    public async run(): Promise<void> {
        this.caseVerifier.verifyDirectories(
            this.caseGrouper.group(
                await this.caseSearcher.search()));
    }
}
