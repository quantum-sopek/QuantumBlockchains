export interface Block {
  index: number;
  previousBlockHash: string;
  data: string;
  timestamp: number;
  hash: string
}
