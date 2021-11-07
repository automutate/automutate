import { FileProvider } from "../fileProvider";
import { LocalFileProvider } from "../fileProviders/localFileProvider";
import {
  MutationsApplier,
  MutationsApplierSettings,
} from "../types/mutationsApplier";
import { MutatorFactory } from "../mutatorFactory";
import { CachingFileProviderFactory } from "../fileProviderFactories/cachingFileProviderFactory";
import { CommonJSMutatorSearcher } from "../mutatorSearchers/commonJSMutatorSearcher";

/**
 * Settings to apply individual waves of file mutations to local files.
 */
export interface FileMutationsApplierSettings extends MutationsApplierSettings {
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
      fileProviderFactory:
        settings.fileProviderFactory ??
        new CachingFileProviderFactory(
          (fileName: string): FileProvider => new LocalFileProvider(fileName)
        ),
      logger: settings.logger,
      mutatorFactory:
        settings.mutatorFactory ??
        new MutatorFactory(
          new CommonJSMutatorSearcher(settings.mutatorDirectories ?? []),
          settings.logger
        ),
    });
  }
}
