/**
 * ajouter les hooks before, beforeEach et afterEach : 
 * Exemple : bypasser l'exécution des cas de test #3 et #4 si le cas de test #2 a échoué
 * ---------------------------------------------------
 * 
    let testCaseDependecies = { testCase: 2, dependents: [3, 4] }
	before(function(){
        reset();
	});

	beforeEach(function(done){
		avant(this, testCaseDependecies)
			.then(function() {
				done();
			}).catch(function (err) {})
	});

	afterEach(async function(){
		apres(this,testCaseDependecies);
	});
 */
let failed, testCaseNum, execution;

// reset les numeros de cas de test et la liste d'execution
async function reset() {
    failed = false;
    testCaseNum = 1;
    execution = [];
}

// à appeler a partir de beforeEach();
// sera executé avant chaque cas de test (it)
async function avant(ctx, tstDep) {
    result = execution.filter(x => x.testCase === tstDep.testCase)[0] || undefined;
    if (failed || (result && result.failure)) {
        if (tstDep.dependents.indexOf(testCaseNum) !== -1) {
            failed = false;
            console.log(ctx.currentTest.title, ' bypassé');
            testCaseNum++;
            ctx.skip();
        }
    }
}

// à appeler a partir de afterEach();
// sera executé après chaque cas de test (it)
function apres(ctx, tstDep) {
    if (ctx.currentTest.state === "failed" && testCaseNum === tstDep.testCase) {
        failed = true;
        execution.push({ testCase: testCaseNum, failure: failed });
        console.log(ctx.currentTest.title, ' a des dépendants qui seront bypassés');
    }
    testCaseNum++;
}

module.exports = { reset, avant, apres };