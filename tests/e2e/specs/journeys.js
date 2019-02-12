module.exports = {
  'sanity test': function(browser) {
    browser
      .url('http://localhost:8080')
      .waitForElementVisible('.draftpod-start-draft', 2000)
      .end();
  }
}
