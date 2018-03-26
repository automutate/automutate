import * as fs from "fs";

import { IFileProvider } from "../fileProvider";

/**
 * Provides read-write operations on a local file.
 */
export class LocalFileProvider implements IFileProvider {
    /**
     * Name of the file.
     */
    private readonly fileName: string;

    /**
     * Initializes a new instance of the LocalFileProvider class.
     *
     * @param fileName   Name of the file.
     * @param fileSettings   Settings for manipulating local files.
     */
    public constructor(fileName: string) {
        this.fileName = fileName;
    }

    /**
     * Reads from the file.
     *
     * @returns A Promise for the contents of the file.
     */
    public async read(): Promise<string> {
        return new Promise<string>((resolve, reject): void => {
            fs.readFile(this.fileName, (error: Error, data: Buffer): void => {
                error
                    ? reject(error)
                    : resolve(data.toString());
            });
        });
    }

    /**
     * Writes to the file.
     *
     * @param contents   New contents of the file.
     * @returns A Promise for writing to the file.
     */
    public async write(contents: string): Promise<void> {
        await new Promise<void>((resolve, reject): void => {
            fs.writeFile(this.fileName, contents, (error: Error): void => {
                error
                    ? reject(error)
                    : resolve();
            });
        });
    }
}
