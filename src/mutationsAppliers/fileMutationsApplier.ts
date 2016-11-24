import * as path from "path";

import { ILogger } from "../logger";
import { FileProviderFactory } from "../fileProviderFactory";
import { IFileProvider } from "../fileProvider";
import { ILocalFileSettings, LocalFileProvider } from "../fileProviders/localFileProvider";
import { MutationsApplier } from "../mutationsApplier";
import { MutatorFactory } from "../mutatorFactory";
import { MutatorSearcher } from "../mutatorSearcher";

/**
 * Settings to apply individual waves of file mutations to local files.
 */
export interface IFileMutationSettings {
    /**
     * Settings for manipulating local files.
     */
    files?: ILocalFileSettings;

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
     * @param logger   Generates output messages for significant operations.
     * @param fileSettings   Settings for manipulating local files.
     */
    public constructor(logger: ILogger, settings: IFileMutationSettings = {}) {
        super(
            new FileProviderFactory(
                (fileName: string): IFileProvider => new LocalFileProvider(fileName, settings.files || {})),
            new MutatorFactory(
                new MutatorSearcher([
                    path.join(__dirname, "../../lib/mutators"),
                    ...(settings.mutatorDirectories || [])
                ]),
                logger));
    }
}
