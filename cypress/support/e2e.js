// ***********************************************************
// This example support/e2e.js is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************
console.log("Loaded e2e.js")
// Import commands.js using ES2015 syntax:
import './commands'
import '@shelex/cypress-allure-plugin';
import 'cypress-file-upload';
// Note: fs operations moved to cypress.config.js setupNodeEvents for Node.js context

// Log network failures
Cypress.on('fail', (error) => {
  const logMessage = `Failure: ${error.message}`;
  console.log(logMessage);
  throw error;
});

beforeEach(() => {
  cy.window().then((win) => {
    // Disable the app's logger in Cypress to prevent interference
    if (win.logger) {
      win.logger.error = () => {};
      win.logger.failed = () => {};
      win.logger.capture = () => {};
    }
    // Also disable window.onerror to prevent alerts
    win.onerror = () => false;
  });

  // Temporary debug: Compare API speed
  cy.intercept('/api/**', (req) => {
    const logMessage = `API called: ${req.url}`;
    console.log(logMessage);
  });
});

afterEach(function () {
  if (this.currentTest.state === 'skipped') {
    console.warn('❌ Skipped test:', this.currentTest.title);
  }
});
export const testLogs = [];
export function logStep(...args) {
  testLogs.push(args.join(' '));
}
Cypress.on('test:before:run', (test) => {
  testLogs.length = 0;
  logStep('Test started:', test.title);
});

afterEach(function () {
  if (testLogs.length) {
    logStep('Test Status:', this.currentTest.state);
      cy.task('saveLogs', {
        testName: this.currentTest.title,
        logs: testLogs
      });
    }
});
Cypress.on('uncaught:exception', (err, runnable) => {
  if (err.message.includes('dcrGetRaphaelObj is not defined')) {
    return false; // prevents test failure
  }
});
Cypress.on('uncaught:exception', (err, runnable) => {
  // returning false here prevents Cypress from failing the test
  return false;
});