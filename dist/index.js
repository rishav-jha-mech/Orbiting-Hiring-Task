"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const puppeteer_1 = __importDefault(require("puppeteer"));
const fs_1 = __importDefault(require("fs"));
(async () => {
    const browser = await puppeteer_1.default.launch({ headless: false });
    const page = await browser.newPage();
    let eventData = [];
    await page.goto('https://www.meetup.com/find');
    async function scrollPage() {
        await page.evaluate(() => {
            window.scrollTo(0, document.body.scrollHeight);
        });
    }
    let itemsLength = 0;
    while (true) {
        await scrollPage();
        await page.waitForTimeout(6000);
        const newItems = await page.$$(`[data-element-name="categoryResults-eventCard"]`);
        if (newItems.length === itemsLength) {
            break;
        }
        itemsLength = newItems.length;
    }
    let elements = await page.$$(`[data-element-name="categoryResults-eventCard"]`);
    await Promise.all(elements.map(async (element) => {
        const event_time = await element.$eval('time', (el) => el.getAttribute('datetime'));
        const event_title = await element.$eval('h2', (el) => el.textContent);
        const event_description = await element.$eval('p', (el) => el.textContent);
        const event_location = await element.$eval('p', (el) => el.textContent);
        const event_images = await element.$eval('img', (el) => el.getAttribute('srcset'));
        const event_image = await element.$eval('img', (el) => el.getAttribute('src'));
        const event_link = await element.$eval('a', (el) => el.getAttribute('href'));
        const data = {
            time: event_time?.trim() ?? 'Unavailable',
            title: event_title?.trim() ?? 'Unavailable',
            description: event_description?.trim() ?? 'Unavailable',
            location: event_location?.trim() ?? 'Unavailable',
            images: Array.isArray(event_images) && event_images.length > 0 ? event_images : [],
            image: event_image?.trim() ?? 'Unavailable',
            link: event_link?.trim() ?? 'Unavailable',
        };
        eventData.push(data);
    }));
    fs_1.default.writeFile('events.json', JSON.stringify(eventData), (err) => {
        if (err) {
            throw err;
        }
        console.log("JSON data is saved.");
    });
    await browser.close();
})();
