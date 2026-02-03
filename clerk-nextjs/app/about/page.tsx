import React from 'react';
import Image from 'next/image';
import { ShieldCheck, Users, Leaf, Globe, CheckCircle } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white font-sans" dir="ltr">
      
      {/* Hero Section */}
      <div className="bg-emerald-900 text-white py-20 relative overflow-hidden">
        <div className="container mx-auto px-4 text-center relative z-10">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Notre Mission : Votre Bien-être Naturel</h1>
          <p className="text-emerald-100 max-w-2xl mx-auto text-lg leading-relaxed">
            BioPara n&apos;est pas seulement une parapharmacie en ligne. C&apos;est une promesse de qualité, d&apos;authenticité et de retour aux sources naturelles pour prendre soin de vous et de votre famille.
          </p>
        </div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500 rounded-full mix-blend-overlay filter blur-3xl opacity-20 transform translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-emerald-400 rounded-full mix-blend-overlay filter blur-3xl opacity-20 transform -translate-x-1/2 translate-y-1/2"></div>
      </div>

      {/* Stats Section */}
      <div className="py-12 bg-gray-50 border-b">
        <div className="container mx-auto px-4">
           <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div>
                 <div className="text-4xl font-bold text-emerald-700 mb-2">+15k</div>
                 <div className="text-gray-600 text-sm">Clients Satisfaits</div>
              </div>
              <div>
                 <div className="text-4xl font-bold text-emerald-700 mb-2">500+</div>
                 <div className="text-gray-600 text-sm">Produits Référencés</div>
              </div>
              <div>
                 <div className="text-4xl font-bold text-emerald-700 mb-2">24h</div>
                 <div className="text-gray-600 text-sm">Livraison Express</div>
              </div>
              <div>
                 <div className="text-4xl font-bold text-emerald-700 mb-2">100%</div>
                 <div className="text-gray-600 text-sm">Authenticité Garantie</div>
              </div>
           </div>
        </div>
      </div>

      {/* Story Section */}
      <div className="py-20 container mx-auto px-4">
         <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="relative h-[400px] rounded-2xl overflow-hidden shadow-xl">
               <Image 
                 src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800" 
                 alt="Laboratoire" 
                 fill 
                 className="object-cover"
               />
            </div>
            <div>
               <h2 className="text-3xl font-bold text-gray-800 mb-6">L&apos;histoire de BioPara</h2>
               <div className="space-y-4 text-gray-600 leading-relaxed">
                  <p>
                     Fondée en 2024, BioPara est née d&apos;un constat simple : il est difficile de trouver des produits parapharmaceutiques authentiques et des produits bio de qualité au même endroit, avec un conseil fiable.
                  </p>
                  <p>
                     Notre équipe, composée de pharmaciens et d&apos;experts en dermo-cosmétique, sélectionne rigoureusement chaque produit. Nous refusons les compromis sur la qualité.
                  </p>
                  <p>
                     Aujourd&apos;hui, nous sommes fiers d&apos;être le partenaire beauté et santé de milliers de Marocains, en livrant partout dans le royaume, du nord au sud.
                  </p>
               </div>
               <div className="mt-8 grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-3">
                     <CheckCircle className="text-emerald-600"/> <span>Produits certifiés</span>
                  </div>
                  <div className="flex items-center gap-3">
                     <CheckCircle className="text-emerald-600"/> <span>Service client expert</span>
                  </div>
                  <div className="flex items-center gap-3">
                     <CheckCircle className="text-emerald-600"/> <span>Stockage aux normes</span>
                  </div>
                  <div className="flex items-center gap-3">
                     <CheckCircle className="text-emerald-600"/> <span>Prix justes</span>
                  </div>
               </div>
            </div>
         </div>
      </div>

      {/* Values Section */}
      <div className="bg-emerald-50 py-20">
         <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">Nos Valeurs Fondamentales</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
               <div className="bg-white p-8 rounded-xl shadow-sm text-center hover:-translate-y-2 transition duration-300">
                  <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 mx-auto mb-6">
                     <ShieldCheck size={32}/>
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-gray-800">Confiance</h3>
                  <p className="text-gray-500 text-sm">
                     Nous ne vendons que ce que nous utiliserions nous-mêmes. La provenance de chaque produit est tracée et vérifiée.
                  </p>
               </div>
               <div className="bg-white p-8 rounded-xl shadow-sm text-center hover:-translate-y-2 transition duration-300">
                  <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 mx-auto mb-6">
                     <Leaf size={32}/>
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-gray-800">Naturel</h3>
                  <p className="text-gray-500 text-sm">
                     Nous privilégions les formulations propres, bio et respectueuses de l&apos;environnement et de votre santé.
                  </p>
               </div>
               <div className="bg-white p-8 rounded-xl shadow-sm text-center hover:-translate-y-2 transition duration-300">
                  <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 mx-auto mb-6">
                     <Users size={32}/>
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-gray-800">Proximité</h3>
                  <p className="text-gray-500 text-sm">
                     Même en ligne, nous restons proches de vous. Notre service client est disponible pour vous conseiller personnellement.
                  </p>
               </div>
            </div>
         </div>
      </div>

    </div>
  );
}