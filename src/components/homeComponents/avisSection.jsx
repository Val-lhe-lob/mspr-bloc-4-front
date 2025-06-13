import React, { useState, useEffect } from "react";
import { MdOutlineStarPurple500 } from "react-icons/md";

const reviews = [
  { name: "Camille R.", review: "Un café d'exception, torréfié avec soin. Livraison rapide et packaging élégant. Une belle découverte pour les amateurs exigeants." },
  { name: "Thomas L.", review: "Je suis bluffé par la qualité ! J'ai testé le moka éthiopien : arômes puissants, texture veloutée. Je recommande sans hésiter." },
  { name: "Nina B.", review: "Commande passée le dimanche, reçue mardi matin. Le café est délicieux et le service client très réactif. Bravo à l'équipe PayeTonKahwa." },
  { name: "Léa H.", review: "Le café est non seulement excellent, mais l'expérience d'achat est fluide et premium. On sent le souci du détail." },
  { name: "Karim A.", review: "Une pépite ! Les grains arrivent frais, parfaitement emballés. Le goût est net, équilibré, avec une belle persistance. Je deviens fidèle !" },
  { name: "Elodie G.", review: "Coup de cœur pour le blend italien. Un vrai goût de luxe à la maison. Mon rituel matinal ne sera plus jamais le même." },
  { name: "Hugo D.", review: "Je recommande à tous les passionnés. Service irréprochable et qualité au rendez-vous. Une vraie maison de confiance." },
  { name: "Fatima Z.", review: "Enfin un site sérieux pour du café de spécialité. L’arôme est incroyable, et chaque variété a sa signature unique. Merci !" },
  { name: "Pierre M.", review: "Service rapide, emballage raffiné, goût inégalé. J’ai déjà converti mes collègues !" },
];

const AvisSection = ({ reviewsRef }) => {
  const [currentReviewIndex, setCurrentReviewIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [hoveredReview, setHoveredReview] = useState(null);

  useEffect(() => {
    if (!isPaused) {
      const interval = setInterval(() => {
        setCurrentReviewIndex((prev) => (prev + 3) % reviews.length);
      }, 6000);
      return () => clearInterval(interval);
    }
  }, [isPaused]);

  const handleMouseEnterReview = (index) => {
    setIsPaused(true);
    setHoveredReview(index);
  };

  const handleMouseLeaveReview = () => {
    setIsPaused(false);
    setHoveredReview(null);
  };

  const nextReview = () => {
    setIsPaused(true);
    setCurrentReviewIndex((prev) => (prev + 3) % reviews.length);
  };

  const prevReview = () => {
    setIsPaused(true);
    setCurrentReviewIndex((prev) => (prev - 3 + reviews.length) % reviews.length);
  };

  const visibleReviews = [
    reviews[currentReviewIndex % reviews.length],
    reviews[(currentReviewIndex + 1) % reviews.length],
    reviews[(currentReviewIndex + 2) % reviews.length],
  ];

  return (
    <section
      ref={reviewsRef}
      className="py-24 bg-gradient-to-br from-yellow-400/10 via-yellow-300/10 to-yellow-500/10 text-white shadow-inner"
    >
      <div className="container mx-auto px-6 text-center">
        <h2 className="text-5xl font-bold mb-16 drop-shadow-xl tracking-wide text-yellow-400">
          AVIS CLIENTS
        </h2>

        <div className="relative">
          <div className="flex flex-col sm:flex-row justify-center gap-8 px-4">
            {visibleReviews.map((review, index) => (
              <div
                key={index}
                className={`bg-black/40 border border-yellow-600/30 backdrop-blur-md p-6 rounded-xl shadow-md transition-transform duration-300 w-full sm:w-[32%] ${
                  hoveredReview === index ? "scale-105 shadow-yellow-500/30" : ""
                }`}
                onMouseEnter={() => handleMouseEnterReview(index)}
                onMouseLeave={handleMouseLeaveReview}
              >
                <p className="text-lg md:text-xl italic mb-4 text-gray-100">"{review.review}"</p>
                <div className="flex justify-center text-yellow-400 mb-2">
                  {[...Array(5)].map((_, i) => (
                    <MdOutlineStarPurple500 key={i} className="text-xl" />
                  ))}
                </div>
                <p className="text-md text-yellow-300 font-semibold">- {review.name}</p>
              </div>
            ))}
          </div>

          {/* Flèches navigation */}
          <button
            onClick={prevReview}
            className="absolute top-1/2 left-0 transform -translate-y-1/2 bg-black/70 text-yellow-300 rounded-full p-3 hover:bg-yellow-600 hover:text-black transition"
          >
            &#10094;
          </button>
          <button
            onClick={nextReview}
            className="absolute top-1/2 right-0 transform -translate-y-1/2 bg-black/70 text-yellow-300 rounded-full p-3 hover:bg-yellow-600 hover:text-black transition"
          >
            &#10095;
          </button>
        </div>
      </div>
    </section>
  );
};

export default AvisSection;
