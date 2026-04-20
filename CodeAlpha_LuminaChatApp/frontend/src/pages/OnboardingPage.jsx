import { useState, useRef } from "react";
import useAuthUser from "../hooks/useAuthUser";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { completeOnboarding } from "../lib/api";
import { Loader2, MapPinIcon, CheckCircle, CameraIcon, UserIcon, InfoIcon, LanguagesIcon } from "lucide-react";
import { LANGUAGES } from "../constants";

const OnboardingPage = () => {
  const { authUser } = useAuthUser();
  const queryClient = useQueryClient();
  const fileInputRef = useRef(null);

  const [formState, setFormState] = useState({
    fullName: authUser?.fullName || "",
    bio: authUser?.bio || "",
    nativeLanguage: authUser?.nativeLanguage || "",
    learningLanguage: authUser?.learningLanguage || "",
    location: authUser?.location || "",
    profilePic: authUser?.profilePic || "",
  });

  const [previewImage, setPreviewImage] = useState(authUser?.profilePic || "");

  const { mutate: onboardingMutation, isPending } = useMutation({
    mutationFn: completeOnboarding,
    onSuccess: () => {
      toast.success("Welcome to Lumina Chat!");
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Onboarding failed");
    },
  });

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 1024 * 1024) {
        toast.error("Image size should be less than 1MB");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
        setFormState({ ...formState, profilePic: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formState.nativeLanguage || !formState.learningLanguage) {
      toast.error("Please select your languages");
      return;
    }
    onboardingMutation(formState);
  };

  return (
    <div className="min-h-screen bg-[#F0F2F5] flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden border border-gray-100">
        <div className="p-8 sm:p-12">
          <div className="text-center mb-10">
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Complete Your Profile</h1>
            <p className="text-gray-500 mt-2">Let the community know more about you!</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* PROFILE PIC CONTAINER */}
            <div className="flex flex-col items-center justify-center">
              <div className="relative group">
                <div className="size-36 rounded-full bg-gray-100 overflow-hidden ring-4 ring-[#E7FCE3] shadow-md transition-all group-hover:ring-[#25D366]">
                  {previewImage ? (
                    <img
                      src={previewImage}
                      alt="Profile Preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <UserIcon className="size-16 text-gray-300" />
                    </div>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute bottom-1 right-1 bg-[#25D366] text-white p-2.5 rounded-full shadow-lg hover:bg-[#20bd5c] transition-all transform hover:scale-110"
                  title="Upload from computer"
                >
                  <CameraIcon className="size-5" />
                </button>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageChange}
                  accept="image/*"
                  className="hidden"
                />
              </div>
              <p className="text-[10px] text-gray-400 mt-3 font-bold uppercase tracking-wider">Upload Profile Picture</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* FULL NAME */}
              <div className="form-control">
                <label className="label py-1 flex items-center gap-2">
                  <UserIcon className="size-4 text-[#25D366]" />
                  <span className="label-text font-bold text-gray-700">Full Name</span>
                </label>
                <input
                  type="text"
                  value={formState.fullName}
                  onChange={(e) => setFormState({ ...formState, fullName: e.target.value })}
                  className="input input-bordered w-full bg-gray-50 border-gray-200 focus:border-[#25D366] rounded-xl h-12"
                  placeholder="Your full name"
                  required
                />
              </div>

              {/* LOCATION */}
              <div className="form-control">
                <label className="label py-1 flex items-center gap-2">
                  <MapPinIcon className="size-4 text-[#25D366]" />
                  <span className="label-text font-bold text-gray-700">Location</span>
                </label>
                <input
                  type="text"
                  value={formState.location}
                  onChange={(e) => setFormState({ ...formState, location: e.target.value })}
                  className="input input-bordered w-full bg-gray-50 border-gray-200 focus:border-[#25D366] rounded-xl h-12"
                  placeholder="City, Country"
                />
              </div>

              {/* NATIVE LANGUAGE */}
              <div className="form-control">
                <label className="label py-1 flex items-center gap-2">
                  <LanguagesIcon className="size-4 text-[#25D366]" />
                  <span className="label-text font-bold text-gray-700">Native</span>
                </label>
                <select
                  value={formState.nativeLanguage}
                  onChange={(e) => setFormState({ ...formState, nativeLanguage: e.target.value })}
                  className="select select-bordered w-full bg-gray-50 border-gray-200 focus:border-[#25D366] rounded-xl h-12"
                  required
                >
                  <option value="">Select Language</option>
                  {LANGUAGES.map((lang) => (
                    <option key={`native-${lang}`} value={lang.toLowerCase()}>
                      {lang}
                    </option>
                  ))}
                </select>
              </div>

              {/* LEARNING LANGUAGE */}
              <div className="form-control">
                <label className="label py-1 flex items-center gap-2">
                  <LanguagesIcon className="size-4 text-[#25D366]" />
                  <span className="label-text font-bold text-gray-700">Learning</span>
                </label>
                <select
                  value={formState.learningLanguage}
                  onChange={(e) => setFormState({ ...formState, learningLanguage: e.target.value })}
                  className="select select-bordered w-full bg-gray-50 border-gray-200 focus:border-[#25D366] rounded-xl h-12"
                  required
                >
                  <option value="">Select Language</option>
                  {LANGUAGES.map((lang) => (
                    <option key={`learning-${lang}`} value={lang.toLowerCase()}>
                      {lang}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* BIO */}
            <div className="form-control">
              <label className="label py-1 flex items-center gap-2">
                <InfoIcon className="size-4 text-[#25D366]" />
                <span className="label-text font-bold text-gray-700">Bio</span>
              </label>
              <textarea
                value={formState.bio}
                onChange={(e) => setFormState({ ...formState, bio: e.target.value })}
                className="textarea textarea-bordered bg-gray-50 border-gray-200 focus:border-[#25D366] rounded-xl min-h-[100px]"
                placeholder="Tell others about yourself..."
              />
            </div>

            <button 
              className="w-full h-14 bg-[#25D366] hover:bg-[#20bd5c] text-white font-extrabold text-lg rounded-2xl shadow-lg transition-all transform active:scale-[0.98] disabled:opacity-70 flex items-center justify-center gap-2" 
              disabled={isPending} 
              type="submit"
            >
              {isPending ? (
                <>
                  <Loader2 className="animate-spin size-6" />
                  Finalizing...
                </>
              ) : (
                <>
                  <CheckCircle className="size-6" />
                  Get Started
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default OnboardingPage;

