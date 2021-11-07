import { FileProvider } from "./fileProvider";

/**
 * Creates new file providers for files.
 *
 * @param fileName   Name of the file.
 * @returns A file provider for the file.
 */
export interface CreateFileProvider {
  (fileName: string): FileProvider;
}

/**
 * Generates file providers for files.
 */
export interface FileProviderFactory {
  /**
   * Retrieves the file provider for a file.
   *
   * @param fileName   Name of the file.
   * @returns The file provider for the file.
   */
  generate(fileName: string): FileProvider;
}
