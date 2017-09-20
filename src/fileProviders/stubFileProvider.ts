import { IFileProvider } from "../fileProvider";

/**
 * Pretends to be a file.
 */
export class StubFileProvider implements IFileProvider {
    /**
     * Contents of the file.
     */
    private contents: string;

    /**
     * Initializes a new instance of the StubFileProvider class.
     *
     * @param contents   Initial contents of the file.
     */
    public constructor(contents: string) {
        this.contents = contents;
    }

    /**
     * Reads from the file.
     *
     * @returns A Promise for the contents of the file.
     */
    public async read(): Promise<string> {
        return this.contents;
    }

    /**
     * Writes to the file.
     *
     * @param contents   New contents of the file.
     * @returns A Promise for writing to the file.
     */
    public async write(contents: string): Promise<void> {
        this.contents = contents;
    }
}
