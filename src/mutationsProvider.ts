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
     * Description of the wave, such as lint rule names.
     */
    descriptor: string;

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
