const express = require('express')
const puppeteer = require('puppeteer')
const pug = require('pug')
const path = require('path')

const steps = [
  {label: 'Page Loaded', image: null},
  {label: 'Clicked on Add Widget Button', image: null},
]
const url = process.env.URL_TO_PUPPET || 'https://min-hooks-goatstone.appspot.com'
let browser
const app = express()
app.set("view engine", "pug");

async function getPage () {
  browser = await puppeteer.launch({
    args: ['--no-sandbox']
  });
  const browserPage = await browser.newPage();
  await browserPage.goto(url);
  return browserPage
}
// page = browserPage(browser, url)
// page.getPageImage() returns string
app.use(
  express.static(path.join(__dirname, 'static'))
)
app.use(async (req, res) => {

  const browserPage = await getPage()

  // 1) load page
  steps[0].image = (await browserPage.screenshot()).toString('base64')

  // 2) click on add widget button
  await browserPage.click('button.add-widget')
  steps[1].image = (await browserPage.screenshot()).toString('base64')

  // END the browser session
  await browser.close()

  // set up and send HTML to the browser
  const compiledFunction = await pug.compileFile('src/views/page.pug')

  res.send(compiledFunction({
    pageTitle: 'puppeteer results',
    runDate: new Date(),
    imageString: steps[0].image,
    imageString2: steps[1].image,
    steps,
  }));
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
