import React from "react";
import { Link } from "../router/RouterContext";
import { Sparkles, ArrowRight, Clock, User } from "lucide-react";

export const JournalPage: React.FC = () => {
  const articles = [
    {
      id: "art-1",
      title: "Why High-Heat Processing Ruins Natural Skincare Extracts",
      excerpt: "Industrial skincare pasteurizes plant botanicals at 85°C. Learn why cold-press hydraulic extraction preserves vital antioxidants.",
      author: "Dr. Ananya Ray, Ph.D. Phytochemistry",
      date: "Feb 24, 2026",
      readTime: "4 min read",
      category: "Apothecary Science",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCL-UgHpdFFm2PW2Ci1Ew5HMoDfXZgsZiJ4XjhjAGrk1k3Ug6GCrb3Vj8h6A4pddBBkakQKMIiLmq_Z5AGqDNn9VOq_qwIeEHwyCOl-9XRpZvWKrhd8E9saQp_RqjlxUa5-VFdTAYItXEhRdBQOo3W4ncoTpcUXOu8NafDi0utyv0tOnSGmKWDW_VRbQwbMVmMWNVurWWhIk77aGLfmQGL0Qp5kDyQJX-fteShNHQb_uvXBInsquC3N",
    },
    {
      id: "art-2",
      title: "The Saffron & Wild Turmeric Protocol: The Royal Ubtan Cleanse",
      excerpt: "How Grade-1 Kashmiri saffron and Kasturi Manjal work synergistically to illuminate skin without leaving behind yellow residues.",
      author: "Kavita Nair, Ayurvedic Master",
      date: "Feb 15, 2026",
      readTime: "5 min read",
      category: "Ayurvedic Wisdom",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDEAUM2DpBZHzxNkpHgdfNPZG-kdlIIAdUvmZKubq9WEIsUSuxjNsiToQrHJX79NNta1Lhdn2Irv8jvdDK_l8NL3-kDojTXdgKg-X3m6eZ8sjC7ASbAD1a2Ry-M8snMD4Z8O7CcsTQH8swLlqGyWcK7iBA-_Rr5khhvLsyG3IzBzWqRJxq2Rok1HDRFDQlWDD6DOqhIU52zcQcHXwGKV0mz-bJ5IPtJnXSG2OLI1v8YJPs3zqDMs3Gf",
    },
    {
      id: "art-3",
      title: "Curing Post-Monsoon & Summer Tanning with Green Coffee Beans",
      excerpt: "Chlorogenic acids in unroasted coffee beans jumpstart lymphatic circulation to fade dullness caused by sun and pollution.",
      author: "Editorial Herbalist",
      date: "Jan 30, 2026",
      readTime: "3 min read",
      category: "Seasonal Rituals",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuC1738nqRh0yzVDlpiY_fqS7NEU3zgkrr8nxt8IeyxMSGg1DoWLOhPyu-fHfmjP5e42PH51-gEJ73mF6D2VEJizNkNBKXjgtZCgndpQeYK_4IW2Kb0XwAOnGZfmUURtUGSHmElBFOseshAXJBb93AYBdAa8OUmqQhjvreJsgn_kg4p6Ia3azWT24k-4cz0xoT4z5vJJD8KNL4BWuAMxxsmVrQAXjgeeyPR5RxdRdOPpN--ftrKy48cO",
    },
  ];

  return (
    <div className="pt-0 md:pt-28 pb-20 max-w-container-max mx-auto px-4 md:px-8 lg:px-8 space-y-12">
      {/* Header */}
      <div className="bg-surface-container-low rounded-3xl p-8 md:p-14 border border-outline-variant/30 text-center space-y-3">
        <span className="text-xs font-bold uppercase tracking-widest text-secondary">
          Botanical Journal &amp; Phytochemistry
        </span>
        <h1 className="font-serif text-3xl sm:text-5xl font-bold text-primary tracking-tight">
          The Mindful Skincare Compendium
        </h1>
        <p className="text-xs sm:text-sm text-secondary max-w-xl mx-auto leading-relaxed">
          Deep dives into plant physiology, ancient Ayurvedic rituals, and clean living advice from our herbalists and cosmetic chemists.
        </p>
      </div>

      {/* Articles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {articles.map((art) => (
          <div
            key={art.id}
            className="flex flex-col rounded-2xl bg-surface-container-lowest border border-outline-variant/30 overflow-hidden shadow-sm hover:shadow-lg transition-all group"
          >
            <div className="aspect-video overflow-hidden bg-surface-container-low">
              <img
                src={art.image}
                alt={art.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-secondary bg-surface-container px-2.5 py-1 rounded-full">
                  {art.category}
                </span>
                <h3 className="font-serif text-base font-bold text-primary group-hover:text-primary-container transition-colors leading-snug">
                  {art.title}
                </h3>
                <p className="text-xs text-secondary leading-relaxed line-clamp-2">
                  {art.excerpt}
                </p>
              </div>

              <div className="pt-3 border-t border-outline-variant/30 flex items-center justify-between text-[11px] text-secondary">
                <span>{art.author}</span>
                <span className="flex items-center gap-1">
                  <Clock size={12} />
                  {art.readTime}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
