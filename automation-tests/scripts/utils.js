/**
 * Author: TMO 2021-11-25
 */
const until = protractor.ExpectedConditions;

const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const logReport = require('mochawesome-screenshots/logReport');

chai.use(chaiAsPromised);
const expect = chai.expect;
const _ = require('lodash');

const elementRepo = require('./elementRepository');
const path = require('path');

const fs = require('fs');
const csv = require('fast-csv');
const moment = require('moment');
const { element } = require('protractor');
browser.ignoreSynchronization = true;


// Accéder URL ciblée
async function pageAccess(envUrl) {
    await browser.manage().window().maximize();
    await browser.get(envUrl);
}

async function googleSearch(stringToSet) {

	let acceptConditions = await element(by.id('L2AGLb'))
	expect(await acceptConditions.isPresent()).to.equal(true, "Echec d'identification de l'élément 'button accept'");
	await acceptConditions.click();
	console.log("Clic effectué sur l'élément 'button accept'");
	await browser.sleep(500);

	let inputElement = await element(by.css('input.gLFyf'));
	expect(await inputElement.isPresent()).to.equal(true, "Echec d'identification de l'élément 'input'");
	await inputElement.click();
	console.log("Clic effectué sur l'élément 'input'");
	await browser.sleep(500);
	
	await inputElement.clear().sendKeys(stringToSet);
	console.log("Saisie de la chaîne de caractères '" + stringToSet + "' effectuée");
	//await browser.wait(until.textToBePresentInElementValue(inputElement, stringToSet), 3000, "Echec de saisie de la chaîne de caractères '" + stringToSet + "'");
	await browser.sleep(500);
	
	let dropdownString = await elementRepo.googleListPath.all(by.cssContainingText('span', stringToSet));
	console.log("Nombre de valeurs identifiées dans le menu déroulant : " + dropdownString.length);
	let displayedString = [], stringFound = false, elementTarget;
	for (var i = 0; i < dropdownString.length; i++) {
		displayedString[i] = await dropdownString[i].getText();
		console.log(displayedString[i]);
		if (displayedString[i] == stringToSet) {
			console.log("Chaîne de caractères '" + stringToSet + "' identifiée dans le menu déroulant");
			stringFound = true;
			elementTarget = dropdownString[i];
		}
	}
	
	if (stringFound) {
		await browser.actions().mouseMove(elementTarget).perform();
		await browser.sleep(500);
		console.log("Curseur positionné sur la valeur correspondante");
		await elementTarget.click();
		//await browser.actions().sendKeys(protractor.Key.ENTER).perform();
		await browser.sleep(500);
		console.log("Clic effectué sur la valeur correspondante");
	}
	expect(stringFound).to.equal(true, "Echec d'identification de la chaîne de caractères '" + stringToSet + "' dans le menu déroulant");
}

async function googleResult(stringTarget) {
	let divResult = await elementRepo.googleResultPath.all(by.css('div.g'));
	console.log("Nombre de résultats identifiés sur la page : " + divResult.length);
	if (divResult.length == 0) throw new Error("Aucun résultat identifié");
	let displayedResult = [], resultFound = false, elementTarget;
	for (var i = 0; i < divResult.length; i++) {
		displayedResult[i] = await divResult[i].element(by.css('a h3')).getText();
		console.log(displayedResult[i]);
		if (displayedResult[i] == stringTarget) {
			console.log("Résultat '" + stringTarget + "' identifié");
			resultFound = true;
			elementTarget = await divResult[i].element(by.css('a h3'));
		}
	}
	if (resultFound) {
		await elementTarget.click();
		await browser.sleep(500);
		console.log("Clic effectué sur le résultat");
	}
	expect(resultFound).to.equal(true, "Echec d'identification du résultat '" + stringTarget + "'");
}

async function wikipediaTabs(tabsData) {
	let nbExpectedTabs = tabsData.tabsDef.length;
	let tabToCheck = [];
    tabToCheck = tabsData.tabsDef.map(data => {
        return data.tabName;
    });
	
	// ONGLETS AFFICHES
	let tabDisplayed = [];
	let tabsGrid = await elementRepo.wikipediaRightTabs.all(by.css('li'));
	let nbDisplayedTabs = tabsGrid.length;	// Nombre d'onglets affichés
	console.log("Nombre d'onglets identifiés : " + nbDisplayedTabs)
	for (let i = 0; i < nbDisplayedTabs; i++) {
		tabDisplayed[i] = await tabsGrid[i].getText();
		//console.log(tabDisplayed[i]);
	}
	
	if (tabsData.matchingResult) {
        // Vérifier que l'ensemble des onglets affichés correspond RIGOUREUSEMENT à ceux attendus (ni plus, ni moins)
        let dataListRecognized = false;
		if (nbDisplayedTabs==nbExpectedTabs) {
			dataListRecognized = true;
			for (let i = 0; i < nbExpectedTabs; i++) {
				let dataIdentified = false;
				for (let j = 0; j < nbDisplayedTabs; j++) {
					if (!dataIdentified) {
						if (tabToCheck[i]==tabDisplayed[j]) dataIdentified = true;
					}
				}
				if (!dataIdentified) dataListRecognized = false;
			}
		}
		if (dataListRecognized) {
			console.log(nbDisplayedTabs + " onglets affichés qui correspondent bien à ceux attendus :");
			for (let i = 0; i < nbExpectedTabs; i++) console.log(">  "+tabToCheck[i]);
		} else {
			console.log(nbDisplayedTabs + " onglets affichés qui NE correspondent PAS aux " + nbExpectedTabs + " onglets attendus");
			expect(dataListRecognized).to.equal(true, nbDisplayedTabs + " onglets affichés qui NE correspondent PAS aux " + nbExpectedTabs + " onglets attendus");
		}
    }
	else {
		// Vérifier que chaque onglet renseigné est bien affiché
		for (let i = 0; i < nbExpectedTabs; i++) {
			let tabIdentified = false;
			for (let j = 0; j < nbDisplayedTabs; j++) {
				if (tabIdentified == false) {
					if (tabDisplayed[j] == tabToCheck[i]) {
						tabIdentified = true;
						console.log("Onglet '" + tabToCheck[i] + "' identifié avec succès");
					}
				}
			}
			if (tabIdentified == false) {
				console.log("Echec d'identification de l'onglet '" + tabToCheck[i] + "'");
				expect(tabIdentified).to.equal(true, "Echec d'identification de l'onglet '" + tabToCheck[i] + "'");
			}
		}
	}
	
	// ORDRE D'AFFICHAGE
    if (tabsData.checkTabsOrder) {
		let matchingTabsOrder = true;
		if (tabsData.matchingResult) {
			for (let i = 0; i < nbExpectedTabs; i++) {
				if (tabToCheck[i] != tabDisplayed[i]) matchingTabsOrder = false;
			}
		}
		else {
			var displayedTabSample = [], k = 0;	// Extraire de l'ensemble des onglets affichés ceux (l'échantillon affiché) qui 'matchent' avec les onglets à vérifier
			for (let i = 0; i < nbDisplayedTabs; i++) {
				for (let j = 0; j < nbExpectedTabs; j++) {
					if (tabDisplayed[i] == tabToCheck[j]) {	// Dans l'ensemble des onglets affichés, ceux qui ne font pas partie des onglets à vérifier seront exclus de 'displayedTabSample[]'
						displayedTabSample[k] = tabDisplayed[i];
						k = k + 1;
					}
				}
			}
			for (let i = 0; i < nbExpectedTabs; i++) {
				if (tabToCheck[i] != displayedTabSample[i]) matchingTabsOrder = false;
			}
		}
		if (matchingTabsOrder) {
			console.log("L'ordre d'affichage des onglets est bien respecté");
		}
		else {
			console.log("L'ordre d'affichage des onglets n'est pas respecté. Ordre ATTENDU :");
			for (let i = 0; i < nbExpectedTabs; i++) console.log("-- " + tabToCheck[i]);
			expect(matchingTabsOrder).to.equal(true, "L'ordre d'affichage des onglets n'est pas respecté");
		}
	}
	else console.log("Pas de vérification paramétrée sur l'ordre d'affichage des onglets");
}

async function wikipediaSummary(summaryData) {
	let summaryListDisplayed = [];

	expect(await elementRepo.wikipediaSummary.isPresent()).to.equal(true, "Echec d'identification de l'élément 'summary'");

	let summaryList  =await elementRepo.wikipediaSummary.all(by.css('li a.sidebar-toc-link'));
	let nbDisplayedSummaryElem = summaryList.length;	// Nombre d'éléments affichés
	console.log("Nombre d'éléments identifiés : " + nbDisplayedSummaryElem)

	let lengthSummaryData = summaryData.length;
	summaryData.forEach(elem => {
		if(elem.children != null && elem.children.length > 0) {
			lengthSummaryData += elem.children.length
		}
	});

	expect(lengthSummaryData === nbDisplayedSummaryElem).to.equal(true, "Les longueurs des sommaires ne correspondent pas");

	for (let i = 0; i < nbDisplayedSummaryElem; i++) {
		summaryListDisplayed[i] = await summaryList[i].getText();
	}

	let arrayNames = []
	for (let i = 0; i < summaryData.length; i++){
		arrayNames.push(summaryData[i].name);
		if(summaryData[i].children != null && summaryData[i].children.length > 0) {
			summaryData[i].children.forEach(elem => {
				arrayNames.push(elem.name);
			})
		}
	}

	expect(arrayNames.length === summaryListDisplayed.length).to.equal(true, "Les longueurs des sommaires ne correspondent pas");

	for (let i = 0; i < arrayNames.length; i++){
		expect(arrayNames[i] === summaryListDisplayed[i]).to.equal(true, "Les valeurs ne correspondent pas :" + arrayNames[i] + " " + summaryListDisplayed[i]);
	}
}

async function extractDataRead(fileTarget) {
	let dataRead = [];
	await new Promise((resolve => {
		fs.createReadStream(fileTarget)
			.pipe(csv.parse())
			.on('data', (data) => {
				dataRead.push(data[0]);
			})
			.on('end', () => {
				resolve();
			});
	}));
	return dataRead;
}

async function impotClickTab(name) {
	return await element(by.css('a.pus-'+name));
}

module.exports = {
    pageAccess,
	googleSearch,
	googleResult,
	wikipediaTabs,
	wikipediaSummary,
	extractDataRead,
	impotClickTab,
};