import * as path from "path";

import { FileProvider } from "../types/fileProvider";
import { LocalFileProvider } from "../fileProviders/localFileProvider";
import { MutatorFactory } from "../mutatorFactory";
import { CachingFileProviderFactory } from "../fileProviderFactories/cachingFileProviderFactory";
import { CommonJSMutatorSearcher } from "../mutatorSearchers/commonJSMutatorSearcher";
import { Logger } from "../types/logger";
import { FileProviderFactory } from "../types/fileProviderFactory";
import { MutationsApplier } from "../types/mutationsApplier";
import { FileMutations } from "../mutationsProvider";
import { Mutation } from "../types/mutation";
import { orderMutationsLastToFirstWithoutOverlaps } from "../ordering";

/**
 * Settings to initialize a new FileMutationsApplier.
 */
export interface FileMutationsApplierSettings {
  /**
   * Creates file providers for files.
   */
  fileProviderFactory?: FileProviderFactory;

  /**
   * Generates output messages for significant operations.
   */
  logger: Logger;

  /**
   * Creates mutators for mutations.
   */
  mutatorFactory?: MutatorFactory;
}

/**
 * Applies individual waves of file mutations to local files.
 */
export class FileMutationsApplier implements MutationsApplier {
  /**
   * Creates file providers for files.
   */
  private readonly fileProviderFactory: FileProviderFactory;

  /**
   * Generates output messages for significant operations.
   */
  private readonly logger: Logger;

  /**
   * Creates mutators for mutations.
   */
  private readonly mutatorFactory: MutatorFactory;

  /**
   * Initializes a new instance of the FileMutationsApplier class.
   *
   * @param settings   Settings to be used for initialization.
   */
  public constructor(settings: FileMutationsApplierSettings) {
    this.fileProviderFactory =
      settings.fileProviderFactory ??
      new CachingFileProviderFactory(
        (fileName: string): FileProvider => new LocalFileProvider(fileName)
      );
    this.logger = settings.logger;
    this.mutatorFactory =
      settings.mutatorFactory ??
      new MutatorFactory(
        new CommonJSMutatorSearcher([
          path.join(__dirname, "../../lib/mutators"),
        ]),
        settings.logger
      );
  }

  /**
   * Applies an iteration of file mutations.
   *
   * @param mutations   Mutations to be applied to files.
   * @returns A Promise for the file mutations being applied.
   */
  public async apply(mutations: FileMutations): Promise<void> {
    await Promise.all(
      Object.keys(mutations).map(async (fileName: string): Promise<void> => {
        await this.applyFileMutations(fileName, mutations[fileName]);
      })
    );

    this.logger.onComplete();
  }

  /**
   * Applies a file's mutations.
   *
   * @param fileName   Name of the file.
   * @param mutations   Mutations to be applied to the file.
   * @returns A Promise for the result of the file's mutations.
   */
  public async applyFileMutations(
    fileName: string,
    mutations: ReadonlyArray<Mutation>
  ): Promise<string> {
    const mutationsOrdered =
      orderMutationsLastToFirstWithoutOverlaps(mutations);
    const fileProvider = this.fileProviderFactory.generate(fileName);
    let fileContents = await fileProvider.read();

    for (const mutation of mutationsOrdered) {
      fileContents = this.mutatorFactory.generateAndApply(
        fileContents,
        mutation
      );
      this.logger.onMutation(fileName, mutation);
    }

    await fileProvider.write(fileContents);

    return fileContents;
  }
}
