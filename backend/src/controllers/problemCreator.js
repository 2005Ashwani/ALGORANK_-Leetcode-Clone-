const { getLanguageById, submitBatch, submitToken } = require("../utils/ProblemUtility")
const problem = require("../models/Problem")
const User = require("../models/user");
const submission = require("../models/Submission");
const SolutionVideo = require("../models/solutionVideo")

const CreateProblem = async (req, res) => {
    const { tittle, description, difficulty, tags, visibleTestCases, hiddenTestCases, startCode, problemCreator, referenceSolution, } = req.body;

    try {
        for (const { language, completeCode } of referenceSolution) {
            const languageId = getLanguageById(language)

            // Create Judge0 submissions for each visible test case
            const submissions = visibleTestCases.map((testCase) => ({
                source_code: completeCode,
                language_id: languageId,
                stdin: testCase.input,
                expected_output: testCase.output,
            }));

            // Submit batch and collect tokens (handle multiple possible response shapes)
            const submitResult = await submitBatch(submissions)


            // console.log(submitResult)

            let resultToken = []
            if (submitResult && Array.isArray(submitResult.tokens)) {
                resultToken = submitResult.tokens
            } else if (Array.isArray(submitResult)) {
                resultToken = submitResult.map(v => v && v.token).filter(Boolean)
            } else if (submitResult && Array.isArray(submitResult.submissions)) {
                resultToken = submitResult.submissions.map(v => v && v.token).filter(Boolean)
            }
            if (!resultToken.length) {
                return res.status(400).send("Failed to obtain submission tokens from Judge0")
            }

            // Fetch results until all are finished
            const testResult = await submitToken(resultToken)

            console.log(testResult)

            // Validate all test results are Accepted (status id 3)
            for (const test of testResult) {
                const statusId = (test.status && test.status.id) || test.status_id;
                if (statusId !== 3) {
                    return res.status(400).send("Error Occured")
                }
            }
        }

        // Persist the problem in DB
        await problem.create({
            ...req.body,
            problemCreator: req.result._id,
        })

        return res.status(201).send("Problem Saved Successfully")

    } catch (error) {
        return res.status(500).json({ error: String(error.message || error) })
    }
} // OK

const UpdateProblem = async (req, res) => {

    const { id } = req.params;


    const { tittle, description, difficulty, tags, visibleTestCases, hiddenTestCases, startCode, problemCreator, referenceSolution, } = req.body;   // Sab kuch nikal do

    try {

        // sayad id aya na ho
        if (!id) {
            res.status(400).send("Missing ID")
        }

        // sayad id ho na
        const DSAProblem = await problem.findById(id)
        if (!DSAProblem) {
            return res.status(404).send("Id is not present in server")
        }


        for (const { language, completeCode } of referenceSolution) {
            const languageId = getLanguageById(language)

            // Create Judge0 submissions for each visible test case
            const submissions = visibleTestCases.map((testCase) => ({
                source_code: completeCode,
                language_id: languageId,
                stdin: testCase.input,
                expected_output: testCase.output,
            }));


            // Submit batch and collect tokens (handle multiple possible response shapes)
            const submitResult = await submitBatch(submissions)


            // console.log(submitResult)



            // let resultToken = []
            // if (submitResult && Array.isArray(submitResult.tokens)) {
            //     resultToken = submitResult.tokens
            // } else if (Array.isArray(submitResult)) {
            //     resultToken = submitResult.map(v => v && v.token).filter(Boolean)
            // } else if (submitResult && Array.isArray(submitResult.submissions)) {
            //     resultToken = submitResult.submissions.map(v => v && v.token).filter(Boolean)
            // }
            // if (!resultToken.length) {
            //     return res.status(400).send("Failed to obtain submission tokens from Judge0")
            // }





            const resultToken = submitResult.map((value) => value.token)


            // Fetch results until all are finished
            const testResult = await submitToken(resultToken)

            // console.log(testResult)

            // Validate all test results are Accepted (status id 3)
            for (const test of testResult) {
                const statusId = (test.status && test.status.id) || test.status_id;
                if (statusId !== 3) {
                    return res.status(400).send("Error Occured")
                }
            }
        }

        // Updating the DB
        const newProblem = await problem.findByIdAndUpdate(id, { ...req.body }, { runValidators: true, new: true })        // To check before updating                       // Return new documentation


        res.status(200).send("Problem Updated Successfully")

    } catch (error) {
        res.status(500).send("Error " + error)

    }
} // OK

const DeleteProblem = async (req, res) => {
    const { id } = req.params;
    try {
        if (!id) {
            return res.status(400).send("Id is missing")
        }
        const deletedProblem = await problem.findByIdAndDelete(id)
        if (!deletedProblem) {
            return res.status(404).send("Problem is missing")
        }

        res.status(200).send("Successfully Deleted")
    } catch (error) {
        res.status(500).send("Error " + error)
    }

}   //ok


const ProblemById = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).send("ID Missing"); // 400 = Bad Request (better than 300)
        }

        // Find problem from DB with selected fields
        const getProblem = await problem
            .findById(id)
            .select("tittle tags visibleTestCases startCode referenceSolution description _id difficulty");

        if (!getProblem) {
            return res.status(404).send("Problem is not present");
        }


        // Video ka jo bhi url wagara la awo    ( Yak problem ka yak Solution hai )             ( Take API call bach sakha)
        const videos = await SolutionVideo.findOne({ problemId: id })  
        // console.log(videos)
    if (videos) {
  getProblem.secureUrl = videos.secureUrl;
  getProblem.cloudinaryPublicId = videos.cloudinaryPublicId;
  getProblem.thumbnailUrl = videos.thumbnailUrl;
  getProblem.duration = videos.duration;

  return res.status(200).json(getProblem);
}



        //  Only one response when problem is found
        return res.status(200).json(getProblem);
    } catch (error) {
        console.error("Error fetching problem:", error);
        return res.status(500).send("Error " + error.message);
    }
};


const getAllProblem = async (req, res) => {

    try {

        const getProblem = await problem.find({})
        if (getAllProblem.length == 0) {
            res.status(404).send("Problem is missing")
        }
        res.status(200).send(getProblem)

    } catch (error) {
        res.status(500).send("Error " + error)
    }


}    // ok

const solvedAllProblemByUser = async (req, res) => {
    try {
        const userId = req.result._id
        // const user = await User.findById(userId).populate("problemSolved")
        const user = await User.findById(userId).populate({
            path: "problemSolved",
            select: "_id tittle tags difficulty"
        })

        res.status(200).send(user.problemSolved)


    } catch (error) {
        res.status(500).send("Error " + error)
    }

}  // OK


const submittedProblem = async (req, res) => {
    try {
        const userId = req.result._id;
        const problemId = req.params.pid;

        const ans = await submission.find({ userId, problemId });
        console.log(ans)
        if (ans.length === 0) {
            return res.status(404).send("No submission found for this problem by the user")

        }

        res.status(200).send(ans)

    } catch (error) {
        res.status(500).send("Internal Server Error" + error)
    }


}







module.exports = { CreateProblem, UpdateProblem, DeleteProblem, ProblemById, getAllProblem, solvedAllProblemByUser, submittedProblem }