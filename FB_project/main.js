const puppeteer = require('puppeteer');
const fs = require('fs/promises');
const cron = require('node-cron');

async function start() {

    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    await page.goto('XXXXX');

    await page.type('input[name="email"]', 'XXXXX');
    await page.type('input[name="password"]', 'XXXXX');

    await Promise.all([page.click('.form-group button'), page.waitForNavigation({waitUntil: 'networkidle0'})]);

    await Promise.all([page.click('.mobile-menu-button')]);
    const fundData = await page.$$eval('.nav-user-funds', (text) => {
        return text.map(el => el.textContent);
    });

    console.log(`'Some: '${fundData[0]}`);

    const primaryInvest = 'XXXXX';
    const secondaryInvest = 'XXXXX';
    const filtersList = 'XXXXX';

    await page.goto(`${primaryInvest}`, {waitUntil: "networkidle0"});
    await page.goto(`${secondaryInvest}`, {waitUntil: "networkidle0"});
    await page.goto(`${filtersList}`, {waitUntil: "networkidle0"});

    await page.$eval('input[name="interest_rate_from"]', el => el.value = 19);
    await page.$eval('input[name="interest_rate_to"]', el => el.value = 40);
    await page.$eval('input[name="discount_to"]', el => el.value = -99);
    await page.$eval('input[name="discount_from"]', el => el.value = -1);
    await page.$eval('input[name="overdue_days_from"]', el => el.value = 0);
    await page.$eval('input[name="overdue_days_to"]', el => el.value = 0);

    const buttonFiltersConfirm = await page.waitForSelector(".apply-filters");

    await page.evaluate((buttonFiltersConfirm) => {
        buttonFiltersConfirm.click();
    }, buttonFiltersConfirm);

    await page.setViewport({width: 1280, height: 1920});

    setTimeout(async () => {
        const discountData = await page.$$eval('.table_discount', (text) => {
            return text.map(el => el.textContent);
        });

        const interestData = await page.$$eval('.table_interest', (text) => {
            return text.map(el => el.textContent);
        });

        const leftPaymentData = await page.$$eval('.table_principal_outstanding', (text) => {
            return text.map(el => el.textContent);
        });

        if (leftPaymentData.length > 1) {
            let data = '';
            for (let i = 0; i < leftPaymentData.length; i++) {
                data += discountData[i] + ' | ' + interestData[i] + ' | ' + leftPaymentData[i] + '<br>';
            }

            const nodemailer = require('nodemailer');
            const transporter = nodemailer.createTransport({
                host: 'smtp.gmail.com',
                port: 587,
                tls: {
                    rejectUnauthorized: false
                },
                auth: {
                    user: 'XXXXX',
                    pass: 'XXXXX',
                },
            });

            transporter.sendMail(
                {
                    from: 'XXXXX',
                    to: 'XXXXX',
                    subject: 'Subject',
                    html: `<p> ${data} </p>`
                },
                (error, info) => {
                    console.log(
                        'Attempted to send to ...'
                    );
                    if (error) {
                        console.error('Error sending email');
                        console.error(error);
                    } else {
                        console.info('email sent: ' + info);
                    }
                }
            )
        }

        await browser.close();

    }, 5000);
}

cron.schedule("*/10 * * * *", start);