const express = require('express')
const puppeteer = require('puppeteer')
const pug = require('pug')
const path = require('path')

const url = process.env.URL_TO_PUPPET || 'https://min-hooks-goatstone.appspot.com'
const app = express()
app.set("view engine", "pug");
app.use(
  express.static(path.join(__dirname, 'static'))
)
app.use(async (req, res) => {
  const browser = await puppeteer.launch({
    args: ['--no-sandbox']
  });
  const page = await browser.newPage();
  await page.goto(url);
  const imageBuffer = await page.screenshot();
  browser.close()

  // set up and send HTML to the browser
  const compiledFunction = await pug.compileFile('src/views/page.pug')
  let imageBufferBase64 = imageBuffer.toString('base64')
  const html = compiledFunction({
    pageTitle: 'puppeteer results',
    runDate: new Date(),
    imageString: imageBufferBase64,
  })
  res.send(html);
});

const port = process.env.PORT || 8080
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
