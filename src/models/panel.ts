import { PanelStatus } from "./panel-status";

export interface Panel {
  queueId: number;
  queueIndex: number;
  id: number;
  fileName: string;
  color: string;
  assetId: string;
  status: PanelStatus;
}


