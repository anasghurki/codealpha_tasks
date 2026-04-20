import { useState, useRef } from "react";
import useAuthUser from "../hooks/useAuthUser";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateProfile } from "../lib/api";
import toast from "react-hot-toast";
import { CameraIcon, MapPinIcon, LanguagesIcon, UserIcon, InfoIcon, Loader2 } from "lucide-react";

const ProfilePage = () => {
  const { authUser } = useAuthUser();
  const queryClient = useQueryClient();
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    fullName: authUser?.fullName || "",
    bio: authUser?.bio || "",
    nativeLanguage: authUser?.nativeLanguage || "",
    learningLanguage: authUser?.learningLanguage || "",
    location: authUser?.location || "",
    profilePic: null,
  });

  const [previewImage, setPreviewImage] = useState(authUser?.profilePic || "");

  const { mutate: updateProfileMutation, isPending } = useMutation({
    mutationFn: updateProfile,
    onSuccess: () => {
      toast.success("Profile updated successfully!");
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to update profile");
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
        setFormData({ ...formData, profilePic: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    updateProfileMutation(formData);
  };

  return (
    <div className="min-h-screen bg-[#F0F2F5] pb-12">
      <div className="bg-[#00a884] h-44 w-full absolute top-0 left-0 hidden md:block"></div>
      
      <div className="container mx-auto max-w-3xl pt-2 sm:pt-10 px-4 relative z-10">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100 transition-all">
          <div className="p-8 sm:p-12">
            <header className="mb-10 text-center">
              <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Your Profile</h1>
              <p className="text-gray-500 mt-2">Manage your personal information and profile picture</p>
            </header>

            <form onSubmit={handleSubmit} className="space-y-10">
              {/* PROFILE IMAGE SECTION */}
              <div className="flex flex-col items-center group">
                <div className="relative">
                  <div className="size-44 rounded-full overflow-hidden ring-4 ring-[#E7FCE3] shadow-lg transition-transform hover:scale-[1.02]">
                    <img
                      src={previewImage || "/avatar.png"}
                      alt="Profile Preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute bottom-2 right-2 bg-[#25D366] text-white p-3 rounded-full shadow-lg hover:bg-[#20bd5c] transition-all transform hover:scale-110 active:scale-95"
                    title="Change Profile Picture"
                  >
                    <CameraIcon className="size-6" />
                  </button>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImageChange}
                    accept="image/*"
                    className="hidden"
                  />
                </div>
                <p className="text-[10px] text-gray-400 mt-4 font-bold uppercase tracking-widest">JPG, PNG or GIF. Max 1MB</p>
              </div>

              {/* FORM FIELDS */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* FULL NAME */}
                <div className="form-control">
                  <label className="label flex items-center gap-2 mb-1.5">
                    <UserIcon className="size-4 text-[#25D366]" />
                    <span className="label-text font-bold text-gray-700">Full Name</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Enter your name"
                    className="input input-bordered w-full bg-gray-50 border-gray-200 focus:border-[#25D366] rounded-xl transition-all h-12"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    required
                  />
                </div>

                {/* LOCATION */}
                <div className="form-control">
                  <label className="label flex items-center gap-2 mb-1.5">
                    <MapPinIcon className="size-4 text-[#25D366]" />
                    <span className="label-text font-bold text-gray-700">Location</span>
                  </label>
                  <input
                    type="text"
                    placeholder="City, Country"
                    className="input input-bordered w-full bg-gray-50 border-gray-200 focus:border-[#25D366] rounded-xl transition-all h-12"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  />
                </div>

                {/* NATIVE LANGUAGE */}
                <div className="form-control">
                  <label className="label flex items-center gap-2 mb-1.5">
                    <LanguagesIcon className="size-4 text-[#25D366]" />
                    <span className="label-text font-bold text-gray-700">Native Language</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. English"
                    className="input input-bordered w-full bg-gray-50 border-gray-200 focus:border-[#25D366] rounded-xl transition-all h-12"
                    value={formData.nativeLanguage}
                    onChange={(e) => setFormData({ ...formData, nativeLanguage: e.target.value })}
                  />
                </div>

                {/* LEARNING LANGUAGE */}
                <div className="form-control">
                  <label className="label flex items-center gap-2 mb-1.5">
                    <LanguagesIcon className="size-4 text-[#25D366]" />
                    <span className="label-text font-bold text-gray-700">Learning Language</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Spanish"
                    className="input input-bordered w-full bg-gray-50 border-gray-200 focus:border-[#25D366] rounded-xl transition-all h-12"
                    value={formData.learningLanguage}
                    onChange={(e) => setFormData({ ...formData, learningLanguage: e.target.value })}
                  />
                </div>

                {/* BIO - FULL WIDTH */}
                <div className="form-control md:col-span-2">
                  <label className="label flex items-center gap-2 mb-1.5">
                    <InfoIcon className="size-4 text-[#25D366]" />
                    <span className="label-text font-bold text-gray-700">About (Bio)</span>
                  </label>
                  <textarea
                    placeholder="Tell us about yourself..."
                    className="textarea textarea-bordered w-full bg-gray-50 border-gray-200 focus:border-[#25D366] rounded-xl transition-all min-h-[100px] py-3 px-4"
                    value={formData.bio}
                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  />
                </div>
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={isPending}
                  className="w-full h-14 bg-[#25D366] hover:bg-[#20bd5c] text-white font-extrabold text-lg rounded-2xl shadow-lg transition-all transform active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isPending ? (
                    <>
                      <Loader2 className="size-6 animate-spin" />
                      Updating Profile...
                    </>
                  ) : (
                    "Save Changes"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
