import {
  FaFacebookF,
  FaInstagram,
  FaYoutube,
  FaTiktok,
  FaDiscord,
  FaRadiation,
} from "react-icons/fa";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <>
      <footer className="pt-14 pb-8 border-t border-zone-dark-brown/40 px-4 bg-gradient-to-b from-zone-dark to-black/40 relative overflow-hidden">
        <div className="container mx-auto max-w-6xl relative z-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-12 select-none">
            {/* Социальные сети с упрощенным дизайном */}
            <div className="space-y-4 flex flex-col items-center">
              <h4 className="text-xl font-bold mb-6 text-white flex items-center space-x-2 border-b border-zone-dark-brown/50 pb-2">
                <FaRadiation className="text-zone-gold mr-2" />
                <span>FOLLOW US</span>
              </h4>

              <ul className="space-y-3">
                <li>
                  <a
                    href={process.env.NEXT_PUBLIC_LINK_FACEBOOK}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 text-gray-400 hover:text-zone-gold group"
                    aria-label="Facebook"
                  >
                    <FaFacebookF
                      size={16}
                      className="text-gray-400 group-hover:text-zone-gold"
                    />
                    <span className="group-hover:underline">Facebook</span>
                  </a>
                </li>

                <li>
                  <a
                    href={process.env.NEXT_PUBLIC_LINK_INSTAGRAM}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 text-gray-400 hover:text-zone-gold group"
                    aria-label="Instagram"
                  >
                    <FaInstagram
                      size={16}
                      className="text-gray-400 group-hover:text-zone-gold"
                    />
                    <span className="group-hover:underline">Instagram</span>
                  </a>
                </li>

                <li>
                  <a
                    href={process.env.NEXT_PUBLIC_LINK_TIKTOK}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 text-gray-400 hover:text-zone-gold group"
                    aria-label="TikTok"
                  >
                    <FaTiktok
                      size={16}
                      className="text-gray-400 group-hover:text-zone-gold"
                    />
                    <span className="group-hover:underline">TikTok</span>
                  </a>
                </li>

                <li>
                  <a
                    href={process.env.NEXT_PUBLIC_LINK_YOUTUBE}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 text-gray-400 hover:text-zone-gold group"
                    aria-label="YouTube"
                  >
                    <FaYoutube
                      size={16}
                      className="text-gray-400 group-hover:text-zone-gold"
                    />
                    <span className="group-hover:underline">YouTube</span>
                  </a>
                </li>
              </ul>
            </div>
            <div className="space-y-4 flex flex-col items-center">
              <h4 className="text-xl font-bold mb-6 text-white flex items-center space-x-2 border-b border-zone-dark-brown/50 pb-2">
                <FaRadiation className="text-zone-gold mr-2" />
                <span>Community</span>
              </h4>
              <a
                href={process.env.NEXT_PUBLIC_LINK_DISCORD}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 py-2.5 px-6 bg-discord hover:bg-discord-hover/80 text-white rounded-md transition-all transform hover:translate-y-[-2px] hover:shadow-lg shadow-md"
              >
                <FaDiscord size={20} />
                <span className="font-medium">Discord Community</span>
              </a>
            </div>
          </div>
        </div>
        <div className="my-10 border-t border-white/10 pt-6 text-center text-zone-gold/80">
          &copy; {currentYear} Zone 37 Inc. California, US
        </div>
      </footer>
    </>
  );
}
