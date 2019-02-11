

import fs from 'fs'
import path from 'path'

import { handleCardpoolCsvUpload } from '@/components/navigator/cardpool/upload.js'

describe('Cardpool Uploads', () => {

  function dataToString(file) {
    let dataFilePath = path.resolve(__dirname, '../../data/' + file);
    return fs.readFileSync(dataFilePath, 'UTF-8');
  }

  test('reads csv upload', () => {
    return new Promise(resolve => {
      handleCardpoolCsvUpload('grn', dataToString('GRNCube.csv'), (cards, status) => {
        expect(status.success.length > 1);
        expect(cards.length).toBeGreaterThan(1);
        resolve();
      });
    });

  });

});

