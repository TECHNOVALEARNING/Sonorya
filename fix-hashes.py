import re

def fix_file(filepath):
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
    except FileNotFoundError:
        return
    
    def repl(m):
        target = m.group(1)
        if target == '':
            return f'href="#" onClick={{(e) => e.preventDefault()}}'
        else:
            return f'href="#" onClick={{(e) => {{ e.preventDefault(); document.getElementById(\'{target}\')?.scrollIntoView({{behavior: \'smooth\'}}); }}}}'
            
    new_content = re.sub(r'href="#([a-zA-Z0-9_-]*)"', repl, content)
    
    if new_content != content:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f"Updated {filepath}")

fix_file('src/components/izimelo/IzimeloHeader.tsx')
fix_file('src/components/landing/LandingFooter.tsx')
fix_file('src/components/izimelo/IzimeloHero.tsx')
fix_file('src/components/izimelo/IzimeloPricing.tsx')
