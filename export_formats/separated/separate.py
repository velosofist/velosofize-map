import re

with open('../velosofize_export.kml', encoding='utf-8') as f:
    kml = f.read()

# Find all Placemarks
placemarks = re.findall(r'(<Placemark>.*?</Placemark>)', kml, re.DOTALL)

cat_1_2 = []
cat_other = []

for pm in placemarks:
    # Extract the Категория # value from the description
    m = re.search(r'Категория #:\s*([0-9]+)', pm)
    if m:
        cat = m.group(1)
        if cat in ('1', '2'):
            cat_1_2.append(pm)
        else:
            cat_other.append(pm)
    else:
        cat_other.append(pm)

def write_kml(placemarks, output_file):
    # Copy the original KML header and footer
    header = re.split(r'<Placemark>', kml, 1)[0]
    footer = kml.rsplit('</Placemark>', 1)[-1]
    # Write new KML
    with open(output_file, 'w', encoding='utf-8') as f:
        f.write(header)
        for pm in placemarks:
            f.write(pm + '\n')
        f.write('</Document>\n</kml>\n')

write_kml(cat_1_2, 'velosofize_export_bikelanes.kml')
write_kml(cat_other, 'velosofize_export_others.kml')

print(f"Written {len(cat_1_2)} placemarks to velosofize_export_bikelanes.kml")
print(f"Written {len(cat_other)} placemarks to velosofize_export_others.kml")