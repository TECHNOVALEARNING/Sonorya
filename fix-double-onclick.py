import re

def fix(filepath):
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
    except Exception as e:
        return

    def repl(m):
        target = m.group(1)
        action = m.group(2)
        return f'onClick={{(e) => {{ e.preventDefault(); document.getElementById(\'{target}\')?.scrollIntoView({{behavior: \'smooth\'}}); {action}; }}}}'
        
    content = re.sub(r'onClick=\{\(e\) => \{ e\.preventDefault\(\); document\.getElementById\(\'([a-zA-Z0-9_-]*)\'\)\?\.scrollIntoView\(\{behavior: \'smooth\'\}\); \}\} onClick=\{\(\) => (.*?)\}', repl, content)
    
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

fix('src/components/izimelo/IzimeloHeader.tsx')
fix('src/components/landing/LandingFooter.tsx')
