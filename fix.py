import re
with open('certificates.html', 'r', encoding='utf-8') as f:
    content = f.read()
content = re.sub(r' data-i18n="cert_placeholder_title"', '', content)
content = re.sub(r' data-i18n="cert_placeholder_issuer"', '', content)
content = re.sub(r' data-i18n="cert_placeholder_date"', '', content)
with open('certificates.html', 'w', encoding='utf-8') as f:
    f.write(content)
print("Done")