import * as fs from "fs";
import * as path from "path";

import { IFileProvider } from "../fileProvider";

/**
 * Settings for manipulating local files.
 */
export interface ILocalFileSettings {
    /**
     * Directory to read files from, if not the cwd.
     */
    readFileDirectory?: string;

    /**
     * Directory to write files to, if not the cwd.
     */
    writeFileDirectory?: string;
}

/**
 * Provides read-write operations on a local file.
 */
export class LocalFileProvider implements IFileProvider {
    /**
     * Name of the file to read from.
     */
    private readonly readFileName: string;

    /**
     * Name of the file to write to.
     */
    private readonly writeFileName: string;

    /**
     * Initializes a new instance of the LocalFileProvider class.
     * 
     * @param fileName   Name of the file.
     * @param fileSettings   Settings for manipulating local files.
     */
    public constructor(fileName: string, fileSettings: ILocalFileSettings) {
        this.readFileName = this.replaceFileDirectoryName(fileName, fileSettings.readFileDirectory);
        this.writeFileName = this.replaceFileDirectoryName(fileName, fileSettings.writeFileDirectory);
    }

    /**
     * Reads from the file.
     * 
     * @returns A Promise for the contents of the file.
     */
    public read(): Promise<string> {
        return new Promise((resolve, reject): void => {
            fs.readFile(this.readFileName, (error: Error, data: Buffer): void => {
                error ? reject(error) : resolve(data.toString());
            });
        });
    }

    /**
     * Writes to the file.
     * 
     * @param contents   New contents of the file.
     * @returns A Promise for writing to the file.
     */
    public write(contents: string): Promise<void> {
        return new Promise((resolve, reject): void => {
            fs.writeFile(this.writeFileName, contents, (error: Error): void => {
                error ? reject(error) : resolve();
            });
        });
    }

    /**
     * Resolves a file name to a provided directory, if given.
     * 
     * @param fileName   File name to resolve.
     * @param directory   Directory to resolve within, if any.
     * @returns The file name, resolved.
     */
    private replaceFileDirectoryName(fileName: string, directory?: string) {
        return directory
            ? path.resolve(directory, path.basename(fileName))
            : fileName;
    }
}
