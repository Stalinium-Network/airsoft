export default function IntroSection() {
  return (
    <>
      <div className="pt-36 pb-10 px-10 bg-black/80 flex flex-col md:items-center">
        <p className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-70% from-white to to-zone-gold-lite bg-clip-text text-transparent w-fit">
          What is Zone 37
        </p>
        <p className="mt-6 text-lg text-zinc-400 font-bold max-w-5xl md:text-center mb-8">
          Zone 37 is a 40-hour continuous immersion role-playing airsoft game in
          California set in a constantly changing lore. Each game continues the
          previous one and affects the main storyline. You can be a penniless
          bandit, a treasure hunter, a trader, a soldier, or a PMC mercenary.
        </p>
      </div>
      <div className="py-12 px-8">
        <h1 className="text-4xl md:text-5xl bg-gradient-to-r from-70% from-white to to-zone-gold-lite/80 bg-clip-text text-transparent pb-10 mt-6 w-fit">
          Where it all began...
        </h1>

        <div className="rounded-xl p-6 mt-6 bg-zone-dark-light">
          <p className="leading-relaxed text-gray-300">
            In 2020, a series of unprecedented solar flares dramatically altered
            life on Earth. These colossal flares unleashed intense radiation,
            sparking the formation of multiple anomalous zones across the
            planet. While many of these zones were swiftly controlled by
            governments worldwide, some were mobile and far more perilous than
            their stationary counterparts.
          </p>
          <p className="leading-relaxed mt-4 text-gray-300">
            The emergence of these zones quickly attracted the attention of
            private military companies, who began monitoring them closely. The
            areas were found to harbor valuable, otherworldly artifacts—items of
            immense scientific importance that promised to unlock the secrets of
            the universe. Alongside military companies, treasure hunters also
            flocked to these regions, eager to claim the strange and powerful
            relics.
          </p>
          <p className="leading-relaxed mt-4 text-gray-300">
            Among the most infamous of these zones is Zone 37, a mysterious and
            hazardous area that has captivated the interest of all who hear of
            it. Known for its enigmatic artifacts, Zone 37 also poses a deadly
            risk to anyone who dares to enter without proper preparation. By
            2025, tensions reached a boiling point, as two powerful private
            military companies clashed in an all-out war for control over the
            zone.
          </p>
          <p className="leading-relaxed mt-4 text-gray-300">
            As the battle for dominance in Zone 37 continues, the world watches
            closely, uncertain of the dangers that lie ahead — and the
            extraordinary discoveries that might still be hidden within.
          </p>
        </div>
      </div>
    </>
  );
}
