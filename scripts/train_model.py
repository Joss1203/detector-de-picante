import pandas as pd
import numpy as np
from pathlib import Path
import json
import re

# Configuración
DATA_DIR = Path("data")
DATA_DIR.mkdir(exist_ok=True)

# Dataset inicial
initial_data = [
    ("El chile habanero es extremadamente picante", "pica"),
    ("Los jalapeños tienen un nivel moderado de picante", "pica"),
    ("Esta salsa de tomate no pica nada", "no_pica"),
    ("El pan dulce es suave y delicioso", "no_pica"),
    ("¿Los pimientos morrones pican?", "no_pica"),
    ("El ají rocoto arde bastante", "pica"),
    ("La pimienta cayena es muy ardiente", "pica"),
    ("Las fresas son dulces", "no_pica"),
    ("Este queso es cremoso", "no_pica"),
    ("La salsa tabasco quema la lengua", "pica"),
    ("¿Picará el curry mañana?", "pica"),
    ("Ayer probé un chile que picaba mucho", "pica"),
    ("El chocolate no contiene capsaicina", "no_pica"),
    ("Los chiles serranos son picantes", "pica"),
    ("Esta ensalada está fresca", "no_pica"),
    ("El wasabi pica fuerte", "pica"),
    ("Las manzanas son crujientes", "no_pica"),
    ("¿El jengibre pica?", "no_pica"),
    ("Los chiles chipotles ahumados pican", "pica"),
    ("El helado de vainilla es suave", "no_pica"),
    ("La guindilla tiene un toque picante", "pica"),
    ("El yogurt natural es ácido", "no_pica"),
    ("Los pimientos de padrón a veces pican", "pica"),
    ("El arroz blanco no tiene sabor picante", "no_pica"),
    ("La comida tailandesa suele ser picante", "pica"),
    ("El plátano maduro es dulce", "no_pica"),
    ("Los tacos con salsa verde pican rico", "pica"),
    ("La pasta con mantequilla no pica", "no_pica"),
    ("El kimchi coreano puede picar", "pica"),
    ("Las papas hervidas son neutras", "no_pica"),
    ("El curry rojo tailandés es ardiente", "pica"),
    ("El agua de coco es refrescante", "no_pica"),
    ("Los chiles poblanos apenas pican", "no_pica"),
    ("La salsa habanera es la más picante", "pica"),
    ("El pan francés no contiene especias", "no_pica"),
    ("Los nachos con jalapeños pican", "pica"),
    ("La leche es suave", "no_pica"),
    ("El chile de árbol es muy picoso", "pica"),
    ("Las zanahorias son dulces", "no_pica"),
    ("La comida india tiene especias picantes", "pica"),
    ("El queso parmesano es salado", "no_pica"),
    ("Los chiles en vinagre conservan el picante", "pica"),
    ("El cereal de maíz no pica", "no_pica"),
    ("La mostaza dijon pica un poco", "pica"),
    ("El melón es jugoso", "no_pica"),
    ("Los chiles güeros pueden picar", "pica"),
    ("La avena es reconfortante", "no_pica"),
    ("El rábano tiene un toque picante", "pica"),
    ("Las uvas son dulces", "no_pica"),
    ("La comida mexicana frecuentemente pica", "pica"),
    ("El arroz con leche es dulce", "no_pica"),
    ("Los camarones a la diabla pican mucho", "pica"),
    ("La sandía es refrescante", "no_pica"),
    ("El chile manzano es picante", "pica"),
    ("El puré de papas es cremoso", "no_pica"),
    ("La pimienta negra pica levemente", "pica"),
    ("El pan de plátano es dulce", "no_pica"),
    ("Los tacos al pastor con salsa pican", "pica"),
    ("La sopa de verduras no pica", "no_pica"),
    ("El chile pasilla tiene picante moderado", "pica"),
    ("El flan napolitano es suave", "no_pica"),
    ("¿Picará esta salsa?", "pica"),
    ("Ayer comí algo que no picaba", "no_pica"),
    ("Mañana probaré algo picante", "pica"),
    ("Esto pica ahora mismo", "pica"),
    ("No sé si esto pica", "no_pica"),
    ("Definitivamente este chile pica", "pica"),
    ("Nunca he probado algo que pique tanto", "pica"),
    ("Este alimento no tiene picante", "no_pica"),
    ("La naranja es cítrica", "no_pica"),
    ("Los chiles toreados pican bastante", "pica"),
    ("El café es amargo", "no_pica"),
    ("El chile ancho seco pica poco", "pica"),
    ("Las galletas son crujientes", "no_pica"),
    ("La salsa búfalo tiene picante", "pica"),
    ("El tofu es neutro", "no_pica"),
    ("Los chiles cascabel son picantes", "pica"),
    ("La miel es dulce", "no_pica"),
    ("El aguacate es cremoso", "no_pica"),
    ("Los chiles verdes asados pican", "pica"),
    ("El té verde es suave", "no_pica"),
    ("La comida szechuan es muy picante", "pica"),
    ("Las almendras son nutritivas", "no_pica"),
    ("El pico de gallo con chile pica", "pica"),
    ("La mantequilla es grasosa", "no_pica"),
    ("Los enchiladas rojas pueden picar", "pica"),
    ("El pescado al vapor no pica", "no_pica"),
    ("Los tacos de carnitas con salsa pican", "pica"),
    ("El arroz integral es saludable", "no_pica"),
    ("El chile mulato tiene sabor picante", "pica"),
    ("Las papas fritas son saladas", "no_pica"),
    ("El pozole rojo con chile pica", "pica"),
    ("La sopa de pollo no tiene picante", "no_pica"),
    ("Los tamales con salsa verde pican", "pica"),
    ("El atole es dulce y espeso", "no_pica"),
    ("La carne asada con chimichurri pica", "pica"),
    ("El bistec simple no pica", "no_pica"),
    ("Los elotes con chile pican", "pica"),
    ("Las palomitas con mantequilla no pican", "no_pica"),
    ("El mole con chile seco pica moderado", "pica"),
    ("La gelatina es suave", "no_pica"),
]

# Características simples basadas en palabras clave
spicy_keywords = [
    'pica', 'picante', 'ardor', 'arde', 'quema', 'picazón', 'picor',
    'capsaicina', 'chile', 'jalapeño', 'habanero', 'serrano', 'cayena',
    'tabasco', 'wasabi', 'curry', 'pimienta', 'mostaza', 'rábano', 'jengibre'
]

question_indicators = ['¿', '?', 'qué', 'cómo', 'cuándo', 'cuánto', 'por qué', 'dime si', 'quiero saber', 'no sé si']

future_indicators = ['picará', 'va a', 'iré', 'comeré', 'probaré', 'mañana', 'puede que', 'tal vez']
past_indicators = ['picó', 'picaba', 'comí', 'probé', 'ayer', 'antes', 'año pasado']

action_indicators = [
    'me pica', 'te pica', 'le pica', 'nos pica', 'les pica',
    'siento', 'me arde', 'me está', 'estoy', 'cuando', 'al comer',
    'al probar', 'me picó', 'me picaron', 'me pican'
]

inert_objects = ['picahielo', 'alfiler', 'aguja', 'cuchillo', 'tenedor', 
                 'un chile', 'el chile está', 'hay', 'tengo', 'compré',
                 'veo', 'el chile', 'los chiles', 'una abeja', 'un mosquito',
                 'una avispa']

def extract_features(text):
    """Extrae características mejoradas para detectar si algo REALMENTE pica"""
    text_lower = text.lower()
    
    # 1. Contador de palabras clave de picante/sensación
    spicy_count = sum(1 for keyword in spicy_keywords if keyword in text_lower)
    
    # 2. ¿Es una pregunta? (no afirma)
    is_question = any(word in text_lower for word in question_indicators)
    
    # 3. ¿Es tiempo futuro? (no está picando ahora)
    is_future = any(word in text_lower for word in future_indicators)
    
    # 4. ¿Hay un agente/acción real? (alguien experimenta el picar)
    has_action = any(word in text_lower for word in action_indicators)
    
    # 5. ¿Es un objeto inerte sin agente?
    is_inert = any(word in text_lower for word in inert_objects)
    
    # 6. Longitud del texto
    word_count = len(text.split())
    
    # Vector de características
    features = [
        spicy_count,           # Palabras relacionadas con picar
        1 if is_question else 0,  # Es pregunta (NO pica)
        1 if is_future else 0,    # Es futuro (NO pica aún)
        1 if has_action else 0,   # Tiene agente/acción (SÍ pica)
        1 if is_inert else 0,     # Es objeto inerte (NO pica)
        word_count,            
    ]
    
    return np.array(features)

# Red neuronal
class SimpleNeuralNetwork:
    def __init__(self, input_size=6, hidden_size=10, output_size=2):
        # Inicialización de pesos
        self.W1 = np.random.randn(input_size, hidden_size) * 0.1
        self.b1 = np.zeros((1, hidden_size))
        self.W2 = np.random.randn(hidden_size, output_size) * 0.1
        self.b2 = np.zeros((1, output_size))
    
    def sigmoid(self, x):
        return 1 / (1 + np.exp(-np.clip(x, -500, 500)))
    
    def softmax(self, x):
        exp_x = np.exp(x - np.max(x, axis=1, keepdims=True))
        return exp_x / np.sum(exp_x, axis=1, keepdims=True)
    
    def forward(self, X):
        self.z1 = np.dot(X, self.W1) + self.b1
        self.a1 = self.sigmoid(self.z1)
        self.z2 = np.dot(self.a1, self.W2) + self.b2
        self.a2 = self.softmax(self.z2)
        return self.a2
    
    def backward(self, X, y, learning_rate=0.01):
        m = X.shape[0]
        
        dz2 = self.a2 - y
        dW2 = np.dot(self.a1.T, dz2) / m
        db2 = np.sum(dz2, axis=0, keepdims=True) / m
        
        da1 = np.dot(dz2, self.W2.T)
        dz1 = da1 * self.a1 * (1 - self.a1)
        dW1 = np.dot(X.T, dz1) / m
        db1 = np.sum(dz1, axis=0, keepdims=True) / m
        
        self.W1 -= learning_rate * dW1
        self.b1 -= learning_rate * db1
        self.W2 -= learning_rate * dW2
        self.b2 -= learning_rate * db2
    
    def train(self, X, y, epochs=1000, learning_rate=0.1):
        for epoch in range(epochs):
            output = self.forward(X)
            self.backward(X, y, learning_rate)
            
            if epoch % 100 == 0:
                loss = -np.mean(y * np.log(output + 1e-8))
                print(f"Epoch {epoch}, Loss: {loss:.4f}")
    
    def predict(self, X):
        output = self.forward(X)
        return np.argmax(output, axis=1)
    
    def predict_proba(self, X):
        return self.forward(X)

csv_path = Path("public/dataset.csv")
if not csv_path.exists():
    print("Error: No se encontró el archivo dataset.csv")
    exit(1)

df = pd.read_csv(csv_path)


# Preparar datos
X = np.array([extract_features(text) for text in df['text']])
y = np.array([[1, 0] if label == 'pica' else [0, 1] for label in df['label']])


model = SimpleNeuralNetwork(input_size=6, hidden_size=10, output_size=2)
model.train(X, y, epochs=800, learning_rate=0.15)

# Evaluar modelo
predictions = model.predict(X)
y_true = np.argmax(y, axis=1)
accuracy = np.mean(predictions == y_true)
print(f"\n Exactitud en entrenamiento: {accuracy*100:.2f}%")

# Calcular métricas
tp = np.sum((predictions == 0) & (y_true == 0))
fp = np.sum((predictions == 0) & (y_true == 1))
fn = np.sum((predictions == 1) & (y_true == 0))
tn = np.sum((predictions == 1) & (y_true == 1))

precision = tp / (tp + fp) if (tp + fp) > 0 else 0
recall = tp / (tp + fn) if (tp + fn) > 0 else 0
f1_score = 2 * (precision * recall) / (precision + recall) if (precision + recall) > 0 else 0

print(f"\nMétricas del modelo:")
print(f"- Precisión: {precision*100:.2f}%")
print(f"- Recall: {recall*100:.2f}%")
print(f"- F1-Score: {f1_score*100:.2f}%")

# Guardar modelo (pesos)
model_data = {
    'W1': model.W1.tolist(),
    'b1': model.b1.tolist(),
    'W2': model.W2.tolist(),
    'b2': model.b2.tolist(),
    'metrics': {
        'accuracy': float(accuracy),
        'precision': float(precision),
        'recall': float(recall),
        'f1_score': float(f1_score)
    }
}

model_path = DATA_DIR / "model_weights.json"
with open(model_path, 'w') as f:
    json.dump(model_data, f, indent=2)

print(f"\n Modelo guardado en: {model_path}")

print("\n" + "="*70)
print("EJEMPLOS DE PRUEBA")
print("="*70)

test_examples = [
    ("El chile habanero me pica mucho", "DEBE PICAR - tiene agente 'me'"),
    ("La ortiga pica al contacto", "DEBE PICAR - tiene agente 'al contacto'"),
    ("¿Pica el chile?", "NO DEBE PICAR - es pregunta"),
    ("Un picahielo", "NO DEBE PICAR - objeto sin agente"),
    ("Me pica con el picahielo", "DEBE PICAR - tiene agente y acción"),
    ("Tengo un chile", "NO DEBE PICAR - solo posesión"),
    ("Como el chile y me pica", "DEBE PICAR - acción de comer"),
    ("Mañana comeré algo picante", "NO DEBE PICAR - futuro"),
    ("Ayer me picó un mosquito", "DEBE PICAR - acción pasada real"),
    ("El mosquito me pica", "DEBE PICAR - agente y acción"),
    ("Un mosquito", "NO DEBE PICAR - solo objeto"),
    ("la comida", "NO DEBE PICAR - solo comida"),
    ("el picahielo", "NO DEBE PICAR - solo objeto"),
    ("¿Pica este picahielo? ", "NO DEBE PICAR - solo pregunta por el objeto"),
    
]

for text, expected in test_examples:
    features = extract_features(text).reshape(1, -1)
    proba = model.predict_proba(features)[0]
    pred_class = "PICA" if np.argmax(proba) == 0 else "NO PICA"
    confidence = proba[np.argmax(proba)]
    print(f"\n {text}")
    print(f"   Predicción: {pred_class} ({confidence*100:.1f}%)")
    print(f"   Esperado: {expected}")
