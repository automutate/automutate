import { IFileProvider } from "./fileProvider";
import { IFileProviderFactory } from "./fileProviderFactory";
import { ILogger } from "./logger";
import { IMutation } from "./mutation";
import { IFileMutations } from "./mutationsProvider";
import { IMutatorFactory } from "./mutatorFactory";

/**
 * Settings to initialize a new IMutationsApplier.
 */
export interface IMutationsApplierSettings {
    /**
     * Creates file providers for files.
     */
    fileProviderFactory: IFileProviderFactory;

    /**
     * Generates output messages for significant operations.
     */
    logger: ILogger;

    /**
     * Creates mutators for mutations.
     */
    mutatorFactory: IMutatorFactory;
}

/**
 * Applies individual waves of file mutations.
 */
export interface IMutationsApplier {
    /**
     * Applies an iteration of file mutations.
     *
     * @param mutations   Mutations to be applied to files.
     * @returns A Promise for the file mutations being applied.
     */
    apply(mutations: IFileMutations): Promise<void>;

    /**
     * Applies a file's mutations.
     *
     * @param fileName   Name of the file.
     * @param mutations   Mutations to be applied to the file.
     * @returns A Promise for the result of the file's mutations.
     */
    applyFileMutations(fileName: string, mutations: IMutation[]): Promise<string>;
}

/**
 * Applies individual waves of file mutations.
 */
export class MutationsApplier implements IMutationsApplier {
    /**
     * Creates file providers for files.
     */
    private readonly fileProviderFactory: IFileProviderFactory;

    /**
     * Generates output messages for significant operations.
     */
    private readonly logger: ILogger;

    /**
     * Creates mutators for mutations.
     */
    private readonly mutatorFactory: IMutatorFactory;

    /**
     * Initializes a new instance of the MutationsApplier class.
     *
     * @param settings   Settings to be used for initialization.
     */
    public constructor(settings: IMutationsApplierSettings) {
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
    public async apply(mutations: IFileMutations): Promise<void> {
        await Promise.all(
            Object.keys(mutations)
                .map(async (fileName: string): Promise<void> => {
                    await this.applyFileMutations(fileName, mutations[fileName]);
                }));

        this.logger.onComplete();
    }

    /**
     * Applies a file's mutations.
     *
     * @param fileName   Name of the file.
     * @param mutations   Mutations to be applied to the file.
     * @returns A Promise for the result of the file's mutations.
     */
    public async applyFileMutations(fileName: string, mutations: IMutation[]): Promise<string> {
        const mutationsOrdered: IMutation[] = this.orderMutations(mutations);
        const fileProvider: IFileProvider = this.fileProviderFactory.generate(fileName);
        let fileContents: string = await fileProvider.read();

        for (const mutation of mutationsOrdered) {
            fileContents = this.mutatorFactory.generateAndApply(fileContents, mutation);
            this.logger.onMutation(fileName, mutation);
        }

        await fileProvider.write(fileContents);

        return fileContents;
    }

    /**
     * Orders a set of mutations last-to-first, without overlaps.
     *
     * @param mutations   Mutations to be applied to a file.
     * @returns The mutations in last-to-first order, without overlaps.
     */
    private orderMutations(mutations: IMutation[]): IMutation[] {
        const ordered: IMutation[] = [];
        let lastStart = Infinity;

        for (let i: number = mutations.length - 1; i >= 0; i -= 1) {
            const mutation: IMutation = mutations[i];
            if ((mutation.range.end || mutation.range.begin) > lastStart) {
                continue;
            }

            lastStart = mutation.range.begin;
            ordered.push(mutation);
        }

        return ordered.sort((a: IMutation, b: IMutation): number =>
            (b.range.end || b.range.begin) - (a.range.end || a.range.begin));
    }
}
