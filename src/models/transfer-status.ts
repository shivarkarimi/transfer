
export enum TransferStatus {
  UNSUPPORTED,      // unsupported file extension
  ERROR,            // Import/download error for any reason 
  TransferType,     // Download / UPLOAD
  RETRY,            // when users clicks on the retry button(will be used for further checking in the code)
  LOADED,           // Has been added to the ingest list
  WAITING,          // When PAUSED
  UPLOADING,        // Transfer Helper sending the Item the server
  Processing,       // Server received the file from Transfer Helper and creating the Assets ?
  DONE              // everything is completed, upload, processing ...
}
