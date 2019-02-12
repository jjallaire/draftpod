module.exports = {
  'navigating to drafts from the home page': function(browser) {
    browser
      .url('http://localhost:8080')
      .waitForElementVisible('.draftpod-start-draft', 2000)
      .click('.draftpod-start-draft')
      .assert.urlContains('/draft')
      .waitForElementVisible('#start-draft', 2000)
      .end();
  },


  
}

