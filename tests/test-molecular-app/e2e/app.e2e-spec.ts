import { TestMolecularAppPage } from './app.po';

describe('test-molecular-app App', () => {
  let page: TestMolecularAppPage;

  beforeEach(() => {
    page = new TestMolecularAppPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!!');
  });
});
