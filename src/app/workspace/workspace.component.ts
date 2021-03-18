import { Component, Input } from '@angular/core';
import { Panel } from 'src/models/panel';
import { FileImportService } from 'src/services/file-import.service';

@Component({
  selector: 'app-workspace',
  templateUrl: './workspace.component.html',
  styleUrls: ['./workspace.component.scss']
})
export class WorkspaceComponent {
  panels: Panel[] = [];

  constructor(
    private fileImportService: FileImportService
  ) { }

  importFile(): void {
    const fileNames = [`${0}-${generateFileName()}`]
    this.fileImportService.import(fileNames);
  }
}

const generateFileName = () => Math.random().toString(36).substring(7)
