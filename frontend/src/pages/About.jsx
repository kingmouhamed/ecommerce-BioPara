import React from 'react';
import { Heart, Leaf, Users, Award } from 'lucide-react';

const About = () => {
  const features = [
    { icon: <Leaf size={32} />, title: 'منتجات طبيعية', description: 'منتجات 100% طبيعية ومختارة بعناية من أحسن الموارد المغربية' },
    { icon: <Award size={32} />, title: 'جودة عالية', description: 'جميع منتجاتنا خاضعة لمراقبة جودة صارمة وشهادات دولية' },
    { icon: <Heart size={32} />, title: 'الصحة أولاً', description: 'نهدف إلى تحسين صحة وجمال عملائنا بطرق طبيعية وآمنة' },
    { icon: <Users size={32} />, title: 'خدمة العملاء', description: 'فريق متخصص جاهز لخدمتك 24/7 والإجابة على استفساراتك' }
  ];

  return (
    <div className="about-page">
      <section className="about-hero">
        <div className="about-hero-content">
          <h1>عن متجر BioPara</h1>
          <p>متخصصون في تقديم الحلول الطبيعية والصحية للعناية بالبشرة والشعر والصحة العامة</p>
        </div>
      </section>

      <section className="about-features">
        <div className="container">
          <h2>لماذا تختار BioPara؟</h2>
          <div className="features-grid">
            {features.map((feature, index) => (
              <div key={index} className="feature-card">
                <div className="feature-icon">{feature.icon}</div>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="about-story">
        <div className="container">
          <div className="story-content">
            <div className="story-text">
              <h2>قصتنا</h2>
              <p>بدأت رحلة BioPara برؤية بسيطة: جلب أفضل المنتجات الطبيعية المغربية إلى أيدي كل شخص يسعى للعناية بصحته وجماله بطرق طبيعية.</p>
              <p>نحن نعمل بشكل مباشر مع منتجي الأعشاب والمنتجات الطبيعية في المناطق الريفية بالمغرب، مما يضمن الجودة والأصالة في كل منتج.</p>
              <p>اليوم، نفخر بخدمة آلاف العملاء الراضين الذين يثقون بمنتجاتنا ويوصيون الآخرين بها.</p>
            </div>
            <div className="story-stats">
              <div className="stat">
                <h3>50000+</h3>
                <p>عميل سعيد</p>
              </div>
              <div className="stat">
                <h3>200+</h3>
                <p>منتج متنوع</p>
              </div>
              <div className="stat">
                <h3>10+</h3>
                <p>سنوات من الخبرة</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="about-values">
        <div className="container">
          <h2>قيمنا الأساسية</h2>
          <ul className="values-list">
            <li><strong>الجودة:</strong> لا نساوم على جودة المنتجات</li>
            <li><strong>الطبيعية:</strong> 100% منتجات طبيعية وعضوية</li>
            <li><strong>الشفافية:</strong> معلومات واضحة عن كل منتج</li>
            <li><strong>الاستدامة:</strong> نهتم بالبيئة والمجتمع المحلي</li>
            <li><strong>الابتكار:</strong> نسعى لإيجاد أفضل الحلول</li>
          </ul>
        </div>
      </section>
    </div>
  );
};

export default About;