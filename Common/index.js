const puppeteer = require('puppeteer');
const fs = require('fs/promises');

async function start() {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto('https://books.toscrape.com/index.html');
    await page.screenshot({path:'test.png', fullPage: true});

    const bookNames = await page.evaluate(()=> {
        return Array.from(document.querySelectorAll('h3 a')).map(x => x.textContent);
    });
    await fs.writeFile('names.txt', bookNames.join('\r\n'));

    await page.click('.product_pod h3 a');

    const clickedData = await page.$$eval('.sub-header h2', (text)=>{
        return text.map(el => el.textContent);
    });
    for(const one of clickedData){
        const text = await one;
        console.log(text);
    }

    const photos = await page.$$eval('img', (imgs) => {
        return imgs.map(x => x.src)
    })

    for(const photo of photos){
        const imagepage = await page.goto(photo);
        await fs.writeFile(photo.split('/').pop(), await imagepage.buffer())
    }

    await browser.close();
}

start();