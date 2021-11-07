import { FileProvider } from "../fileProvider";
import {
  FileProviderFactory,
  CreateFileProvider,
} from "../types/fileProviderFactory";

/**
 * File providers, keyed by file name.
 */
interface FileProviders {
  [i: string]: FileProvider;
}

/**
 * Generates cached file providers for files.
 */
export class CachingFileProviderFactory implements FileProviderFactory {
  /**
   * Creates new file providers for files.
   */
  private readonly createFileProvider: CreateFileProvider;

  /**
   * File providers, keyed by file name.
   */
  private readonly fileProviders: FileProviders = {};

  /**
   * Initializes a new instance of the FileProviderFactory class.
   *
   * @param createFileProvider   Creates new file providers for files.
   */
  public constructor(createFileProvider: CreateFileProvider) {
    this.createFileProvider = createFileProvider;
  }

  /**
   * Retrieves the file provider for a file.
   *
   * @param fileName   Name of the file.
   * @returns The file provider for the file.
   */
  public generate(fileName: string): FileProvider {
    if (!this.fileProviders[fileName]) {
      this.fileProviders[fileName] = this.createFileProvider(fileName);
    }

    return this.fileProviders[fileName];
  }
}
