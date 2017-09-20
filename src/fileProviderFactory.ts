import { IFileProvider } from "./fileProvider";

/**
 * File providers, keyed by file name.
 */
interface IFileProviders {
    [i: string]: IFileProvider;
}

/**
 * Creates new file providers for files.
 *
 * @param fileName   Name of the file.
 * @returns A file provider for the file.
 */
export interface ICreateFileProvider {
    (fileName: string): IFileProvider;
}

/**
 * Generates file providers for files.
 */
export interface IFileProviderFactory {
    /**
     * Retrieves the file provider for a file.
     *
     * @param fileName   Name of the file.
     * @returns The file provider for the file.
     */
    generate(fileName: string): IFileProvider;
}

/**
 * Generates file providers for files.
 */
export class FileProviderFactory implements IFileProviderFactory {
    /**
     * Creates new file providers for files.
     */
    private readonly createFileProvider: ICreateFileProvider;

    /**
     * File providers, keyed by file name.
     */
    private readonly fileProviders: IFileProviders = {};

    /**
     * Initializes a new instance of the FileProviderFactory class.
     *
     * @param createFileProvider   Creates new file providers for files.
     */
    public constructor(createFileProvider: ICreateFileProvider) {
        this.createFileProvider = createFileProvider;
    }

    /**
     * Retrieves the file provider for a file.
     *
     * @param fileName   Name of the file.
     * @returns The file provider for the file.
     */
    public generate(fileName: string): IFileProvider {
        if (!this.fileProviders[fileName]) {
            this.fileProviders[fileName] = this.createFileProvider(fileName);
        }

        return this.fileProviders[fileName];
    }
}
