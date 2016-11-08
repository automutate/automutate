import { IFileProvider } from "./fileProvider";

/**
 * Creates file providers for files.
 * 
 * @param fileName   Name of a file to provide.
 * @returns A file provider for the file.
 */
export interface IFileProviderFactory {
    (fileName: string): IFileProvider;
}
