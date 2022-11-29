/**
 * 2022-11-27
 */
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');

chai.use(chaiAsPromised);
const expect = chai.expect;

browser.ignoreSynchronization = true;

const utils = require('../../utils');
const init = require('../../init');
//let { reset, avant, apres } = require('../../executionFlow');
describe("Page de connexion", async () => {
	
	it("Lancement du navigateur et accès à l'url renseignée", async () => {
        await utils.pageAccess(init.googleUrl);
    });
	
    it("Saisie de la chaîne de caractères 'wikipedia logiciel'", async () => {
        await utils.googleSearch('wikipedia logiciel');
    });
	
	it("Clic sur le résultat 'Logiciel — Wikipédia'", async () => {
        await utils.googleResult('Logiciel - Wikipédia');
    });
	
	it("Vérification des onglets affichés sur la page Wikipedia", async () => {
        var tabTarget = {
			matchingResult: true,
			checkTabsOrder: true,
			tabsDef: [
				{
					tabName: "Lire"
				},
				{
					tabName: "Modifier"
				},
				{
					tabName: "Modifier le code"
				},
				{
					tabName: "Voir l’historique"
				}
			]
		}
		await utils.wikipediaTabs(tabTarget);
    });

	it("Vérification du sommaire de la page Wikipedia", async () => {
		var summaryTarget = [
            {name: "Début"},
            {name: "Étymologie"},
            {name: "Introduction"},
            {name: "Typologie"},
            {name: "Secteur industriel", children: [{name: "Philosophie libre"}]},
            {name: "Licence et droits"},
            {name: "Distribution"},
            {name: "Construction"},
            {name: "Qualité des logiciels", children: [{name: "Bogues"}]},
            {name: "Logiciels critiques"},
            {name: "Notes et références"},
            {name: "Voir aussi", children: [{name: "Articles connexes"}]}
        ]
		await utils.wikipediaSummary(summaryTarget); 
	});

    it("Saisie de chaîne de caractères - Data Driven Test", async () => {
        let ddt = await utils.extractDataRead(__dirname + '//stringsToSet.csv')
		console.log("Nombre de lignes dans le fichier externe : " + ddt.length);
		for (let i = 0; i < ddt.length; i++) console.log(ddt[i]);
		//for (let i = 0; i < ddt.length; i++) await utils.googleSearch(ddt[i]);
    });

});