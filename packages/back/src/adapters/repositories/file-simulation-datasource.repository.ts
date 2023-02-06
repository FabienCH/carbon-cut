import * as fs from 'fs/promises';
import * as path from 'path';
import * as YAML from 'yaml';
import { SimulationDataSourceRepository, SimulationSectors } from '../../domain/ports/repositories/simulation-datasource.repository';
import { DataRecord } from '../../domain/types/data-record';

export class FileSimulationDataSourceRepository implements SimulationDataSourceRepository {
  async getBySector(sector: SimulationSectors): Promise<DataRecord> {
    const filesContent = await this.getFilesContent(sector);
    return this.parseFiles(filesContent);
  }

  private async getFilesContent(sector: SimulationSectors): Promise<Buffer[]> {
    const dirPath = path.join(__dirname, '../../../infrastructure/simulation-data', sector);
    const files = await fs.readdir(dirPath);

    const filesContent = files.flatMap(async (file) => {
      const filePath = path.join(dirPath, file);
      const stat = await fs.stat(filePath);
      if (stat.isDirectory()) {
        return;
      }
      return fs.readFile(filePath);
    });

    return await Promise.all(filesContent);
  }

  private async parseFiles(buffers: Buffer[]) {
    const filesContent = buffers.filter(Boolean).reduce((acc, fileContent) => {
      acc += fileContent.toString();
      return acc;
    }, '');

    return YAML.parse(filesContent);
  }
}
