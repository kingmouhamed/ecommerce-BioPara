"use client";

import React from "react";
import Link from "next/link";
import { FileText, Shield, Truck, CreditCard, HelpCircle } from "lucide-react";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gray-50 font-sans" dir="ltr">
      
      {/* Header */}
      <div className="bg-white border-b py-12">
         <div className="container mx-auto px-4 text-center">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Conditions Générales de Vente</h1>
            <p className="text-gray-500">Dernière mise à jour : 01 Février 2026</p>
         </div>
      </div>

      <div className="container mx-auto px-4 py-12 max-w-5xl">
         <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
            
            {/* Sidebar Navigation (Sticky) */}
            <div className="md:col-span-4 lg:col-span-3">
               <div className="sticky top-24 space-y-2">
                  <a href="#article1" className="flex items-center gap-3 p-3 bg-white rounded-lg shadow-sm border border-emerald-100 text-emerald-700 font-medium hover:bg-emerald-50 transition">
                     <FileText size={18}/> Objet
                  </a>
                  <a href="#article2" className="flex items-center gap-3 p-3 bg-white rounded-lg shadow-sm border border-gray-100 text-gray-600 hover:text-emerald-700 hover:bg-gray-50 transition">
                     <Shield size={18}/> Produits
                  </a>
                  <a href="#article3" className="flex items-center gap-3 p-3 bg-white rounded-lg shadow-sm border border-gray-100 text-gray-600 hover:text-emerald-700 hover:bg-gray-50 transition">
                     <CreditCard size={18}/> Prix & Paiement
                  </a>
                  <a href="#article4" className="flex items-center gap-3 p-3 bg-white rounded-lg shadow-sm border border-gray-100 text-gray-600 hover:text-emerald-700 hover:bg-gray-50 transition">
                     <Truck size={18}/> Livraison
                  </a>
                  <a href="#contact" className="flex items-center gap-3 p-3 bg-white rounded-lg shadow-sm border border-gray-100 text-gray-600 hover:text-emerald-700 hover:bg-gray-50 transition">
                     <HelpCircle size={18}/> Contact
                  </a>
               </div>
            </div>

            {/* Content */}
            <div className="md:col-span-8 lg:col-span-9 space-y-12">
               
               <section id="article1" className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
                  <h2 className="text-2xl font-bold text-gray-800 mb-4 border-b pb-2">Article 1 : Objet</h2>
                  <p className="text-gray-600 leading-relaxed">
                     Les présentes conditions régissent les ventes par la société <strong>BioPara Maroc</strong> de produits parapharmaceutiques et cosmétiques. Ces conditions s&apos;appliquent à l&apos;exclusion de toutes autres conditions, notamment celles en vigueur pour les ventes en magasin.
                  </p>
               </section>

               <section id="article2" className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
                  <h2 className="text-2xl font-bold text-gray-800 mb-4 border-b pb-2">Article 2 : Produits</h2>
                  <p className="text-gray-600 leading-relaxed mb-4">
                     Les produits proposés sont ceux qui figurent dans le catalogue publié sur le site, dans la limite des stocks disponibles. Chaque produit est accompagné d&apos;un descriptif établi par le fournisseur.
                  </p>
                  <div className="bg-yellow-50 p-4 rounded-lg border-l-4 border-yellow-400 text-sm text-yellow-800">
                     <strong>Note :</strong> Les photographies du catalogue sont les plus fidèles possibles mais ne peuvent assurer une similitude parfaite avec le produit offert.
                  </div>
               </section>

               <section id="article3" className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
                  <h2 className="text-2xl font-bold text-gray-800 mb-4 border-b pb-2">Article 3 : Prix et Paiement</h2>
                  <p className="text-gray-600 leading-relaxed mb-4">
                     Les prix sont indiqués en Dirhams Marocains (DH) toutes taxes comprises (TTC). BioPara se réserve le droit de modifier ses prix à tout moment.
                  </p>
                  <ul className="list-disc pl-5 space-y-2 text-gray-600">
                     <li>Le paiement est exigible immédiatement à la commande (Carte Bancaire).</li>
                     <li>Ou au moment de la livraison (Paiement à la livraison).</li>
                  </ul>
               </section>

               <section id="article4" className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
                  <h2 className="text-2xl font-bold text-gray-800 mb-4 border-b pb-2">Article 4 : Livraison</h2>
                  <p className="text-gray-600 leading-relaxed">
                     Les livraisons sont faites à l&apos;adresse indiquée sur le bon de commande. Les risques sont à la charge de l&apos;acquéreur à compter du moment où les produits ont quitté les locaux de BioPara. En cas de dommage pendant le transport, la protestation motivée doit être formulée auprès du transporteur dans un délai de trois jours à compter de la livraison.
                  </p>
               </section>

               <section id="contact" className="bg-emerald-50 p-8 rounded-xl border border-emerald-100 text-center">
                  <h3 className="font-bold text-emerald-800 mb-2">Des questions sur nos conditions ?</h3>
                  <p className="text-emerald-700 mb-6 text-sm">Notre service juridique est à votre disposition.</p>
                  <Link href="/contact" className="bg-emerald-700 text-white px-6 py-2 rounded-lg font-bold hover:bg-emerald-800 transition">
                     Contactez-nous
                  </Link>
               </section>

            </div>
         </div>
      </div>
    </div>
  );
}