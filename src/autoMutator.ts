import { Logger } from "./logger";
import { ConsoleLogger } from "./loggers/consoleLogger";
import { MutationsApplier } from "./types/mutationsApplier";
import { FileMutationsApplier } from "./mutationsAppliers/fileMutationsApplier";
import { MutationsProvider, MutationsWave } from "./mutationsProvider";
import { MutationRunSettings } from "./runMutations";

/**
 * Settings to initialize a new AutoMutator.
 */
export type AutoMutatorSettings = MutationRunSettings;

/**
 * Runs waves of file mutations.
 *
 * @deprecated   Use `runMutations` from ./runMutations instead.
 */
export class AutoMutator {
  /**
   * Generates output messages for significant operations.
   */
  private readonly logger: Logger;

  /**
   * Applies individual waves of file mutations.
   */
  private readonly mutationsApplier: MutationsApplier;

  /**
   * Provides waves of file mutations.
   */
  private readonly mutationsProvider: MutationsProvider;

  /**
   * Initializes a new instance of the AutoMutator class.
   *
   * @param settings   Settings to be used for initialization.
   */
  public constructor(settings: AutoMutatorSettings) {
    this.logger = settings.logger || new ConsoleLogger();
    this.mutationsApplier =
      settings.mutationsApplier ||
      new FileMutationsApplier({
        logger: this.logger,
      });
    this.mutationsProvider = settings.mutationsProvider;
  }

  /**
   * Runs waves of file mutations.
   *
   * @returns A Promise for the waves completing.
   */
  public async run(): Promise<void> {
    while (true) {
      const mutationsWave: MutationsWave =
        await this.mutationsProvider.provide();
      if (!mutationsWave.fileMutations) {
        break;
      }

      this.logger.onWaveBegin(mutationsWave);
      await this.mutationsApplier.apply(mutationsWave.fileMutations);
      this.logger.onWaveEnd(mutationsWave);
    }
  }
}
