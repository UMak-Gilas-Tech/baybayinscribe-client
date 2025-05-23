import { Status } from "@/types/type.loading";

export type StorageState = {
  status: Status;

  uploadFile?: (
    request: Request,
    fileName: string,
    directory: string[]
  ) => Promise<string | undefined>;

  fetchFile?: (directory: string[]) => void;
  deleteFile?: (directory: string[]) => void;
};

