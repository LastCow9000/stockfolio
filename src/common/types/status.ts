import { COMMAND, FINAL_VIDEO, VIDEO } from '../constants/status';

export type VideoStatus = (typeof VIDEO)[keyof typeof VIDEO];

export type CommandStatus = (typeof COMMAND)[keyof typeof COMMAND];

export type FinalVideoStatus = (typeof FINAL_VIDEO)[keyof typeof FINAL_VIDEO];
