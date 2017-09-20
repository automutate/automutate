/**
 * Provides read-write operations on a file.
 */
export interface IFileProvider {
    /**
     * Reads from the file.
     *
     * @returns A Promise for the contents of the file.
     */
    read(): Promise<string>;

    /**
     * Writes to the file.
     *
     * @param contents   New contents of the file.
     * @returns A Promise for writing to the file.
     */
    write(contents: string): Promise<void>;
}
