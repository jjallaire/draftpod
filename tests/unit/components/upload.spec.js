

import fs from 'fs'
import path from 'path'

import { handleCardpoolCsvUpload, handleCardpoolColl2Upload } from '@/components/navigator/cardpool/upload.js'

describe('Cardpool Uploads', () => {

  function dataToString(file) {
    let dataFilePath = path.resolve(__dirname, '../../data/upload/' + file);
    return fs.readFileSync(dataFilePath, 'UTF-8');
  }

  function testUploadSuccess(set, csvText, handler = handleCardpoolCsvUpload) {
    return new Promise(resolve => {
      handler(set, csvText, (cards, status) => {
        expect(status.success.length > 1);
        expect(cards.length).toBeGreaterThan(1);
        resolve();
      });
    });
  }

  function testUploadError(set, csvText, matchError, handler = handleCardpoolCsvUpload) {
    return new Promise(resolve => {
      handler(set, csvText, (cards, status) => {
        expect(status.error.length > 1);
        if (status.error.length > 0)
          expect(status.error[0]).toContain(matchError);
        resolve();
      });
    });
  }

  test('reads decked builder csv upload', () => {
    return testUploadSuccess('grn', dataToString('grn.csv'));
  });

  test('reads decked builder yaml file upload', () => {
    return testUploadSuccess('rna', dataToString('rna.coll2'), handleCardpoolColl2Upload);
  });

  test('reads deckbox csv upload', () => {
    return testUploadSuccess('rna', dataToString('rna-deckbox.csv'));
  });

  test('provides error for invalid decked builder yaml', () => {
    return testUploadError('rna', '', 'Error parsing collection file', handleCardpoolColl2Upload);
  });

  test('provides error for invalid structure in  decked builder yaml', () => {
    return testUploadError('rna', dataToString('rna-invalid.coll2'), 'was not a valid Decked Builder collection', handleCardpoolColl2Upload);
  });

  test('provides error for invalid csv', () => {
    return testUploadError('grn', '', 'could not be parsed');
  });

  test('provides error for no id field', () => {
    return testUploadError('grn', dataToString('grn-no-id.csv'), 'does not have an id field');
  });

  test('provides error for no quantity field', () => {
    return testUploadError('grn', dataToString('grn-no-quantity.csv'), 'does not have a quantity field');
  });

  test('provides error for no cards from set', () => {
    return testUploadError('rna', dataToString('grn.csv'), 'does not contain cards from');
  });

  test('provides error for not enough cards from set', () => {
    return testUploadError('grn', dataToString('grn-not-enough-cards.csv'), 'uploaded file has only');
  });

});

