"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { 
  Trash2, 
  Minus, 
  Plus, 
  ArrowLeft, 
  ShieldCheck, 
  CreditCard,
  Truck
} from "lucide-react";

// بيانات تجريبية للسلة
const initialCart = [
  { id: 1, title: "BioPara Argan Oil Premium", price: 250, image: "https://images.unsplash.com/photo-1571781308869-ff4585483f2a?q=80&w=200", quantity: 2 },
  { id: 2, title: "Savon Noir Beldi - Eucalyptus", price: 45, image: "https://images.unsplash.com/photo-1600607686527-6fb886090705?q=80&w=200", quantity: 1 },
];

export default function CartPage() {
  const [cartItems, setCartItems] = useState(initialCart);

  const updateQuantity = (id: number, type: "inc" | "dec") => {
    setCartItems(items => items.map(item => {
      if (item.id === id) {
        return { ...item, quantity: type === "inc" ? item.quantity + 1 : Math.max(1, item.quantity - 1) };
      }
      return item;
    }));
  };

  const removeItem = (id: number) => {
    setCartItems(items => items.filter(item => item.id !== id));
  };

  // الحسابات
  const subtotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const shipping = subtotal > 500 ? 0 : 40;
  const total = subtotal + shipping;

  if (cartItems.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center p-4">
         <div className="bg-gray-100 p-6 rounded-full mb-4">
            <CreditCard size={48} className="text-gray-400" />
         </div>
         <h2 className="text-2xl font-bold text-gray-800 mb-2">Votre panier est vide</h2>
         <p className="text-gray-500 mb-6">Il semble que vous n&apos;ayez encore rien ajouté.</p>
         <Link href="/products" className="bg-emerald-700 text-white px-8 py-3 rounded-lg font-bold hover:bg-emerald-800 transition">
            Commencer vos achats
         </Link>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen py-10 font-sans" dir="ltr">
      <div className="container mx-auto px-4">
        
        <h1 className="text-3xl font-bold mb-8 text-gray-900">Mon Panier ({cartItems.length})</h1>

        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* --- قائمة المنتجات (Table Layout) --- */}
          <div className="lg:w-2/3">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              {/* Header (Desktop only) */}
              <div className="hidden md:grid grid-cols-12 bg-gray-50 p-4 text-sm font-bold text-gray-600 border-b">
                <div className="col-span-6">PRODUIT</div>
                <div className="col-span-2 text-center">PRIX</div>
                <div className="col-span-2 text-center">QUANTITÉ</div>
                <div className="col-span-2 text-right">TOTAL</div>
              </div>

              {/* Items */}
              <div className="divide-y divide-gray-100">
                {cartItems.map((item) => (
                  <div key={item.id} className="p-4 grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                    
                    {/* Product Info */}
                    <div className="col-span-6 flex gap-4 items-center">
                        <div className="relative w-20 h-20 flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden border">
                            <Image src={item.image} alt={item.title} fill className="object-cover" />
                        </div>
                        <div>
                            <h3 className="font-bold text-gray-800 line-clamp-1">{item.title}</h3>
                            <button 
                                onClick={() => removeItem(item.id)}
                                className="text-red-500 text-sm flex items-center gap-1 mt-1 hover:underline"
                                aria-label="حذف المنتج من السلة"
                            >
                                <Trash2 size={14} /> Supprimer
                            </button>
                        </div>
                    </div>

                    {/* Price (Mobile Labelled) */}
                    <div className="col-span-2 text-center">
                        <span className="md:hidden text-gray-500 text-xs">Prix: </span>
                        <span className="font-medium text-gray-900">{item.price} DH</span>
                    </div>

                    {/* Quantity */}
                    <div className="col-span-2 flex justify-center">
                        <div className="flex items-center border rounded-lg">
                            <button onClick={() => updateQuantity(item.id, "dec")} className="p-2 hover:bg-gray-100" aria-label="تقليل الكمية"><Minus size={14} /></button>
                            <span className="w-8 text-center text-sm font-bold">{item.quantity}</span>
                            <button onClick={() => updateQuantity(item.id, "inc")} className="p-2 hover:bg-gray-100" aria-label="زيادة الكمية"><Plus size={14} /></button>
                        </div>
                    </div>

                    {/* Total Row */}
                    <div className="col-span-2 text-right font-bold text-emerald-700">
                        {(item.price * item.quantity).toFixed(2)} DH
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <Link href="/products" className="inline-flex items-center gap-2 mt-6 text-gray-600 hover:text-emerald-700 font-medium">
                <ArrowLeft size={18} /> Continuer vos achats
            </Link>
          </div>

          {/* --- ملخص الطلب (Order Summary) --- */}
          <div className="lg:w-1/3">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 sticky top-24">
                <h2 className="text-xl font-bold mb-6 border-b pb-4">Résumé de la commande</h2>
                
                <div className="space-y-3 text-sm text-gray-600 mb-6">
                    <div className="flex justify-between">
                        <span>Sous-total</span>
                        <span className="font-bold">{subtotal} DH</span>
                    </div>
                    <div className="flex justify-between">
                        <span>Livraison</span>
                        {shipping === 0 ? (
                            <span className="text-emerald-600 font-bold">Gratuit</span>
                        ) : (
                            <span>{shipping} DH</span>
                        )}
                    </div>
                    <div className="flex justify-between">
                        <span>TVA (20%)</span>
                        <span>Inclus</span>
                    </div>
                </div>

                {/* Promo Code */}
                <div className="mb-6">
                    <div className="flex gap-2">
                        <input type="text" placeholder="Code Promo" className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-emerald-500" />
                        <button className="bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-gray-800" aria-label="تطبيق كود الخصم">Appliquer</button>
                    </div>
                </div>

                <div className="border-t pt-4 mb-6">
                    <div className="flex justify-between text-xl font-bold text-gray-900">
                        <span>Total TTC</span>
                        <span>{total} DH</span>
                    </div>
                    {shipping > 0 && (
                        <p className="text-xs text-gray-500 mt-2">Livraison gratuite à partir de 500 DH</p>
                    )}
                </div>

                <Link href="/checkout" className="block w-full bg-emerald-700 text-white text-center py-4 rounded-lg font-bold hover:bg-emerald-800 transition shadow-lg shadow-emerald-200">
                    إتمام الطلب
                </Link>

                {/* Trust Badges */}
                <div className="mt-6 space-y-3">
                    <div className="flex items-center gap-3 text-xs text-gray-500">
                        <ShieldCheck size={18} className="text-emerald-600" />
                        <span>Paiement 100% Sécurisé (COD / Carte)</span>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-gray-500">
                        <Truck size={18} className="text-emerald-600" />
                        <span>Livraison partout au Maroc sous 48h</span>
                    </div>
                </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}