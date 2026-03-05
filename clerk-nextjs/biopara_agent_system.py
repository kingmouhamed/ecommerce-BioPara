import os
import sys
import json
import re
import requests
from dotenv import load_dotenv

# Provide a fallback just in case litellm isn't completely usable
try:
    from litellm import completion
except ImportError:
    print("❌ لم يتم العثور على مكتبة litellm. يرجى تثبيتها باستخدام: pip install litellm")
    sys.exit(1)

# Load environment variables from .env.local
load_dotenv('.env.local')

# ---------------------------------------------------------
# SETUP AND CONFIGURATION
# ---------------------------------------------------------
api_key = os.environ.get("GROQ_API_KEY")
if not api_key:
    print("🔑 برجاء إدخال (أو لصق) مفتاح Groq API المجاني الخاص بك ثم اضغط Enter:")
    api_key = input("GROQ_API_KEY: ").strip()
    if not api_key:
        print("❌ لم يتم إدخال مفتاح. سيتم إيقاف النظام.")
        sys.exit(1)
    os.environ["GROQ_API_KEY"] = api_key

MODEL_NAME = "groq/llama-3.3-70b-versatile"

def call_agent(role, backstory, task_description, expected_output, input_data=""):
    system_prompt = f"""You are acting as the following expert:
Role: {role}
Backstory: {backstory}

Your Expected Output Format:
{expected_output}
"""

    user_prompt = f"""Task Description:
{task_description}

Input Data from Previous Steps (if any):
{input_data}

Provide your response according to the expected output format."""

    print(f"🤖 [Agent: {role}] is working on its task...")
    
    response = completion(
        model=MODEL_NAME,
        api_key=api_key,
        temperature=0.7,
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_prompt}
        ]
    )
    
    result = response.choices[0].message.content
    print(f"✅ [Agent: {role}] completed its task.\n")
    return result

# ---------------------------------------------------------
# 1. AGENTS & TASKS DEFINITIONS
# ---------------------------------------------------------

# Agent 1: The Researcher
research_role = 'Herbal Products & Market Researcher'
research_backstory = (
    "You are an expert market analyst in the organic and natural healthcare industry. "
    "Your role is to deeply research herbal products including ingredients, benefits, traditional uses, and modern scientific insights. "
    "You analyze competitor products in the natural health and organic cosmetics market, collect competitor pricing, and determine "
    "the optimal selling price based on market averages. You expertly identify target audiences and extract key product differentiators."
)
research_task = (
    "Conduct comprehensive research on a new herbal product: 'Organic Black Seed Oil (زيت حبة البركة العضوي)'.\n"
    "1. Research ingredients, benefits, traditional uses, and modern scientific insights.\n"
    "2. Analyze competitor products in the natural health market.\n"
    "3. Collect competitor pricing and determine the market average price.\n"
    "4. Suggest an optimal selling price in MAD (Moroccan Dirham) based on the analysis.\n"
    "5. Identify the target audience (e.g., immune support, skincare, athletes).\n"
    "6. Extract key selling points and differentiators."
)
research_output = "A structured report containing: product benefits, ingredients, target audience, competitor pricing, recommended selling price, and key selling points."

# Agent 2: The Marketing & SEO Expert
marketing_role = 'Marketing & SEO Specialist'
marketing_backstory = (
    "You are a master copywriter who specializes in Arabic e-commerce and SEO. "
    "Your words captivate audiences and convince them of the natural benefits of BioPara's products. "
    "You generate powerful Arabic product titles, write long persuasive Arabic descriptions, and craft short descriptions for product cards. "
    "You know exactly how to rank pages by generating optimized SEO metadata including meta titles, meta descriptions, and SEO keywords."
)
marketing_task = (
    "Using the structured research report, create the following e-commerce content in Arabic:\n"
    "1. A powerful, catchy Arabic product title (name_ar).\n"
    "2. A long persuasive Arabic product description for e-commerce (description_ar).\n"
    "3. A short, punchy Arabic description suitable for product cards (short_description_ar).\n"
    "4. Generate SEO metadata: meta title, meta description, and SEO keywords.\n"
    "Ensure the tone matches a premium organic brand like 'BioPara'."
)
marketing_output = "Provide the content clearly structured so the next agent can process it."

# Agent 3: The Designer / Image Prompt Specialist
design_role = 'E-commerce Creative Director & AI Prompt Engineer'
design_backstory = (
    "You are a professional graphic designer and creative director for premium organic brands. "
    "You take the Arabic name and description of a product, and generate vivid, masterfully crafted "
    "English prompts for an AI image generator to produce high-end, elegant product photography "
    "(e.g., natural lighting, organic props, premium packaging)."
)
design_task = (
    "Using the final Arabic product name and description from the Marketing Expert, \n"
    "write a detailed English prompt describing a premium, photorealistic e-commerce product photo \n"
    "that represents the BioPara brand perfectly. The prompt should specify lighting, background props, and camera style."
)
design_output = "A highly detailed AI image generation prompt in English."

# Agent 4: The Tech Specialist
tech_role = 'Full-Stack Tech Specialist & Database Manager'
tech_backstory = (
    "You are the Lead Database Administrator and Backend Engineer for the BioPara project. "
    "You never write python code or markdown. You ONLY output pure JSON. "
    "You never compromise on data integrity."
)
tech_task = (
    "Take all the content generated from previous steps.\n"
    "Your task is to prepare the final sanitized JSON payload that will be sent via API to Supabase.\n"
    "The category_id for oils is 3. Use 'MAD' for currency. Set stock to 50.\n"
    "The final image URL should be ['/images/medicinal-oils/premium-black-seed-oil.png'].\n"
    "Set an english name and a proper slug (e.g. oils-black-seed).\n"
    "Ensure you include meta_title, meta_description, and seo_keywords returned from the marketing task.\n"
    "Important: Return ONLY the JSON object. Do not wrap it in markdown block quotes (```json). No explanations."
)
tech_output = '''{
  "name": "Organic Black Seed Oil",
  "name_ar": "زيت حبة البركة العضوي",
  "slug": "oils-black-seed-oil-new",
  "description": "Premium black seed oil in English...",
  "description_ar": "الوصف الطويل المكتوب بالعربية...",
  "short_description_ar": "الوصف القصير للبطاقات...",
  "price": 220,
  "currency": "MAD",
  "stock": 50,
  "images": ["/images/medicinal-oils/premium-black-seed-oil.png"],
  "category_id": 3,
  "meta_title": "زيت حبة البركة العضوي | BioPara",
  "meta_description": "أفضل زيت حبة البركة العضوي للعناية بالبشرة والمناعة...",
  "seo_keywords": ["زيت حبة البركة", "عضوي", "BioPara", "المناعة"],
  "is_active": true,
  "featured": true
}'''

# ---------------------------------------------------------
# 2. PROCESS SEQUENTIAL WORKFLOW
# ---------------------------------------------------------

if __name__ == "__main__":
    print("🚀 CTO: Starting the Upgraded BioPara Lightweight Agent System...")
    
    # 1. Research
    research_result = call_agent(research_role, research_backstory, research_task, research_output)
    
    # 2. Marketing
    marketing_result = call_agent(marketing_role, marketing_backstory, marketing_task, marketing_output, input_data=research_result)
    
    # 3. Design Prompt
    design_result = call_agent(design_role, design_backstory, design_task, design_output, input_data=marketing_result)
    
    # 4. JSON Compilation
    tech_input = f"--- RESEARCH ---\n{research_result}\n\n--- MARKETING ---\n{marketing_result}\n\n--- DESIGN PROMPT ---\n{design_result}"
    final_json_str = call_agent(tech_role, tech_backstory, tech_task, tech_output, input_data=tech_input)
    
    print("\n================================================")
    print("✅ CTO: Workflow completed! Parsing output...")
    
    # Basic JSON extractor to handle any potential markdown output from the LLM
    json_match = re.search(r'\{.*\}', final_json_str, re.DOTALL)
    if json_match:
        final_json_str = json_match.group(0)
        
    try:
        product_data = json.loads(final_json_str)
        print("📦 Parsed JSON Data:")
        print(json.dumps(product_data, ensure_ascii=False, indent=2))
        
        sb_url = os.environ.get("NEXT_PUBLIC_SUPABASE_URL", "").strip()
        sb_key = os.environ.get("SUPABASE_SERVICE_ROLE_KEY", "").strip()
        
        with open("latest_product.json", "w", encoding="utf-8") as f:
            json.dump(product_data, f, ensure_ascii=False, indent=2)
        
        columns = ", ".join(product_data.keys())
        
        # Format the values for SQL fallback
        formatted_values = []
        for v in product_data.values():
            if isinstance(v, str):
                formatted_values.append(f"'{str(v).replace(chr(39), chr(39)*2)}'")
            elif isinstance(v, list):
                # Format arrays for Postgres
                list_str = '{"' + '","'.join(v) + '"}' 
                formatted_values.append(f"'{list_str}'::text[]")
            elif isinstance(v, bool):
                formatted_values.append("true" if v else "false")
            else:
                formatted_values.append(str(v))
                
        values = ", ".join(formatted_values)
        sql_fallback = f"INSERT INTO public.products ({columns}) VALUES ({values});"
        
        with open("latest_product.sql", "w", encoding="utf-8") as f:
            f.write(sql_fallback)
            
        if sb_url and sb_key:
            print("\n📡 Pushing to Supabase 'products' table via REST API...")
            headers = {
                "apikey": sb_key,
                "Authorization": f"Bearer {sb_key}",
                "Content-Type": "application/json",
                "Prefer": "return=representation"
            }
            
            endpoint = f"{sb_url}/rest/v1/products"
            response = requests.post(endpoint, headers=headers, json=product_data)
            
            if response.status_code in [200, 201]:
                print("================================================")
                print("🌟 SUCCESSFULLY SAVED TO DATABASE! 🌟")
                print("================================================")
            else:
                print(f"❌ SUPABASE API ERROR {response.status_code}: {response.text}")
                print(f"⚠️  Don't worry! Data was saved locally. You can copy it from 'latest_product.sql' and manually paste it in Supabase SQL Editor.")
        else:
            print("❌ ERROR: Supabase keys not found in .env.local!")
    except Exception as e:
        print(f"❌ ERROR: Failed to parse JSON or connect to Supabase: {e}")
        print("\nRaw LLM Output:")
        print(final_json_str)
