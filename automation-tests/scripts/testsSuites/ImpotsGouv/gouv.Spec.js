/**
 * Author: TMO 2021-11-20
 */
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');

chai.use(chaiAsPromised);
const expect = chai.expect;

browser.ignoreSynchronization = true;

const utils = require('../../utils');
const init = require('../../init');

describe("Page de connexion", async () => {
	
	it("Lancement du navigateur et accès à l'url renseignée", async () => {
        await utils.pageAccess(init.impotsUrl);
    });
	
    /*it("Tests hardcodés", async () => {
        await element(by.css('a.pus-particulier')).click();
		await element(by.css('svg#patrimoine')).click();
		await element(by.cssContainingText('td', 'Déclarer mes revenus')).click();
		await browser.sleep(1000);
		await element(by.cssContainingText('a', 'Je déclare mes autres revenus')).click();
		await browser.sleep(1000);
		await element(by.css('input.search-input')).click();
		await browser.sleep(1000);
		await element(by.css('input.search-input')).sendKeys("Test terminé");
		await browser.sleep(5000);
    });*/

	it("Click onglet particulier", async () => {
		expect(await element(by.css('a.pus-particulier')).isPresent()).to.equal(true, "L'onglet 'particulier' n'a pa été trouvé");
		await element(by.css('a.pus-particulier')).click();
	});

	it("Click element patrimoine", async () => {
		expect(await element(by.css('svg#patrimoine')).isPresent()).to.equal(true, "L'élément 'patrimoine' n'a pas été trouvé");
		await element(by.css('svg#patrimoine')).click();
	});

	it("Accès à la délcaration 'Autres revenus'", async () => {
		expect(await element(by.cssContainingText('td', 'Déclarer mes revenus')).isPresent()).to.equal(true, "L'élément 'Déclarer mes revenus' n'a pas été trouvé");
		await element(by.cssContainingText('td', 'Déclarer mes revenus')).click();
		await browser.sleep(1000);

		expect(await element(by.cssContainingText('a', 'Je déclare mes autres revenus')).isPresent()).to.equal(true, "L'élément 'Je déclare mes autres revenus' n'a pas été trouvé");
		await element(by.cssContainingText('a', 'Je déclare mes autres revenus')).click();
		await browser.sleep(1000);
	});
	
    it("Test barre de recherche", async () => {
		expect(await element(by.css('input.search-input')).isPresent()).to.equal(true, "La barre de recherche n'a pas été trouvé");
		await element(by.css('input.search-input')).click();
		await browser.sleep(1000);

		await element(by.css('input.search-input')).sendKeys("Test terminé");
		await browser.sleep(5000);
    });
	
});