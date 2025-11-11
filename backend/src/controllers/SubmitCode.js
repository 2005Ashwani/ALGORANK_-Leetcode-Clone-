const Problem = require("../models/Problem");  // Use uppercase for models
const submission = require("../models/Submission");
const Submission = require("../models/Submission");
const { get } = require("../routes/userAuthontication");
const { getLanguageById, submitBatch, submitToken } = require("../utils/ProblemUtility");



const SubmitCode = async (req, res) => {
    try {
        const userId = req.result._id;
        const problemId = req.params.id;
        const { code, language } = req.body;

        // Validate fields
        if (!userId || !problemId || !code || !language) {
            return res.status(400).send("Fields are missing");
        }

        // Fetch problem from DB
        const problem = await Problem.findById(problemId);
        if (!problem) {
            return res.status(404).send("Problem not found");
        }

        // Prepare initial submission
        let submissionDoc = await Submission.create({
            userId,
            problemId,
            code,
            language,
            testCasePassed: 0,
            status: "pending",
            testCaseTotal: problem.hiddenTestCases.length,
        });

        // Get language id
        const languageId = getLanguageById(language);

        // Prepare submissions for batch
        const submissions = problem.hiddenTestCases.map((testCase) => ({
            source_code: code,
            language_id: languageId,
            stdin: testCase.input,
            expected_output: testCase.output,
        }));

        // Submit batch
        const submitResult = await submitBatch(submissions);
        const resultTokens = submitResult.map((value) => value.token);

        // Get test results
        const testResults = await submitToken(resultTokens);

        // Process results
        let testCasePassed = 0;
        let runTime = 0;
        let memory = 0;
        let status = "accepted";
        let errorMessage = null;

        for (const test of testResults) {
            if (test.status.id === 3) {
                testCasePassed += 1;
                runTime += parseFloat(test.time || 0);
                memory = Math.max(memory, test.memory || 0);
            } else {
                if (test.status_id === 4) {
                    status = "error";
                    errorMessage = test.stderr || "Compilation error";
                } else {
                    status = "wrong";
                    errorMessage = test.stderr || "Wrong output";
                }
            }
        }

        // Update submission
        submissionDoc.status = status;
        submissionDoc.testCasePassed = testCasePassed;
        submissionDoc.errorMessage = errorMessage;
        submissionDoc.runtime = runTime;
        submissionDoc.memory = memory;

        await submissionDoc.save();

        // to check weather the problem is present in the user problemSolved array or not

        if (!req.result.problemSolved.includes(problemId)) {
            req.result.problemSolved.push(problemId);
            await req.result.save();
        }

        const accepted = { status: "accepted" }

        res.status(201).json({
            accepted,
            totalTestCases: problem.hiddenTestCases.length,
            passedTestCases: testCasePassed,
            runTime,
            memory,
            errorMessage
        })
    } catch (error) {
        console.error(error);
        res.status(500).send("Error: " + error.message);
    }
};


// Yaha per code ko DB main store karna ki jarurat nhi hai 
const runCode = async (req, res) => {

    try {
        const userId = req.result._id;
        const problemId = req.params.id;
        const { code, language } = req.body;

        // Validate fields
        if (!userId || !problemId || !code || !language) {
            return res.status(400).send("Fields are missing");
        }

        // Fetch problem from DB
        const problem = await Problem.findById(problemId);
        if (!problem) {
            return res.status(404).send("Problem not found");
        }


        // Get language id
        const languageId = getLanguageById(language);

        // Prepare submissions for batch
        const submissions = problem.visibleTestCases.map((testCase) => ({
            source_code: code,
            language_id: languageId,
            stdin: testCase.input,
            expected_output: testCase.output,
        }));

        // Submit batch
        const submitResult = await submitBatch(submissions);
        const resultTokens = submitResult.map((value) => value.token);

        // Get test results
        const testResults = await submitToken(resultTokens);




        res.status(200).send(testResults);
    } catch (error) {
        console.error(error);
        res.status(500).send("Error: " + error.message);
    }

}

// Get Sub
const getSubmittedCode = async (req, res) => {
    try {
        const getAllProblem = await submission.find({}, "_id code updatedAt status language userId problemId");
        res.status(200).json(getAllProblem);
        if (!getAllProblem) {
            res.status(500).send("No Submittion is found");
        }
        else {
            res.status(200).send(getAllProblem)
        }





    } catch (error) {
        res.status(500).send("Server error " + error);
    }
}

module.exports = { SubmitCode, runCode, getSubmittedCode };
