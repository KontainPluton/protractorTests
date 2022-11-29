/**
 * Author: TMO 2021-11-20
 */

 
const googleListPath = element(by.css('div ul.G43f7e'));
const googleResultPath = element(by.css('div#rso div'));
const wikipediaRightTabs = element(by.css('div#right-navigation div#p-views'));
const wikipediaSummary = element(by.css('ul.sidebar-toc-contents'));

module.exports = {
	googleListPath,
	googleResultPath,
	wikipediaRightTabs,
	wikipediaSummary
};