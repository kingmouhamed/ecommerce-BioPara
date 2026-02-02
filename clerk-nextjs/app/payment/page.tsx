"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { CheckCircle, CreditCard, Truck, User, MapPin, ChevronRight, Lock } from "lucide-react";

export default function CheckoutPage() {
  const [step, setStep] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState("cod"); // cod = Cash on Delivery

  // مكون لعرض خطوة
  const StepIndicator = ({ num, title, current }: { num: number, title: string, current: number }) => (
    <div className={`flex flex-col items-center relative z-10 w-1/3`}>
      <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg mb-2 transition-colors duration-300 ${current >= num ? 'bg-emerald-700 text-white' : 'bg-gray-200 text-gray-500'}`}>
        {current > num ? <CheckCircle size={20} /> : num}
      </div>
      <span className={`text-xs font-bold uppercase tracking-wider ${current >= num ? 'text-emerald-800' : 'text-gray-400'}`}>{title}</span>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-12 font-sans" dir="ltr">
      <div className="container mx-auto px-4 max-w-6xl">
        
        {/* Progress Bar */}
        <div className="mb-12 relative">
          <div className="absolute top-5 left-0 w-full h-1 bg-gray-200 -z-0"></div>
          <div className="absolute top-5 left-0 h-1 bg-emerald-600 transition-all duration-500 -z-0" style={{ width: step === 1 ? '16%' : step === 2 ? '50%' : '100%' }} aria-hidden="true"></div>
          <div className="flex justify-between relative">
             <StepIndicator num={1} title="Information" current={step} />
             <StepIndicator num={2} title="Livraison" current={step} />
             <StepIndicator num={3} title="Paiement" current={step} />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Main Form Area */}
          <div className="lg:col-span-8">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              
              {/* Header */}
              <div className="bg-gray-50 px-8 py-4 border-b flex items-center justify-between">
                <h2 className="font-bold text-lg text-gray-800 flex items-center gap-2">
                  {step === 1 && <User size={20}/>}
                  {step === 2 && <Truck size={20}/>}
                  {step === 3 && <CreditCard size={20}/>}
                  {step === 1 && "Vos Coordonnées"}
                  {step === 2 && "Mode de Livraison"}
                  {step === 3 && "Paiement Sécurisé"}
                </h2>
                <span className="text-xs text-gray-500">Étape {step} sur 3</span>
              </div>

              <div className="p-8">
                {/* Step 1: Information */}
                {step === 1 && (
                  <form className="space-y-6">
                    <div className="grid grid-cols-2 gap-6">
                      <div>
                         <label className="block text-sm font-medium text-gray-700 mb-1">Prénom</label>
                         <input type="text" className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none" placeholder="Ali"/>
                      </div>
                      <div>
                         <label className="block text-sm font-medium text-gray-700 mb-1">Nom</label>
                         <input type="text" className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none" placeholder="Benani"/>
                      </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                        <input type="email" className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none" placeholder="exemple@email.com"/>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Adresse complète</label>
                        <input type="text" className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none" placeholder="123 Rue de la Liberté, Appt 4"/>
                    </div>
                    <div className="grid grid-cols-2 gap-6">
                      <div>
                         <label htmlFor="ville-select" className="block text-sm font-medium text-gray-700 mb-1">Ville</label>
                         <select id="ville-select" className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none bg-white">
                            <option>Casablanca</option>
                            <option>Rabat</option>
                            <option>Marrakech</option>
                            <option>Tanger</option>
                            <option>Oujda</option>
                         </select>
                      </div>
                      <div>
                         <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone</label>
                         <input type="tel" className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none" placeholder="06 00 00 00 00"/>
                      </div>
                    </div>
                  </form>
                )}

                {/* Step 2: Livraison */}
                {step === 2 && (
                  <div className="space-y-4">
                     <label className="flex items-center justify-between p-4 border-2 border-emerald-600 bg-emerald-50 rounded-lg cursor-pointer transition">
                        <div className="flex items-center gap-4">
                           <div className="w-6 h-6 rounded-full border-4 border-emerald-600 bg-white"></div>
                           <div>
                              <div className="font-bold text-gray-800">Livraison à Domicile Standard</div>
                              <div className="text-sm text-gray-500">24h - 48h (Amana / Aramex)</div>
                           </div>
                        </div>
                        <div className="font-bold text-emerald-700">40.00 DH</div>
                     </label>

                     <label className="flex items-center justify-between p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition opacity-60">
                        <div className="flex items-center gap-4">
                           <div className="w-6 h-6 rounded-full border border-gray-300 bg-white"></div>
                           <div>
                              <div className="font-bold text-gray-800">Point Relais (Indisponible)</div>
                              <div className="text-sm text-gray-500">Retrait en agence</div>
                           </div>
                        </div>
                        <div className="font-bold text-gray-600">20.00 DH</div>
                     </label>
                  </div>
                )}

                {/* Step 3: Paiement */}
                {step === 3 && (
                  <div className="space-y-4">
                    <label onClick={() => setPaymentMethod('cod')} className={`flex items-center gap-4 p-5 border rounded-lg cursor-pointer transition ${paymentMethod === 'cod' ? 'border-emerald-600 ring-1 ring-emerald-600 bg-emerald-50' : 'hover:bg-gray-50'}`}>
                       <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${paymentMethod === 'cod' ? 'border-emerald-600' : 'border-gray-400'}`}>
                          {paymentMethod === 'cod' && <div className="w-2.5 h-2.5 bg-emerald-600 rounded-full"></div>}
                       </div>
                       <div className="flex-1">
                          <div className="font-bold text-gray-800">Paiement à la livraison</div>
                          <div className="text-sm text-gray-500">Payez en espèces lorsque vous recevez votre commande.</div>
                       </div>
                       <Truck className="text-gray-400"/>
                    </label>

                    <label onClick={() => setPaymentMethod('card')} className={`flex items-center gap-4 p-5 border rounded-lg cursor-pointer transition ${paymentMethod === 'card' ? 'border-emerald-600 ring-1 ring-emerald-600 bg-emerald-50' : 'hover:bg-gray-50'}`}>
                       <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${paymentMethod === 'card' ? 'border-emerald-600' : 'border-gray-400'}`}>
                          {paymentMethod === 'card' && <div className="w-2.5 h-2.5 bg-emerald-600 rounded-full"></div>}
                       </div>
                       <div className="flex-1">
                          <div className="font-bold text-gray-800">Paiement par Carte Bancaire</div>
                          <div className="text-sm text-gray-500">Sécurisé par CMI (Visa, MasterCard).</div>
                       </div>
                       <CreditCard className="text-gray-400"/>
                    </label>
                    
                    {paymentMethod === 'card' && (
                        <div className="p-4 bg-yellow-50 border border-yellow-200 rounded text-sm text-yellow-800 flex items-center gap-2">
                           <Lock size={16}/> Vous serez redirigé vers la page de paiement sécurisée CMI après confirmation.
                        </div>
                    )}
                  </div>
                )}

              </div>

              {/* Footer Actions */}
              <div className="bg-gray-50 px-8 py-6 border-t flex justify-between items-center">
                {step > 1 ? (
                   <button onClick={() => setStep(step - 1)} className="text-gray-600 font-medium hover:text-gray-800">
                      Retour
                   </button>
                ) : (
                   <div></div> 
                )}
                
                <button 
                  onClick={() => step < 3 ? setStep(step + 1) : alert('Commande validée !')}
                  className="bg-emerald-700 text-white px-8 py-3 rounded-lg font-bold hover:bg-emerald-800 transition flex items-center gap-2"
                >
                   {step === 3 ? "CONFIRMER LA COMMANDE" : "SUIVANT"} <ChevronRight size={18}/>
                </button>
              </div>

            </div>
          </div>

          {/* Sidebar Summary */}
          <div className="lg:col-span-4">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 sticky top-8">
              <h3 className="font-bold text-gray-800 mb-4 border-b pb-4">Résumé de la commande</h3>
              <div className="space-y-4 mb-6">
                 {/* Product Item Mock */}
                 <div className="flex gap-3">
                    <div className="w-16 h-16 bg-gray-100 rounded border overflow-hidden">
                       <Image src="https://images.unsplash.com/photo-1556228720-19634e23387e?w=100" alt="La Roche-Posay Anthelios" width={64} height={64} className="w-full h-full object-contain mix-blend-multiply"/>
                    </div>
                    <div className="flex-1">
                       <div className="text-sm font-bold text-gray-800 line-clamp-2">La Roche-Posay Anthelios</div>
                       <div className="text-xs text-gray-500">Qté: 1</div>
                       <div className="text-sm font-bold text-emerald-700">185.00 DH</div>
                    </div>
                 </div>
              </div>

              <div className="space-y-2 border-t pt-4 text-sm">
                 <div className="flex justify-between text-gray-600">
                    <span>Sous-total</span>
                    <span>185.00 DH</span>
                 </div>
                 <div className="flex justify-between text-gray-600">
                    <span>Livraison</span>
                    <span>40.00 DH</span>
                 </div>
                 <div className="flex justify-between font-bold text-lg text-gray-800 pt-2 border-t mt-2">
                    <span>Total</span>
                    <span>225.00 DH</span>
                 </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}