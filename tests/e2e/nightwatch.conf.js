module.exports = {
  src_folders: ['tests/e2e/specs'],
  output_folder: 'tests/e2e/reports',
  selenium: {
    start_process: true,
    server_path: require('selenium-server').path,
    host: '127.0.0.1',
    port: 4444,
    cli_args: {
      'WebDriver.chrome.driver': require('chromedriver').path
    }
  },
  test_settings: {
    chrome: {
      desiredCapabilities: {
        browserName: 'chrome'
      }
    }
  }
}
