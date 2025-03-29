import {
  FaFacebookF,
  FaInstagram,
  FaYoutube,
  FaTiktok,
  FaDiscord,
  FaRadiation,
} from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="pt-14 pb-8 border-t border-gray-800 px-4 bg-gradient-to-b from-gray-900/70 to-black/80 relative overflow-hidden">
      {/* Фоновые декоративные элементы */}
      <div className="absolute inset-0 overflow-hidden opacity-20 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-[url('/noise.png')] opacity-[0.03]"></div>
        <div className="absolute left-[10%] top-[10%] w-1 h-14 bg-green-500/20 blur-sm"></div>
        <div className="absolute right-[25%] bottom-[15%] w-1 h-10 bg-green-500/20 blur-sm"></div>
      </div>

      <div className="container mx-auto max-w-6xl relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-12">
          {/* Социальные сети с упрощенным дизайном */}
          <div className="space-y-4 flex flex-col items-center">
            <h4 className="text-xl font-bold mb-6 text-white flex items-center space-x-2 border-b border-gray-800 pb-2">
              <FaRadiation className="text-green-500 mr-2" />
              <span>FOLLOW US</span>
            </h4>

            <ul className="space-y-3">
              <li>
                <a
                  href={process.env.NEXT_PUBLIC_LINK_FACEBOOK}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-gray-400 hover:text-white group"
                  aria-label="Facebook"
                >
                  <FaFacebookF
                    size={16}
                    className="text-gray-400 group-hover:text-white"
                  />
                  <span className="group-hover:underline">Facebook</span>
                </a>
              </li>

              <li>
                <a
                  href={process.env.NEXT_PUBLIC_LINK_INSTAGRAM}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-gray-400 hover:text-white group"
                  aria-label="Instagram"
                >
                  <FaInstagram
                    size={16}
                    className="text-gray-400 group-hover:text-white"
                  />
                  <span className="group-hover:underline">Instagram</span>
                </a>
              </li>

              <li>
                <a
                  href={process.env.NEXT_PUBLIC_LINK_TIKTOK}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-gray-400 hover:text-white group"
                  aria-label="TikTok"
                >
                  <FaTiktok
                    size={16}
                    className="text-gray-400 group-hover:text-white"
                  />
                  <span className="group-hover:underline">TikTok</span>
                </a>
              </li>

              <li>
                <a
                  href={process.env.NEXT_PUBLIC_LINK_YOUTUBE}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-gray-400 hover:text-white group"
                  aria-label="YouTube"
                >
                  <FaYoutube
                    size={16}
                    className="text-gray-400 group-hover:text-white"
                  />
                  <span className="group-hover:underline">YouTube</span>
                </a>
              </li>
            </ul>
          </div>
          <div className="space-y-4 flex flex-col items-center">
            <h4 className="text-xl font-bold mb-6 text-white flex items-center space-x-2 border-b border-gray-800 pb-2">
              <FaRadiation className="text-green-500 mr-2" />
              <span>Community</span>
            </h4>
            <a
              href={process.env.NEXT_PUBLIC_LINK_DISCORD}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 py-2.5 px-6 bg-[#5865F2] hover:bg-[#4752c4] text-white rounded-md transition-all transform hover:translate-y-[-2px] hover:shadow-lg shadow-md"
            >
              <FaDiscord size={20} />
              <span className="font-medium">Discord Community</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
