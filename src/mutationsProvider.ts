import { IMutation } from "./mutation";

/**
 * Mutations to be applied to files, keyed by file name.
 */
export interface IFileMutations {
    [i: string]: IMutation[];
}

/**
 * A wave of file mutations.
 */
export interface IMutationsWave {
    /**
     * Mutations to be applied to files, if any.
     */
    fileMutations?: IFileMutations;
}

/**
 * Provides waves of file mutations.
 */
export interface IMutationsProvider {
    /**
     * @returns A Promise for a wave of file mutations.
     */
    provide(): Promise<IMutationsWave>;
}
