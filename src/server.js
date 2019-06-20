const express = require('express')
const puppeteer = require('puppeteer')
const pug = require('pug')

const app = express()

const url = 'https://goatstone-clp-2019.appspot.com/'
const url2 = 'http://localhost:3000'

app.use(async (req, res) => {

  const browser = await puppeteer.launch({
    args: ['--no-sandbox']
  });
  const page = await browser.newPage();
  await page.goto(url);
  const imageBuffer = await page.screenshot();
  browser.close();

  // res.set('Content-Type', 'image/png');
  // res.send(imageBuffer);
  // res.send('imageBuffer');

const fn  = pug.compile('abc abc', {})
const html = fn({})
pug.render('abc', {}) 

// res.set('Content-Type', 'image/png');
  // res.send('xxxxxxxxxxxxxxxxxxxx');
});

// const port = process.env.PORT || 8080
port = 8080
const server = app.listen(port, err => {
  if (err) return console.error(err);
  const port = server.address().port;
  console.info(`App listening on port ${port}`);
});

/*
(async () => {
  const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] })
  const page = await browser.newPage()
  await page.goto(url);

  const rootElement = await page.$('#root')

  // check the text of the header element
  const headerInnerText = await rootElement.$eval('header', node => ({ innerText: node.innerText }))
  console.log('header text', headerInnerText)

  // check the adding of a widget name
  const addWidgetButton = await page.$('button.add-widget')

  let widgetManageList = await rootElement.$eval('.widget-manage ul', node => ({ length: node.children.length }))
  console.log('widget manage list length', widgetManageList.length)

  // user clicks button to add an element
  await addWidgetButton.click()
  console.log('button clicked')

  widgetManageList = await rootElement.$eval('.widget-manage ul', node => ({ length: node.children.length }))
  console.log('widget manage list length', widgetManageList.length)

  await browser.close()
})()
*/
// function delayPromise(msg) {
//   return new Promise((res, rej) => {
//     setTimeout(function () {
//       res("Success!" + msg)
//     }, 1250)
//   })
// }
// const a = await delayPromise('xxxx')
// console.log('a:', a)
