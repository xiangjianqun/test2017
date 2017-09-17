describe('注册', function () {
    var assert = require('assert');
    require('chromedriver');
    var webdriver = require('selenium-webdriver');
    var driver = new webdriver.Builder().forBrowser('chrome').build();
    var fs = require('fs');
    var MongoClient = require('mongodb').MongoClient;
    const url = 'mongodb://192.168.75.107:27017/node_club_dev';
    this.timeout(5000)
    before(function () {
    driver.manage().window().maximize();
    });
    after(function () {
    driver.close();
    });
    beforeEach(function () {
    // runs before each test in this block
    
    });
    afterEach(async function () {
    await driver.takeScreenshot().then(function (image) {
    var day = new Date().valueOf();
    fs.writeFileSync(day + '.png', image, 'base64')
    });
    });
    it('打开首页', async () => {
    await driver.get('http://192.168.75.107:3000/');
    });
    it('点击注册按钮', async () => {
    await driver.findElement({ linkText: '注册' }).click();
    });
    it('输入注册信息，修改数据库', async () => {
    let user = Date.now();
    await driver.findElement({ id: 'loginname' }).sendKeys(user);
    await driver.findElement({ id: 'pass' }).sendKeys('123456');
    await driver.findElement({ id: 're_pass' }).sendKeys('123456');
    await driver.findElement({ id: 'email' }).sendKeys(`${user}@domain.com`);
    await driver.findElement({ className: 'span-primary' }).submit().then(() => {
    MongoClient.connect(url, function (err, db) {
    assert.equal(null, err);
    console.log("Connected correctly to server");
    let collection = db.collection("users")
    collection.findOne({ name: `${user}` }, function (err, docs) {
    console.log(docs.name)
    assert.equal(err, null)
    assert.equal(`${user}`, docs.name)
    })
    collection.updateOne({ name: `${user}` }, { $set: { "active": true } }, function (err, docs) {
    assert.equal(null, err);
    // console.log(docs)
    })
    db.close();
    });
    })
    });
    })