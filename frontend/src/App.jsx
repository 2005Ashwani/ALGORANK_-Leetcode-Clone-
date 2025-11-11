import { Routes, Route, Navigate } from "react-router-dom";
import HomePage from "./Pages/HomePage";
import SignUpPage from "./Pages/SignUp";
import LoginPage from "./Pages/LoginPage";
import { checkAuth } from "./redux/authSlice";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import AdminPanel from "../src/component/AdminPanel";

// me
import ProblemPage from "./Pages/ProblemPage";
import AdminPage from "./Pages/AdminPage";
import ModifyProblem from "./component/ModifyProblem";
import RemoveProblem from "./component/RemoveProblem";
import ProblemSubmission from "./Pages/problemSubmission";
import AdminVideo from "./component/AdminVideo";
import AdminUpload from "./component/AdminUploadVideo";
import Edit from "./component/edit";
import SignAsAdmin from "./component/SignAsAdmin";
import UploadImage from "./component/UploadPhoto";
import DashBoard from "./Pages/DashBoard";

import Home from "./AlgoSnap/component/Home";
import ArrayPage from "./AlgoSnap/component/ArrayPage";
import LinkedList from "./AlgoSnap/component/LinkedList";
import Searching from "./AlgoSnap/component/Searching";
import Sorting from "./AlgoSnap/component/Sorting";
import SearchingVisualization from "./AlgoSnap/component/SearchingVisualization";
import SortingVisualization from "./AlgoSnap/component/SortingVisualization";
import TreePage from "./AlgoSnap/component/TreePage";
import TreeVisualization from "./AlgoSnap/component/TreeVisualization";
import Graph from "./AlgoSnap/component/Graph";
import Array_LinkedList from "./AlgoSnap/component/Array&LinkedList";
import Searching_Sorting from "./AlgoSnap/component/Searching&sorting";
import Tree_Graph from "./AlgoSnap/component/Tree&Graph";
import Graph_Visualization from "./AlgoSnap/component/GraphVisualization";
import Page1 from "./AlgoSnap/component/Page1";
import AI from "./AlgoSnap/component/AI";

// Me
import Razorpay from "./component/Razorpay";
import Payment from "./component/Payment";

// import "daisyui/dist/full.css";

function App() {
  // code   likhana  isAuthentication  ke liye
  // Taki user jab vi  website open kara to automatic call jya backend  per token ka sath
  // if token is valid to user ka data mile ga (login)
  // Otherwise gives the error

  // reading the value
  // const { isAuthenticated, loading, user } = useSelector((state) => state.auth);
  const { isAuthenticated, loading, user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]); // we use dispatch because  hum chya raha hai ki yak bar hi chala  ( So we use the value which is not changing) )

  // Agar data load ho raha hai tab
  // Jaisa loading hoga toh ya true
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <>
      <Routes>
        <Route
          path="/login"
          element={isAuthenticated ? <Navigate to="/" /> : <LoginPage />}
        />

        <Route
          path="/signup"
          element={isAuthenticated ? <Navigate to="/" /> : <SignUpPage />}
        ></Route>

        <Route path="/adminpage" element={<AdminPage />}></Route>
        {/* <Route path="/admin" element={<AdminPanel />}></Route> */}
        <Route
          path="/modifyProblem"
          element={
            isAuthenticated && user.role == "admin" ? (
              <ModifyProblem />
            ) : (
              <Navigate to="/" />
            )
          }
        ></Route>

        <Route
          path="/removeProblem"
          element={
            isAuthenticated && user.role == "admin" ? (
              <RemoveProblem />
            ) : (
              <Navigate to="/" />
            )
          }
        ></Route>

        {/* // Koi bhi user admin panel  per na jaa sake  */}
        <Route
          path="/admin"
          element={
            isAuthenticated && user.role == "admin" ? (
              <AdminPanel />
            ) : (
              <Navigate to="/" />
            )
          }
        ></Route>

        {/* // Koi bhi user admin panel  per na jaa sake                 Add Video */}
        <Route
          path="/addvideo"
          element={
            isAuthenticated && user.role == "admin" ? (
              <AdminVideo />
            ) : (
              <Navigate to="/" />
            )
          }
        ></Route>

        {/* // Koi bhi user admin panel  per na jaa sake                Add a admin */}
        <Route
          path="/signAdmin"
          element={
            isAuthenticated && user.role == "admin" ? (
              <SignAsAdmin />
            ) : (
              <Navigate to="/signAdmin" />
            )
          }
        ></Route>

        {/*  Admin Panel , Dashboard Image UPload  */}
        <Route path="/problem/:problemId" element={<ProblemPage />} />
        <Route path="/submittedproblem" element={<ProblemSubmission />}></Route>

        {/* // Upload Problem  */}
        <Route
          path="/admin/upload/:problemId"
          element={<AdminUpload />}
        ></Route>
        <Route path="/edit" element={<Edit />}></Route>
        <Route path="/uploadProfile" element={<UploadImage />}></Route>
        <Route path="/dashBoard" element={<DashBoard />}></Route>

        <Route path="/page1" element={<Page1 />}></Route>

        {/* AI Section */}
        <Route path="/AI" element={<AI />} />

        {/* Landing Page (Page1) */}
        <Route
          path="/"
          element={isAuthenticated ? <HomePage /> : <Navigate to="/login" />}
        />

        <Route path="/home" element={<Home />} />
        {/* Home */}

        {/* Array & LinkedList */}
        <Route path="/array-linkedlist" element={<Array_LinkedList />}>
          <Route path="array" element={<ArrayPage />} />
          <Route path="linkedlist" element={<LinkedList />} />
        </Route>

        {/* Searching & Sorting */}
        <Route path="/searching-sorting" element={<Searching_Sorting />}>
          <Route path="searching" element={<Searching />}>
            <Route path="visualization" element={<SearchingVisualization />} />
          </Route>
          <Route path="sorting" element={<Sorting />}>
            <Route path="visualization" element={<SortingVisualization />} />
          </Route>
        </Route>

        {/* Tree & Graph */}
        <Route path="/tree-graph" element={<Tree_Graph />}>
          <Route path="tree" element={<TreePage />}>
            <Route path="visualization" element={<TreeVisualization />} />
          </Route>
          <Route path="graph" element={<Graph />}>
            <Route path="visualization" element={<Graph_Visualization />} />
          </Route>
        </Route>

        {/* // Payments */}
        <Route path="/razorpay" element={<Razorpay />}></Route>
        <Route path="/payment" element={<Payment />}></Route>

        


      </Routes>
    </>
  );
}

export default App;
