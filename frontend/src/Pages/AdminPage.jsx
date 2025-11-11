import { useNavigate } from "react-router-dom";
import { Video, Trash, Pencil, BadgePlus } from "lucide-react";
import { useSelector } from "react-redux";

export default function AdminPage() {
  const navigate = useNavigate();
  const { theme } = useSelector((state) => state.theme);

  return (
    <div className="min-h-screen bg-base-200 py-10 px-4 sm:px-6 lg:px-8" data-theme={theme}>
      <div className="max-w-4xl mx-auto">
        {/* Admin Panel Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-base-content mb-2 tracking-wide">
            Admin Panel
          </h1>
          <p className="text-lg text-base-content/70">
            Empower your platform: manage coding problems with ease
          </p>
        </div>

        {/* Action Cards Container */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Create Problem Card */}
          <div className="bg-base-100 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 p-8 flex flex-col items-center text-center border border-success/30">
            <div className="text-4xl font-extrabold text-base-content mb-4">
              <BadgePlus className="w-10 h-10 text-success drop-shadow-lg" />
            </div>
            <p className="text-base text-base-content/70 mb-6">
              Add a brand new coding challenge to the platform's collection.
            </p>
            <button
              className="btn btn-success btn-lg hover:scale-105 transition-transform shadow-lg"
              onClick={() => navigate("/admin")}
            >
              Add New Problem
            </button>
          </div>

          {/* Update Problem Card */}
          <div className="bg-base-100 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 p-8 flex flex-col items-center text-center border border-warning/30">
            <div className="text-4xl font-extrabold text-base-content mb-4">
              <Pencil className="w-10 h-10 text-warning drop-shadow-lg" />
            </div>
            <p className="text-base text-base-content/70 mb-6">
              Refine existing problems, update details, or correct errors.
            </p>
            <button
              className="btn btn-warning btn-lg hover:scale-105 transition-transform shadow-lg"
              onClick={() => navigate("/modifyProblem")}
            >
              Edit Problem
            </button>
          </div>

          {/* Delete Problem Card */}
          <div className="bg-base-100 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 p-8 flex flex-col items-center text-center border border-error/30">
            <div className="text-4xl font-extrabold text-base-content mb-4">
              <Trash className="w-10 h-10 text-error drop-shadow-lg" />
            </div>
            <p className="text-base text-base-content/70 mb-6">
              Permanently remove a problem from the platform's database.
            </p>
            <button
              className="btn btn-error btn-lg hover:scale-105 transition-transform shadow-lg"
              onClick={() => navigate("/removeProblem")}
            >
              Remove Problem
            </button>
          </div>

          {/* Upload Video Card */}
          <div className="bg-base-100 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 p-8 flex flex-col items-center text-center border border-primary/30">
            <div className="text-4xl font-extrabold text-base-content mb-4">
              <Video className="w-10 h-10 text-primary drop-shadow-lg" />
            </div>
            <p className="text-base text-base-content/70 mb-6">
              Upload a video to the platform.
            </p>
            <button
              className="btn btn-primary btn-lg hover:scale-105 transition-transform shadow-lg"
              onClick={() => navigate("/addvideo")}
            >
              Add Video
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
