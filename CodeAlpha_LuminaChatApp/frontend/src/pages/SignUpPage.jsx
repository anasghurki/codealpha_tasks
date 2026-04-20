import { useState } from "react";
import { ShipWheelIcon } from "lucide-react";
import { Link } from "react-router";

import useSignUp from "../hooks/useSignUp";

const SignUpPage = () => {
  const [signupData, setSignupData] = useState({
    fullName: "",
    email: "",
    password: "",
  });

  // This is how we did it at first, without using our custom hook
  // const queryClient = useQueryClient();
  // const {
  //   mutate: signupMutation,
  //   isPending,
  //   error,
  // } = useMutation({
  //   mutationFn: signup,
  //   onSuccess: () => queryClient.invalidateQueries({ queryKey: ["authUser"] }),
  // });

  // This is how we did it using our custom hook - optimized version
  const { isPending, error, signupMutation } = useSignUp();

  const handleSignup = (e) => {
    e.preventDefault();
    signupMutation(signupData);
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 bg-[#F0F2F5]"
    >
      <div className="flex flex-col w-full max-w-lg mx-auto bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200">
        {/* SIGNUP FORM - LEFT SIDE */}
        <div className="w-full p-8 sm:p-12 flex flex-col items-center">
          {/* LOGO */}
          <div className="mb-6 flex flex-col items-center text-center">
            <img 
              src="/Screenshot_2026-04-21_001617-removebg-preview.png" 
              alt="Lumina Chat Logo" 
              className="h-32 w-auto object-contain" 
            />
          </div>

          <div className="w-full">
            <form onSubmit={handleSignup} className="space-y-6">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-gray-800">Create an Account</h2>
                <p className="text-sm text-gray-500 mt-2">
                  Join Lumina Chat and start your journey!
                </p>
              </div>

              {/* ERROR MESSAGE IF ANY */}
              {error && (
                <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm border border-red-100 animate-shake">
                  <span>{error.response?.data?.message || error.message || "An error occurred"}</span>
                </div>
              )}

              <div className="space-y-4">
                {/* FULLNAME */}
                <div className="form-control w-full">
                  <label className="label py-1">
                    <span className="label-text font-semibold text-gray-700">Full Name</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Your name"
                    className="input input-bordered w-full bg-gray-50 border-gray-300 focus:border-[#25D366] transition-colors"
                    value={signupData.fullName}
                    onChange={(e) => setSignupData({ ...signupData, fullName: e.target.value })}
                    required
                  />
                </div>
                {/* EMAIL */}
                <div className="form-control w-full">
                  <label className="label py-1">
                    <span className="label-text font-semibold text-gray-700">Email Address</span>
                  </label>
                  <input
                    type="email"
                    placeholder="name@example.com"
                    className="input input-bordered w-full bg-gray-50 border-gray-300 focus:border-[#25D366] transition-colors"
                    value={signupData.email}
                    onChange={(e) => setSignupData({ ...signupData, email: e.target.value })}
                    required
                  />
                </div>
                {/* PASSWORD */}
                <div className="form-control w-full">
                  <label className="label py-1">
                    <span className="label-text font-semibold text-gray-700">Password</span>
                  </label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    className="input input-bordered w-full bg-gray-50 border-gray-300 focus:border-[#25D366] transition-colors"
                    value={signupData.password}
                    onChange={(e) => setSignupData({ ...signupData, password: e.target.value })}
                    required
                  />
                  <p className="text-[10px] text-gray-500 mt-1 pl-1">
                    Must be at least 6 characters
                  </p>
                </div>

                <div className="form-control">
                  <label className="label cursor-pointer justify-start gap-2">
                    <input type="checkbox" className="checkbox checkbox-sm checkbox-success" required />
                    <span className="text-xs text-gray-600">
                      I agree to the <span className="text-[#075E54] font-semibold">Terms</span> & <span className="text-[#075E54] font-semibold">Privacy</span>
                    </span>
                  </label>
                </div>
                
                <button 
                  className="btn bg-[#25D366] hover:bg-[#20bd5c] text-white border-none w-full h-12 text-lg font-bold shadow-md transform active:scale-[0.98] transition-all" 
                  type="submit"
                  disabled={isPending}
                >
                  {isPending ? (
                    <>
                      <span className="loading loading-spinner loading-md"></span>
                      Loading...
                    </>
                  ) : (
                    "Create Account"
                  )}
                </button>

                <div className="text-center mt-6 pt-6 border-t border-gray-100">
                  <p className="text-gray-600">
                    Already have an account?{" "}
                    <Link to="/login" className="text-[#075E54] font-bold hover:underline">
                      Sign in
                    </Link>
                  </p>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
