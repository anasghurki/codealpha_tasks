import { Link } from "react-router";
import { LANGUAGE_TO_FLAG } from "../constants";

const FriendCard = ({ friend }) => {
  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-5 hover:shadow-lg transition-all duration-300 group">
      {/* USER INFO */}
      <div className="flex items-center gap-4 mb-4">
        <div className="relative">
          <div className="avatar size-14 rounded-full ring-2 ring-gray-50 overflow-hidden">
            <img src={friend.profilePic} alt={friend.fullName} className="object-cover" />
          </div>
          <div className="absolute bottom-0 right-0 size-3.5 bg-[#25D366] border-2 border-white rounded-full"></div>
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-gray-800 truncate text-lg group-hover:text-[#075E54] transition-colors">{friend.fullName}</h3>
          <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wider">Language Partner</p>
        </div>
      </div>

      <div className="flex flex-col gap-2 mb-5">
        <div className="flex items-center justify-between text-xs p-2 bg-gray-50 rounded-lg">
          <span className="text-gray-500">Native</span>
          <span className="font-bold text-[#075E54] flex items-center">
            {getLanguageFlag(friend.nativeLanguage)}
            {friend.nativeLanguage}
          </span>
        </div>
        <div className="flex items-center justify-between text-xs p-2 bg-gray-50 rounded-lg">
          <span className="text-gray-500">Learning</span>
          <span className="font-bold text-[#25D366] flex items-center">
            {getLanguageFlag(friend.learningLanguage)}
          </span>
        </div>

        <Link to={`/chat/${friend._id}`} className="btn btn-outline w-full">
          Message
        </Link>
      </div>
    </div>
  );
};
export default FriendCard;

export function getLanguageFlag(language) {
  if (!language) return null;

  const langLower = language.toLowerCase();
  const countryCode = LANGUAGE_TO_FLAG[langLower];

  if (countryCode) {
    return (
      <img
        src={`https://flagcdn.com/24x18/${countryCode}.png`}
        alt={`${langLower} flag`}
        className="h-3 mr-1 inline-block"
      />
    );
  }
  return null;
}
