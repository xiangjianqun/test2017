describe('hooks', function () {
    var assert = require('assert');
    require("chromedriver");
    var webdriver = require('selenium-webdriver');
    var driver = new webdriver.Builder().forBrowser("chrome").build();
    var fs = require("fs")
    var MongoClient = require('mongodb').MongoClient
    const url = 'mongodb://192.168.24.129:27017/node_club_dev';

    let By = webdriver.By
    let user = new Date().valueOf()

    describe('test', function () {i
        this.timeout(60 * 1000)
        before(async function () {
            await driver.manage().window().maximize()
        });

        after(async function () {

            // await driver.quit();
        });

        beforeEach(function () {

            console.log("beforeeach")
        });

        afterEach(async function () {
            console.log("aftereach....")
            // // let user = new Date().valueOf()
            await driver.takeScreenshot().then(function (imagedata) {    // 截图
                return fs.writeFileSync("tupain/" + user + '.png', imagedata, 'base64')
            })
        });

        // test cases


        it('打开浏览器输入网址', async function () {
            await driver.get("http://192.168.24.129:3000/")
            driver.sleep(3000)
        });
        it('点击注册', async function () {

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

            });

        });

        // it('点击发布', async function () {

        // });


    });
    describe('登录功能', function () {
        it('打开首页', async () => {
            await driver.get('http://192.168.24.129:3000/');
        });
        it('点击登录按钮', async () => {
            await driver.findElement({ linkText: '登录' }).click();
        });
        it('输入用户名和密码', async () => {
            await driver.findElement({ id: 'name' }).sendKeys(user);
            await driver.findElement({ id: 'pass' }).sendKeys('123456');
        });
        it('点击登录', async () => {
            await driver.findElement(By.css("#signin_form > div.form-actions > input")).click();
        });

    });
})








