
const filtrarFile = require('./filtrarFile.js');
const filtrarFileCaract = require('./filtrarFileCaract.js');

describe('filtrarFile function', () => {
    it('correctly separates CSV data into lines and column headers', () => {
        // Mock CSV content
        const content = `Name;Age;Country
            John;30;USA
            Alice;25;UK
        `;

        // Mock console.log
        const originalConsoleLog = console.log;
        console.log = jest.fn();

        // Call the function
        filtrarFile(content);

        // Expect console.log to be called with the correct column headers
        expect(console.log).toHaveBeenCalledWith(['Name', 'Age', 'Country']);

        // Restore console.log
        console.log = originalConsoleLog;
    });

    it('handles null content', () => {
        // Mock console.log
        const originalConsoleLog = console.log;
        console.log = jest.fn();

        // Call the function with null content
        filtrarFile(null);

        // Expect console.log not to be called
        expect(console.log).not.toHaveBeenCalled();

        // Restore console.log
        console.log = originalConsoleLog;
    });
});

describe('filtrarFileCaract function', () => {
    it('correctly processes CSV content', () => {
        // Mock CSV content
        const content = `Name;Age;Country
            John;30;USA
            Alice;25;UK
        `;

        // Mock console.log
        const originalConsoleLog = console.log;
        console.log = jest.fn();

        // Call the function
        filtrarFileCaract(content);

        // Expect console.log to be called with the correct column headers
        expect(console.log).toHaveBeenCalledWith(['John;30;USA']); // First line after splitting

        // Expect columns to be correctly extracted
        expect(columnsCaracterizacaoSalas).toEqual(['Name', 'Age', 'Country']);


    });

    // Add more test cases as needed
});

const { tipoDeInputASerCriado } = require('./tipoDeInput');

describe('tipoDeInputASerCriado', () => {
  test('returns "time" for columns containing "hora"', () => {
    const result = tipoDeInputASerCriado('Hora de Início');
    expect(result).toBe('time');
  });

  test('returns "date" for columns containing "data"', () => {
    const result = tipoDeInputASerCriado('Data de Nascimento');
    expect(result).toBe('date');
  });

  test('returns "text" for columns not containing "hora" or "data"', () => {
    const result = tipoDeInputASerCriado('Nome Completo');
    expect(result).toBe('text');
  });

  test('is case-insensitive', () => {
    const result1 = tipoDeInputASerCriado('HORA DE TÉRMINO');
    const result2 = tipoDeInputASerCriado('DATA DE INGRESSO');
    expect(result1).toBe('time');
    expect(result2).toBe('date');
  });
});


const { hasData, hasHour } = require('./temDataEHora');

describe('hasData', () => {
  test('returns true for columns containing "data"', () => {
    const result = hasData('Data de Nascimento');
    expect(result).toBe(true);
  });

  test('returns false for columns not containing "data"', () => {
    const result = hasData('Nome Completo');
    expect(result).toBe(false);
  });

  test('is case-insensitive', () => {
    const result = hasData('DATA DE INGRESSO');
    expect(result).toBe(true);
  });
});

describe('hasHour', () => {
  test('returns true for columns containing "hora"', () => {
    const result = hasHour('Hora de Início');
    expect(result).toBe(true);
  });

  test('returns false for columns not containing "hora"', () => {
    const result = hasHour('Nome Completo');
    expect(result).toBe(false);
  });

  test('is case-insensitive', () => {
    const result = hasHour('HORA DE TÉRMINO');
    expect(result).toBe(true);
  });
});

const { minMaxFilterFunction } = require('./minMax');

describe('minMaxFilterFunction', () => {
  test('returns true if rowValue is within the range', () => {
    const headerValue = { start: 10, end: 20 };
    const rowValue = 15;
    const result = minMaxFilterFunction(headerValue, rowValue);
    expect(result).toBe(true);
  });

  test('returns true if rowValue is equal to the start value', () => {
    const headerValue = { start: 10, end: 20 };
    const rowValue = 10;
    const result = minMaxFilterFunction(headerValue, rowValue);
    expect(result).toBe(true);
  });

  test('returns true if rowValue is equal to the end value', () => {
    const headerValue = { start: 10, end: 20 };
    const rowValue = 20;
    const result = minMaxFilterFunction(headerValue, rowValue);
    expect(result).toBe(true);
  });

  test('returns false if rowValue is outside the range', () => {
    const headerValue = { start: 10, end: 20 };
    const rowValue = 5;
    const result = minMaxFilterFunction(headerValue, rowValue);
    expect(result).toBe(false);
  });

  test('returns true if rowValue is not provided', () => {
    const headerValue = { start: 10, end: 20 };
    const rowValue = null;
    const result = minMaxFilterFunction(headerValue, rowValue);
    expect(result).toBe(true);
  });
});

const { handleFicheiroSalas } = require('./handleFicheiroSalas');

describe('handleFicheiroSalas', () => {
  test('reads the file content and calls filtrarFileCaracterizacaoSalas', () => {
    const mockFile = new File(['file content'], 'example.txt', { type: 'text/plain' });
    const mockEvent = { target: { files: [mockFile] } };

    const mockFileReader = {
      readAsText: jest.fn(),
      result: 'file content',
      onload: null,
      onerror: null,
    };

    jest.spyOn(global, 'FileReader').mockImplementation(() => mockFileReader);

    const mockFilterFunction = jest.fn();
    jest.mock('./handleFicheiroSalas', () => ({
      filtrarFileCaracterizacaoSalas: mockFilterFunction,
    }));

    handleFicheiroSalas(mockEvent);

    expect(mockFileReader.readAsText).toHaveBeenCalledWith(mockFile, 'utf-8');

    mockFileReader.onload();
    expect(mockFilterFunction).toHaveBeenCalledWith('file content');
  });

  test('logs an error if there is an error reading the file', () => {
    const mockFile = new File(['file content'], 'example.txt', { type: 'text/plain' });
    const mockEvent = { target: { files: [mockFile] } };

    const mockFileReader = {
      readAsText: jest.fn(),
      result: 'file content',
      onload: null,
      onerror: null,
    };

    jest.spyOn(global, 'FileReader').mockImplementation(() => mockFileReader);

    const consoleSpy = jest.spyOn(console, 'error');

    handleFicheiroSalas(mockEvent);

    mockFileReader.onerror();
    expect(consoleSpy).toHaveBeenCalledWith('Error reading the file');
  });
});

const { handleFicheiroUpload } = require('./handleFicheiroUpload');

describe('handleFicheiroUpload', () => {
  test('reads the file content and calls filtrarFile', () => {
    const mockFile = new File(['file content'], 'example.txt', { type: 'text/plain' });
    const mockEvent = { target: { files: [mockFile] } };

    const mockFileReader = {
      readAsText: jest.fn(),
      result: 'file content',
      onload: null,
      onerror: null,
    };

    jest.spyOn(global, 'FileReader').mockImplementation(() => mockFileReader);

    const mockFilterFunction = jest.fn();
    jest.mock('./handleFicheiroUpload', () => ({
      filtrarFile: mockFilterFunction,
    }));

    handleFicheiroUpload(mockEvent);

    expect(mockFileReader.readAsText).toHaveBeenCalledWith(mockFile, 'utf-8');

    mockFileReader.onload();
    expect(mockFilterFunction).toHaveBeenCalledWith('file content');
  });

  test('logs an error if there is an error reading the file', () => {
    const mockFile = new File(['file content'], 'example.txt', { type: 'text/plain' });
    const mockEvent = { target: { files: [mockFile] } };

    const mockFileReader = {
      readAsText: jest.fn(),
      result: 'file content',
      onload: null,
      onerror: null,
    };

    jest.spyOn(global, 'FileReader').mockImplementation(() => mockFileReader);

    const consoleSpy = jest.spyOn(console, 'error');

    handleFicheiroUpload(mockEvent);

    mockFileReader.onerror();
    expect(consoleSpy).toHaveBeenCalledWith('Error reading the file');
  });
});