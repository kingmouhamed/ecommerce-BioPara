import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase credentials');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function translateHerbs() {
    const translations = {
        'herbs-anise-herb': { name_ar: 'اليانسون', description_ar: 'أعشاب اليانسون طبيعية وعضوية، مثالية للاستخدام اليومي.' },
        'herbs-camomile-herb': { name_ar: 'البابونج', description_ar: 'أعشاب البابونج طبيعية وعضوية، مثالية للاستخدام اليومي.' },
        'herbs-cinnamon-herb': { name_ar: 'القرفة', description_ar: 'أعشاب القرفة طبيعية وعضوية، مثالية للاستخدام اليومي.' },
        'herbs-ginger-herb': { name_ar: 'الزنجبيل', description_ar: 'أعشاب الزنجبيل طبيعية وعضوية، مثالية للاستخدام اليومي.' },
        'herbs-hibiscus-herb': { name_ar: 'الكركديه', description_ar: 'أعشاب الكركديه طبيعية وعضوية، مثالية للاستخدام اليومي.' },
        'herbs-lemon-verbena-herb': { name_ar: 'اللويزة', description_ar: 'أعشاب اللويزة طبيعية وعضوية، مثالية للاستخدام اليومي.' },
        'herbs-mint-herb': { name_ar: 'النعناع', description_ar: 'أعشاب النعناع طبيعية وعضوية، مثالية للاستخدام اليومي.' },
        'herbs-sage-herb': { name_ar: 'المريمية', description_ar: 'أعشاب المريمية طبيعية وعضوية، مثالية للاستخدام اليومي.' },
        'herbs-thyme-herb': { name_ar: 'الزعتر', description_ar: 'أعشاب الزعتر طبيعية وعضوية، مثالية للاستخدام اليومي.' },
        'herbs-turmeric-herb': { name_ar: 'الكركم', description_ar: 'أعشاب الكركم طبيعية وعضوية، مثالية للاستخدام اليومي.' }
    };

    for (const [slug, data] of Object.entries(translations)) {
        const { data: result, error } = await supabase
            .from('products')
            .update({
                name_ar: `أعشاب ${data.name_ar}`,
                description_ar: data.description_ar
            })
            .eq('slug', slug);

        if (error) {
            console.error(`Error updating ${slug}:`, error.message);
        } else {
            console.log(`Updated ${slug} successfully`);
        }
    }
}

translateHerbs();
