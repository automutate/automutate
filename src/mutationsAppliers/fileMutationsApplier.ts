import * as path from "path";

import { IFileProvider } from "../fileProvider";
import { FileProviderFactory } from "../fileProviderFactory";
import { LocalFileProvider } from "../fileProviders/localFileProvider";
import { ILogger } from "../logger";
import { MutationsApplier } from "../mutationsApplier";
import { MutatorFactory } from "../mutatorFactory";
import { MutatorSearcher } from "../mutatorSearcher";

/**
 * Settings to apply individual waves of file mutations to local files.
 */
export interface IFileMutationsApplierSettings {
    /**
     * Generates output messages for significant operations.
     */
    logger: ILogger;

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
    public constructor(settings: IFileMutationsApplierSettings) {
        super({
            fileProviderFactory: new FileProviderFactory(
                (fileName: string): IFileProvider => new LocalFileProvider(fileName)),
            logger: settings.logger,
            mutatorFactory: new MutatorFactory(
                new MutatorSearcher([
                    path.join(__dirname, "../../lib/mutators"),
                    ...(settings.mutatorDirectories || []),
                ]),
                settings.logger),
        });
    }
}
