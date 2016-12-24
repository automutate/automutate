import * as fs from "fs";
import * as path from "path";

/**
 * Runs the contents of a test.
 * 
 * @param directoryName   Name of the test's directory.
 */
export interface IOnCase {
    (directoryName: string): Promise<void>;
}

/**
 * Crawls a directory structure for test case settings.
 */
export class CasesCrawler {
    /**
     * File name that must exist in a test case.
     */
    private readonly indicatingFileName: string;

    /**
     * Runs the contents of a test.
     */
    private readonly onCase: IOnCase;

    /**
     * Initialize a new instance of the CasesCrawler class.
     * 
     * @param indicatingFileName   File name that must exist in a test case.
     * @param onCase   Runs the contents of a test.
     */
    public constructor(indicatingFileName: string, onCase: IOnCase) {
        this.indicatingFileName = indicatingFileName;
        this.onCase = onCase;
    }

    /**
     * Recursively crawls a directory for test cases.
     * 
     * @param caseName   Case name for the directory.
     * @param directoryPath   Absolute path to the directory.
     */
    public crawl(caseName: string, directoryPath: string): void {
        if (fs.existsSync(path.join(directoryPath, this.indicatingFileName))) {
            it(caseName, (): Promise<void> => this.onCase(directoryPath));
            return;
        }

        describe(caseName, (): void => {
            const childDirectories: string[] = fs.readdirSync(directoryPath)
                .filter((fileName: string): boolean => {
                    return fs.statSync(path.join(directoryPath, fileName)).isDirectory();
                });

            for (const childDirectory of childDirectories) {
                this.crawl(childDirectory, path.join(directoryPath, childDirectory));
            }
        });
    }
}
