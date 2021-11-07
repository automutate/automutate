import { FileProvider } from "./fileProvider";
import { FileProviderFactory } from "./fileProviderFactory";
import { Logger } from "./logger";
import { Mutation } from "./mutation";
import { FileMutations } from "../mutationsProvider";
import { MutatorFactory } from "../mutatorFactory";
import { orderMutationsLastToFirstWithoutOverlaps } from "../ordering";

/**
 * Settings to initialize a new MutationsApplier.
 */
export interface MutationsApplierSettings {
  /**
   * Creates file providers for files.
   */
  fileProviderFactory: FileProviderFactory;

  /**
   * Generates output messages for significant operations.
   */
  logger: Logger;

  /**
   * Creates mutators for mutations.
   */
  mutatorFactory: MutatorFactory;
}

/**
 * Applies individual waves of file mutations.
 */
export class MutationsApplier {
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
   * Initializes a new instance of the MutationsApplier class.
   *
   * @param settings   Settings to be used for initialization.
   */
  public constructor(settings: MutationsApplierSettings) {
    this.logger = settings.logger;
    this.fileProviderFactory = settings.fileProviderFactory;
    this.mutatorFactory = settings.mutatorFactory;
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
    const mutationsOrdered: Mutation[] =
      orderMutationsLastToFirstWithoutOverlaps(mutations);
    const fileProvider: FileProvider =
      this.fileProviderFactory.generate(fileName);
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
