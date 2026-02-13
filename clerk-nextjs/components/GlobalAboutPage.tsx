"use client";

import React from 'react';
import Image from 'next/image';
import { 
  Globe, 
  Award, 
  Users, 
  Heart, 
  Shield, 
  Truck, 
  Clock, 
  Target, 
  ChevronRight,
  MapPin,
  Mail,
  Phone,
  Star,
  TrendingUp,
  Leaf,
  Sparkles
} from 'lucide-react';

export default function GlobalAboutPage() {
  const milestones = [
    {
      year: '2008',
      title: 'Our Beginning',
      description: 'Founded in Morocco with a vision to share authentic natural wellness with the world.',
      icon: <Leaf className="w-6 h-6" />
    },
    {
      year: '2012',
      title: 'First International Expansion',
      description: 'Expanded to European markets, bringing Moroccan argan oil to global customers.',
      icon: <Globe className="w-6 h-6" />
    },
    {
      year: '2016',
      title: 'Quality Recognition',
      description: 'Achieved ISO 9001 and GMP certifications, establishing our commitment to excellence.',
      icon: <Award className="w-6 h-6" />
    },
    {
      year: '2020',
      title: 'Digital Transformation',
      description: 'Launched our global e-commerce platform, reaching customers in 50+ countries.',
      icon: <TrendingUp className="w-6 h-6" />
    },
    {
      year: '2024',
      title: 'Global Wellness Leader',
      description: 'Trusted by over 1 million customers worldwide, becoming a premium wellness brand.',
      icon: <Star className="w-6 h-6" />
    }
  ];

  const values = [
    {
      title: 'Authenticity',
      description: 'We source our ingredients directly from Morocco, ensuring 100% authenticity and purity.',
      icon: <Shield className="w-8 h-8" />,
      color: 'text-blue-600'
    },
    {
      title: 'Sustainability',
      description: 'Committed to sustainable practices that protect our environment and support local communities.',
      icon: <Leaf className="w-8 h-8" />,
      color: 'text-green-600'
    },
    {
      title: 'Innovation',
      description: 'Combining traditional wisdom with modern science to create effective wellness solutions.',
      icon: <Sparkles className="w-8 h-8" />,
      color: 'text-purple-600'
    },
    {
      title: 'Customer Care',
      description: 'Dedicated to providing exceptional service and support to our global community.',
      icon: <Heart className="w-8 h-8" />,
      color: 'text-red-600'
    }
  ];

  const stats = [
    { number: '1M+', label: 'Happy Customers', icon: <Users className="w-5 h-5" /> },
    { number: '50+', label: 'Countries', icon: <Globe className="w-5 h-5" /> },
    { number: '15+', label: 'Years Experience', icon: <Clock className="w-5 h-5" /> },
    { number: '100%', label: 'Natural Ingredients', icon: <Leaf className="w-5 h-5" /> }
  ];

  const team = [
    {
      name: 'Dr. Karim Alami',
      role: 'Founder & CEO',
      image: '/team/founder.jpg',
      bio: 'Pharmacist with a passion for natural wellness and Moroccan heritage.'
    },
    {
      name: 'Sarah Johnson',
      role: 'Global Operations Director',
      image: '/team/operations.jpg',
      bio: 'Expert in international logistics and supply chain management.'
    },
    {
      name: 'Prof. Marie Dubois',
      role: 'Head of R&D',
      image: '/team/rd.jpg',
      bio: 'Leading scientist in natural product research and development.'
    },
    {
      name: 'Ahmed Hassan',
      role: 'Quality Assurance Manager',
      image: '/team/quality.jpg',
      bio: 'Ensuring the highest standards of quality and safety.'
    }
  ];

  const certifications = [
    {
      name: 'ISO 9001:2015',
      description: 'Quality Management System',
      icon: <Award className="w-8 h-8" />
    },
    {
      name: 'GMP Certified',
      description: 'Good Manufacturing Practices',
      icon: <Shield className="w-8 h-8" />
    },
    {
      name: 'Organic Certification',
      description: '100% Natural Organic Products',
      icon: <Leaf className="w-8 h-8" />
    },
    {
      name: 'FDA Approved',
      description: 'US Food & Drug Administration',
      icon: <Target className="w-8 h-8" />
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 font-sans" dir="rtl">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-emerald-50 to-teal-50 py-20 overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%231B5E20' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }}></div>
        </div>
        
        <div className="container mx-auto px-4">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-amber-100 text-amber-800 px-4 py-2 rounded-full text-sm font-semibold mb-6">
              <Globe className="w-4 h-4" />
              <span>Since 2008</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              From Morocco to the World
              <span className="block text-emerald-600">Our Journey of Natural Wellness</span>
            </h1>
            
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              For over 15 years, BioPara has been bridging traditional Moroccan wellness with modern global standards, 
              bringing nature&apos;s finest ingredients to customers worldwide.
            </p>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="flex items-center justify-center gap-2 text-emerald-600 mb-2">
                    {stat.icon}
                    <span className="text-3xl font-bold">{stat.number}</span>
                  </div>
                  <div className="text-gray-600 font-medium">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Story</h2>
              <div className="space-y-4 text-gray-600 leading-relaxed">
                <p>
                  Founded in 2008 in the heart of Morocco, BioPara began with a simple yet powerful vision: 
                  to share the authentic wellness traditions of Morocco with the world. Our founder, 
                  a passionate pharmacist, recognized the incredible potential of Morocco&apos;s natural resources 
                  – from the golden argan oil of the Atlas Mountains to the healing herbs of the Mediterranean coast.
                </p>
                <p>
                  What started as a small local pharmacy has grown into a global wellness brand, 
                  trusted by over 1 million customers across 50+ countries. Our commitment to quality, 
                  authenticity, and sustainability has remained unchanged throughout our journey.
                </p>
                <p>
                  Today, BioPara stands as a bridge between ancient wisdom and modern science, 
                  delivering premium natural wellness products that respect both tradition and innovation.
                </p>
              </div>
            </div>
            
            <div className="relative">
              <div className="aspect-square bg-gradient-to-br from-emerald-100 to-teal-100 rounded-2xl overflow-hidden">
                <div className="w-full h-full flex items-center justify-center">
                  <div className="text-center">
                    <Globe className="w-24 h-24 text-emerald-600 mx-auto mb-4" />
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">BioPara Global</h3>
                    <p className="text-gray-600">Premium Natural Wellness</p>
                  </div>
                </div>
              </div>
              <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-emerald-100 rounded-full opacity-50 blur-xl"></div>
              <div className="absolute -top-6 -left-6 w-24 h-24 bg-teal-100 rounded-full opacity-50 blur-xl"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Journey</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Key milestones that shaped our path to becoming a global wellness leader
            </p>
          </div>
          
          <div className="relative">
            <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-emerald-200"></div>
            
            <div className="space-y-12">
              {milestones.map((milestone, index) => (
                <div key={index} className={`flex items-center ${index % 2 === 0 ? 'flex-row-reverse' : ''}`}>
                  <div className="flex-1">
                    <div className={`bg-white p-6 rounded-xl shadow-sm ${index % 2 === 0 ? 'text-right' : ''}`}>
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600">
                          {milestone.icon}
                        </div>
                        <div>
                          <div className="text-2xl font-bold text-emerald-600">{milestone.year}</div>
                          <div className="font-semibold text-gray-900">{milestone.title}</div>
                        </div>
                      </div>
                      <p className="text-gray-600">{milestone.description}</p>
                    </div>
                  </div>
                  
                  <div className="relative">
                    <div className="w-8 h-8 bg-emerald-600 rounded-full border-4 border-white shadow-lg"></div>
                  </div>
                  
                  <div className="flex-1"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Values</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              The principles that guide everything we do
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div key={index} className="text-center">
                <div className={`w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 ${value.color}`}>
                  {value.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{value.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Meet Our Team</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              The passionate people behind BioPara&apos;s global success
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <div key={index} className="text-center">
                <div className="w-32 h-32 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <Users className="w-16 h-16 text-gray-400" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-1">{member.name}</h3>
                <div className="text-emerald-600 font-medium mb-2">{member.role}</div>
                <p className="text-gray-600 text-sm">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Certifications */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Quality & Certifications</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Our commitment to excellence is recognized by international standards
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {certifications.map((cert, index) => (
              <div key={index} className="bg-gray-50 p-6 rounded-xl text-center">
                <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4 text-emerald-600">
                  {cert.icon}
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{cert.name}</h3>
                <p className="text-gray-600 text-sm">{cert.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-20 bg-emerald-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Join Our Global Community</h2>
          <p className="text-emerald-100 mb-8 max-w-2xl mx-auto">
            Connect with us and be part of our journey to bring natural wellness to the world
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <a href="mailto:info@biopara.com" className="bg-white text-emerald-700 px-6 py-3 rounded-lg font-semibold hover:bg-emerald-50 transition flex items-center gap-2">
              <Mail className="w-5 h-5" />
              Contact Us
            </a>
            <a href="tel:+212600000000" className="bg-emerald-700 text-white px-6 py-3 rounded-lg font-semibold hover:bg-emerald-800 transition flex items-center gap-2">
              <Phone className="w-5 h-5" />
              Call Us
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
