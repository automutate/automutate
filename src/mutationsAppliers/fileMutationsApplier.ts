import * as path from "path";

import { ILogger } from "../logger";
import { FileProviderFactory } from "../fileProviderFactory";
import { LocalFileProvider } from "../fileProviders/localFileProvider";
import { MutationsApplier } from "../mutationsApplier";
import { MutatorFactory } from "../mutatorFactory";
import { MutatorSearcher } from "../mutatorSearcher";

/**
 * Applies individual waves of file mutations to local files.
 */
export class FileMutationsApplier extends MutationsApplier {
    /**
     * Initializes a new instance of the FileMutationsApplier class.
     * 
     * @param logger   Generates output messages for significant operations.
     */
    public constructor(logger: ILogger) {
        super(
            new FileProviderFactory(fileName => new LocalFileProvider(fileName)),
            new MutatorFactory(
                new MutatorSearcher([
                    path.join(__dirname, "../../lib/mutators")
                ]),
                logger));
    }
}