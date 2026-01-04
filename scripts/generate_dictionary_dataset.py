import csv
import json

# Definiciones extraídas de diccionarios para "picar"
dictionary_definitions = {
    "picar_comida": [
        "causar ardor o escozor en la boca",
        "provocar sensación de picante",
        "tener sabor picante",
        "producir irritación por sustancias picantes"
    ],
    "picar_insectos": [
        "introducir el aguijón o las piezas bucales",
        "morder con insecto",
        "herir con aguijón",
        "punzar con picadura"
    ],
    "picar_objetos": [
        "punzar con objeto puntiagudo",
        "herir con punta",
        "agujerear con herramienta",
        "perforar con instrumento"
    ],
    "picar_sensacion": [
        "sentir comezón o picazón",
        "experimentar escozor",
        "notar irritación en la piel",
        "percibir ardor"
    ]
}

# Vocabulario expandido desde diccionarios
vocabulary = {
    "picantes_comida": [
        "chile", "jalapeño", "habanero", "serrano", "cayena", "chipotle",
        "salsa", "wasabi", "pimienta", "curry", "jengibre", "mostaza",
        "rábano", "ají", "guindilla", "tabasco", "pimiento", "capsaicina",
        "picante", "enchiloso", "picoso", "bravo", "ardiente"
    ],
    "sensaciones": [
        "pica", "ardor", "escozor", "picazón", "comezón", "quemazón",
        "irritación", "hormigueo", "cosquilleo", "pinchazón"
    ],
    "insectos": [
        "mosquito", "abeja", "avispa", "hormiga", "pulga", "chinche",
        "tábano", "abejarrón", "avispón", "garrapata", "piojo"
    ],
    "objetos_punzantes": [
        "aguja", "alfiler", "espina", "púa", "pincho", "clavo",
        "anzuelo", "broche", "gancho", "astilla"
    ],
    "herramientas": [
        "picahielo", "picador", "pica", "punzón", "lezna", "berbiquí"
    ],
    "plantas": [
        "cactus", "nopal", "ortiga", "zarza", "rosal", "espino", "cardón"
    ],
    "verbos_accion": [
        "picar", "pinchar", "punzar", "clavar", "herir", "morder",
        "aguijonear", "perforar", "traspasar"
    ],
    "partes_cuerpo": [
        "lengua", "boca", "labios", "garganta", "paladar", "nariz",
        "piel", "brazo", "pierna", "mano", "ojos", "cara"
    ],
    "alimentos_no_picantes": [
        "pan", "leche", "agua", "azúcar", "miel", "chocolate",
        "fresa", "manzana", "plátano", "uva", "melón", "sandía",
        "queso", "pasta", "arroz", "papa", "zanahoria", "lechuga"
    ],
    "pronombres": [
        "me", "te", "le", "nos", "les", "se"
    ],
    "sujetos": [
        "yo", "tú", "él", "ella", "nosotros", "ellos", "ellas",
        "alguien", "uno", "persona"
    ]
}

# Patrones de oraciones desde diccionarios
sentence_patterns = []

# 1. PICA - Comida picante con acción presente
for comida in vocabulary["picantes_comida"][:15]:
    sentence_patterns.append((f"El {comida} me pica la boca", "pica"))
    sentence_patterns.append((f"Siento que el {comida} pica", "pica"))
    sentence_patterns.append((f"Me pica cuando como {comida}", "pica"))
    sentence_patterns.append((f"Me enchilé con la{comida}", "pica"))
    sentence_patterns.append((f"Me enchilé con el {comida}", "pica"))
    
for sensacion in vocabulary["sensaciones"][:8]:
    sentence_patterns.append((f"Siento {sensacion} en la lengua", "pica"))
    sentence_patterns.append((f"Me causa {sensacion}", "pica"))

# 2. PICA - Insectos con agente
for insecto in vocabulary["insectos"][:10]:
    sentence_patterns.append((f"El {insecto} me pica", "pica"))
    sentence_patterns.append((f"Me picó un {insecto}", "pica"))
    sentence_patterns.append((f"Siento que me pica por el {insecto}", "pica"))


# 3. PICA - Objetos punzantes CON agente
for objeto in vocabulary["objetos_punzantes"][:8]:
    sentence_patterns.append((f"Me pica con la {objeto}", "pica"))
    sentence_patterns.append((f"La {objeto} me está picando", "pica"))
    sentence_patterns.append((f"Me pincha la {objeto}", "pica"))
    sentence_patterns.append((f"Me pinche con la {objeto}", "pica"))
    sentence_patterns.append((f"Me espine con {objeto}", "pica"))


# 4. PICA - Plantas con espinas
for planta in vocabulary["plantas"][:6]:
    sentence_patterns.append((f"Me pican las espinas del {planta}", "pica"))
    sentence_patterns.append((f"El {planta} me picó", "pica"))

# 5. NO PICA - Objetos solos sin agente
for herramienta in vocabulary["herramientas"]:
    sentence_patterns.append((f"Un {herramienta}", "no_pica"))
    sentence_patterns.append((f"Tengo un {herramienta}", "no_pica"))
    sentence_patterns.append((f"El {herramienta} está aquí", "no_pica"))

for objeto in vocabulary["objetos_punzantes"][:8]:
    sentence_patterns.append((f"Una {objeto}", "no_pica"))
    sentence_patterns.append((f"La {objeto} está en la mesa", "no_pica"))

# 6. NO PICA - Preguntas
for comida in vocabulary["picantes_comida"][:12]:
    sentence_patterns.append((f"¿Pica el {comida}?", "no_pica"))
    sentence_patterns.append((f"¿Pica el {objeto}?", "no_pica"))
    sentence_patterns.append((f"¿Pica la {herramienta}?", "no_pica"))
    sentence_patterns.append((f"¿Te pica la {comida}?", "no_pica"))
    sentence_patterns.append((f"¿Te pica la {objeto}?", "no_pica"))
    sentence_patterns.append((f"¿Picará la {comida}?", "no_pica"))
    sentence_patterns.append((f"¿Pica esta {objeto}?", "no_pica"))
    sentence_patterns.append((f"¿Pica esta {herramienta}?", "no_pica"))

sentence_patterns.extend([
    ("¿Qué tan picante es?", "no_pica"),
    ("¿Cuánto pica?", "no_pica"),
    ("¿Me va a picar?", "no_pica"),
    ("¿Te picó?", "no_pica"),
    ("¿Por qué pica tanto?", "no_pica"),
    ("¿Pica?", "no_pica"),
])

# 7. NO PICA - Futuro
sentence_patterns.extend([
    ("Mañana comeré algo picante", "no_pica"),
    ("Va a picar cuando lo pruebe", "no_pica"),
    ("Comeremos chile después", "no_pica"),
    ("Probará algo que pica", "no_pica"),
    ("El año que viene comeré picante", "no_pica"),
])

# 8. NO PICA - Objetos solo mencionados
for comida in vocabulary["picantes_comida"][:15]:
    sentence_patterns.append((f"Tengo {comida} en casa", "no_pica"))
    sentence_patterns.append((f"El {comida} está fresco", "no_pica"))
    sentence_patterns.append((f"Compré {comida}", "no_pica"))

for insecto in vocabulary["insectos"][:8]:
    sentence_patterns.append((f"Un {insecto}", "no_pica"))
    sentence_patterns.append((f"Veo un {insecto}", "no_pica"))

# 9. NO PICA - Alimentos no picantes
for alimento in vocabulary["alimentos_no_picantes"]:
    sentence_patterns.append((f"El {alimento} no pica", "no_pica"))
    sentence_patterns.append((f"Me gusta el {alimento}", "no_pica"))

# 10. PICA - Sensaciones actuales en partes del cuerpo
for parte in vocabulary["partes_cuerpo"][:10]:
    sentence_patterns.append((f"Me pica la {parte}", "pica"))
    sentence_patterns.append((f"Siento picazón en la {parte}", "pica"))

# 11. PICA - Verbos de acción presentes
verbos_presente = ["pica", "pincha", "punza", "arde", "quema"]
for verbo in verbos_presente:
    sentence_patterns.append((f"Me {verbo} mucho", "pica"))
    sentence_patterns.append((f"Esto me {verbo}", "pica"))

# 12. NO PICA - Condicionales y dudas
sentence_patterns.extend([
    ("Tal vez pique", "no_pica"),
    ("Puede que pique", "no_pica"),
    ("No sé si pica", "no_pica"),
    ("Dime si pica", "no_pica"),
    ("Quiero saber si pica", "no_pica"),
    ("No estoy seguro si pica", "no_pica"),
    ("No creo que pica", "no_pica"),
    ("Ojalá no pica", "no_pica"),
    (" me pinchara", "no_pica"),
    
])

# Guardar dataset expandido
with open('public/dataset_extended.csv', 'w', newline='', encoding='utf-8') as f:
    writer = csv.writer(f)
    writer.writerow(['text', 'label'])
    for text, label in sentence_patterns:
        writer.writerow([text, label])

# Guardar vocabulario en JSON para referencia
with open('public/vocabulary.json', 'w', encoding='utf-8') as f:
    json.dump(vocabulary, f, ensure_ascii=False, indent=2)

# Guardar definiciones de diccionario
with open('public/dictionary_definitions.json', 'w', encoding='utf-8') as f:
    json.dump(dictionary_definitions, f, ensure_ascii=False, indent=2)

print(f" Dataset extendido generado: {len(sentence_patterns)} ejemplos")
print(f" Vocabulario guardado: {sum(len(v) for v in vocabulary.values())} palabras")
print(f" Definiciones de diccionario guardadas: {sum(len(v) for v in dictionary_definitions.values())} definiciones")

# Estadísticas
pica_count = sum(1 for _, label in sentence_patterns if label == "pica")
no_pica_count = sum(1 for _, label in sentence_patterns if label == "no_pica")
print(f"\n Distribución:")
print(f"   - PICA: {pica_count} ejemplos ({pica_count/len(sentence_patterns)*100:.1f}%)")
print(f"   - NO PICA: {no_pica_count} ejemplos ({no_pica_count/len(sentence_patterns)*100:.1f}%)")
