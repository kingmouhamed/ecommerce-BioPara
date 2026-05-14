import os
import glob
import re

def fix_mojibake(text):
    # This is a robust way to fix double-encoded UTF-8 that was read as CP1252 or Latin-1
    # We find sequences of high-ansi characters and try to fix them.
    def replace_match(match):
        s = match.group(0)
        # Try CP1252 first (standard for Windows Arabic issues)
        try:
            return s.encode('cp1252').decode('utf-8')
        except:
            try:
                return s.encode('latin-1').decode('utf-8')
            except:
                return s

    # Regex for characters >= 0x80 plus common CP1252 symbols that appear in mojibake
    # like ellipsis (...), em-dash (—), curly quotes, etc.
    pattern = re.compile(r'[\u0080-\u00FF\u2013\u2014\u2018\u2019\u201C\u201D\u2022\u2026\u201E\u0152\u0153\u0160\u0161\u0178\u017D\u017E\u02DC\u0152]+')
    return pattern.sub(replace_match, text)

def process_file(file_path):
    try:
        with open(file_path, 'rb') as f:
            raw = f.read()
        
        # Check and strip BOM
        bom = b''
        if raw.startswith(b'\xef\xbb\xbf'):
            bom = b'\xef\xbb\xbf'
            raw = raw[3:]
        
        # Decode as UTF-8 (this gives us the mojibake text)
        text = raw.decode('utf-8')
        
        # Fix it
        fixed_text = fix_mojibake(text)
        
        if fixed_text != text:
            # Write back as clean UTF-8
            with open(file_path, 'wb') as f:
                f.write(fixed_text.encode('utf-8'))
            return True
    except Exception as e:
        print(f"Error processing {file_path}: {e}")
    return False

if __name__ == "__main__":
    dirs = [
        'lib/patient/screens',
        'lib/patient/widgets',
        'lib/admin/screens',
        'lib/core/providers',
        'lib/core/services',
        'lib/core/models',
        'lib'
    ]
    
    total_fixed = 0
    for d in dirs:
        for f_path in glob.glob(os.path.join(d, '*.dart')):
            if os.path.isfile(f_path):
                if process_file(f_path):
                    print(f"Fixed: {f_path}")
                    total_fixed += 1
    
    print(f"\nDone! Fixed {total_fixed} files.")
