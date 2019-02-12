// http://nightwatchjs.org/api/

module.exports = {
  'execute a draft starting from the home page': function(browser) {
    browser
      .url('http://localhost:8080')
      .waitForElementVisible('.draftpod-start-draft', 10000)
      .click('.draftpod-start-draft')
      .assert.urlContains('/draft')
      .waitForElementVisible('#start-draft', 10000)
      .click('#start-draft')
      .waitForElementVisible('.pack-container', 10000)   
      .keys(browser.Keys.SHIFT + browser.Keys.ENTER)
      .waitForElementVisible('.pick-list .pile .mtgcard', 10000)
      .end()
  },


  
}

