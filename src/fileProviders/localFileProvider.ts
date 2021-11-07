import * as fs from "fs";

import { FileProvider } from "../types/fileProvider";

/**
 * Provides read-write operations on a local file.
 */
export class LocalFileProvider implements FileProvider {
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
    return new Promise<string>((resolve, reject) => {
      fs.readFile(this.fileName, (error, data) => {
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
  public async write(contents: string): Promise<void> {
    await new Promise<void>((resolve, reject) => {
      fs.writeFile(this.fileName, contents, (error) => {
        error ? reject(error) : resolve();
      });
    });
  }
}
