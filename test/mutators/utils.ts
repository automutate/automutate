import path from "path";

export const getMetaUrlDirname = (url: string) =>
  path.dirname(url.replace("file://", ""));
