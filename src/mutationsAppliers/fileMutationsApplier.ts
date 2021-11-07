import { FileProvider } from "../fileProvider";
import { FileProviderFactory } from "../fileProviderFactory";
import { LocalFileProvider } from "../fileProviders/localFileProvider";
import { Logger } from "../logger";
import { MutationsApplier } from "../mutationsApplier";
import { MutatorFactory } from "../mutatorFactory";
import { MutatorSearcher } from "../mutatorSearcher";

/**
 * Settings to apply individual waves of file mutations to local files.
 */
export interface FileMutationsApplierSettings {
  /**
   * Generates output messages for significant operations.
   */
  logger: Logger;

  /**
   * Additional directories to search for mutators within.
   */
  mutatorDirectories?: string[];
}

/**
 * Applies individual waves of file mutations to local files.
 */
export class FileMutationsApplier extends MutationsApplier {
  /**
   * Initializes a new instance of the FileMutationsApplier class.
   *
   * @param settings   Settings to be used for initialization.
   */
  public constructor(settings: FileMutationsApplierSettings) {
    super({
      fileProviderFactory: new FileProviderFactory(
        (fileName: string): FileProvider => new LocalFileProvider(fileName)
      ),
      logger: settings.logger,
      mutatorFactory: new MutatorFactory(
        new MutatorSearcher(settings.mutatorDirectories || []),
        settings.logger
      ),
    });
  }
}
