import {
  file_between,
  is_file,
  is_mimes,
  max_file_size,
  min_file_size,
} from '../../src/rules';
// Mocking a File object for testing
const createFile = (name: any, size: any) => {
  const file = new File([], name, { type: 'text/plain' });
  Object.defineProperty(file, 'size', { value: size });
  return file;
};
describe('is_file', () => {
  it('should return true for File objects', () => {
    const file = new File(['file content'], 'file.txt', { type: 'text/plain' });
    expect(is_file(file).passes).toBe(true);
  });

  it('should return true for Blob objects', () => {
    const blob = new Blob(['blob content'], { type: 'text/plain' });
    expect(is_file(blob).passes).toBe(true);
  });

  it('should return false for non-File and non-Blob objects', () => {
    expect(is_file('file.txt').passes).toBe(false);
    expect(is_file({ name: 'file.txt', type: 'text/plain' }).passes).toBe(false);
    expect(is_file(null).passes).toBe(false);
    expect(is_file(undefined).passes).toBe(false);
    expect(is_file(123).passes).toBe(false);
    expect(is_file(true).passes).toBe(false);
    expect(is_file([]).passes).toBe(false);
    expect(is_file({}).passes).toBe(false);
    expect(is_file(() => {}).passes).toBe(false);
  });
});

describe('max_file_size', () => {
  test('should return true if file size is within the specified limit', () => {
    const file1KB = createFile('file1KB.txt', 1024); // 1KB
    const file5MB = createFile('file5MB.txt', 5 * 1024 * 1024); // 5MB
    const file10GB = createFile('file10GB.txt', 10 * 1024 * 1024 * 1024); // 10GB

    expect(max_file_size(file1KB, '2KB').passes).toBe(true);
    expect(max_file_size(file5MB, '10MB').passes).toBe(true);
    expect(max_file_size(file10GB, '20GB').passes).toBe(true);
    expect(max_file_size(file10GB, '10GB').passes).toBe(true);
    expect(max_file_size(file10GB, '10240MB').passes).toBe(true);
    expect(max_file_size(file10GB, '10485760KB').passes).toBe(true);
    expect(max_file_size(file10GB, '10737418240B').passes).toBe(true);
  });

  test('should throw an error for non-file inputs', () => {
    expect(max_file_size('not a file', '2KB').passes).toBe(false);
  });

  test('should throw an error for invalid size format', () => {
    const file1KB = createFile('file1KB.txt', 1024); // 1KB

    expect(() => max_file_size(file1KB, '2KB123')).toThrow(
      "Invalid size format. Please use valid format like '1KB', '1MB', etc.",
    );

    expect(() => max_file_size(file1KB, 'B')).toThrow(
      "Invalid size format. Please use valid format like '1KB', '1MB', etc.",
    );
    expect(() => max_file_size(file1KB, '10TB')).toThrow(
      "Invalid size format. Please use valid format like '1KB', '1MB', etc.",
    );
  });
});

describe('min_file_size', () => {
  const file = createFile('text.txt', 1024); // Create a sample File object for testing

  it('should return true for file with size greater than or equal to minSize', () => {
    const result1 = min_file_size(file, '1KB').passes;
    expect(result1).toBe(true);
  });

  it('should return false for file with size smaller than minSize', () => {
    const result2 = min_file_size(file, '1MB').passes;
    expect(result2).toBe(false);
  });

  it('should throw error for invalid minSize format', () => {
    // Test with an invalid minSize format
    expect(() => min_file_size(file, '1ABC')).toThrowError();
  });

  it('should return false for non-file input', () => {
    // Test with a non-file input
    expect(min_file_size('test', '1KB').passes).toBe(false);
  });
});

describe('file_between', () => {
  const file = createFile('text.txt', 1024); // Create a sample File object for testing

  it('should return true for file with size between min and max', () => {
    const result1 = file_between(file, '1KB, 2KB').passes;
    expect(result1).toBe(true);
  });

  it('should return false for file with size not between in min and max', () => {
    const result2 = file_between(file, '1MB, 2MB').passes;
    expect(result2).toBe(false);
  });
});

describe('is_mimes', () => {
  it('should return true for files with matching MIME types', () => {
    const file1 = new File([], 'file.txt', { type: 'text/plain' });
    const file2 = new File([], 'file2.pdf', { type: 'application/pdf' });

    expect(is_mimes(file1, '*.txt').passes).toBe(true);
    expect(is_mimes(file1, 'text/plain').passes).toBe(true);
    expect(is_mimes(file2, '*.pdf').passes).toBe(true);
    expect(is_mimes(file2, 'application/pdf').passes).toBe(true);
  });

  it('should return false for files with non-matching MIME types', () => {
    const file1 = new File([], 'file2.pdf', { type: 'application/pdf' }); // 1KB
    const file2 = createFile('file2.pdf', 2048); // 2KB
    expect(is_mimes(file1, 'image/jpeg').passes).toBe(false);
    expect(is_mimes(file2, '*.txt').passes).toBe(false);
    expect(is_mimes(file2, 'image/png').passes).toBe(false);
  });

  it('should handle wildcard (*) MIME type', () => {
    const file1 = createFile('file1.txt', 1024); // 1KB
    const file2 = createFile('file2.pdf', 2048); // 2KB
    expect(is_mimes(file1, '*').passes).toBe(true);
    expect(is_mimes(file2, '*').passes).toBe(true);
  });

  it('should handle MIME type groups', () => {
    const file1 = createFile('file1.txt', 1024); // 1KB

    const file2 = new File([], 'file2.jpg', { type: 'image/jpg' }); // 2KB

    expect(is_mimes(file1, 'text/*').passes).toBe(true);
    expect(is_mimes(file2, 'image/*').passes).toBe(true);
  });

  it('should handle multiple MIME types', () => {
    const file1 = createFile('file1.txt', 1024);

    const file2 = new File([], 'file2.pdf', { type: 'application/pdf' });

    expect(is_mimes(file1, '*.txt, text/plain').passes).toBe(true);
    expect(is_mimes(file2, '*.pdf, image/jpeg').passes).toBe(true);
  });

  it('should return false for non-File inputs', () => {
    expect(is_mimes('not a file', '*.txt').passes).toBe(false);
    expect(is_mimes(null, '*.pdf').passes).toBe(false);
    expect(is_mimes(undefined, 'image/jpeg').passes).toBe(false);
    expect(is_mimes(123, 'text/plain').passes).toBe(false);
    expect(is_mimes(true, 'application/pdf').passes).toBe(false);
    expect(is_mimes([], '*.txt').passes).toBe(false);
  });

  it('should throw an error for empty param', () => {
    const file = createFile('file.txt', 1024); // 1KB

    expect(() => is_mimes(file, '')).toThrowError();
  });
});
