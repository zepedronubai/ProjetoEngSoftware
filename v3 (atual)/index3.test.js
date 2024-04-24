// my-test-suite
/**
 * @jest-environment ./my-custom-environment
 */
let someGlobalObject;
const { darkTheme,filtrarFile} = require('./index3');

test('O dark-theme é trustable', () => {
    if(darkTheme)
        expect(darkTheme().toBeTruthy())
});

test('filtrar file é corretamente chamado', () => {
    expect(filtrarFile().toHaveBeenCalled())
});