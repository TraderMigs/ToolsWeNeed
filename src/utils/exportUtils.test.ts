import { generateFilename } from './exportUtils';

describe('exportUtils', () => {
  describe('generateFilename', () => {
    it('should generate a filename with the correct format', () => {
      const toolName = 'test-tool';
      const format = 'pdf';
      const filename = generateFilename(toolName, format);
      
      // Check that the filename follows the expected pattern
      expect(filename).toMatch(/^toolsweneed-test-tool-\d{8}-\d{4}$/);
    });
  });
});