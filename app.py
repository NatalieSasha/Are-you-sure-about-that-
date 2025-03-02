from flask import Flask, render_template, request, jsonify
import random
import re

app = Flask(__name__)

# Function to check password strength
def check_password_strength(password):
    score = 0
    feedback = []

    if len(password) >= 8:
        score += 1
    else:
        feedback.append("Use at least 8 characters.")

    if re.search(r"[A-Z]", password):
        score += 1
    else:
        feedback.append("Add an uppercase letter.")

    if re.search(r"[0-9]", password):
        score += 1
    else:
        feedback.append("Include at least one number.")

    if re.search(r"[@$!%*?&]", password):
        score += 1
    else:
        feedback.append("Use a special character (@$!%*?&).")

    strength_levels = ["Weak ❌", "Weak ❌", "Medium ⚠️", "Strong ✅", "Very Strong 💪"]
    return {"strength": strength_levels[score], "feedback": feedback, "score": score}

# Function to generate a password based on user input
def generate_personalized_password(data):
    character = data.get("character", "").title().replace(" ", "")
    city = data.get("city", "").title().replace(" ", "")
    
    numbers = str(random.randint(10, 99))  # Two random digits
    symbols = random.choice("@$!%*?&")  # One random special character

    # ✅ Randomly capitalize letters in the words
    character = ''.join(random.choice([c.upper(), c.lower()]) for c in character)
    city = ''.join(random.choice([c.upper(), c.lower()]) for c in city)

    # ✅ Randomly shuffle the order of components
    components = [character, city, numbers, symbols]
    random.shuffle(components)

    # ✅ Combine shuffled parts & limit to 12 characters
    password = ''.join(components)[:12]

    while len(password) < 8:
        extra_num = str(random.randint(0, 9))  # Add more numbers if too short
        extra_symbol = random.choice("@$!%*?&")  # Add extra symbol
        password += random.choice([extra_num, extra_symbol])  # Randomly add one
    
    # ✅ Limit final password to max 12 characters
    return password

    

    

# Home Route
@app.route("/")
def home():
    return render_template("index.html")

# API Route for checking password strength
@app.route("/check-password", methods=["POST"])
def check_password():
    data = request.get_json()
    password = data.get("password", "")
    result = check_password_strength(password)
    return jsonify(result)

# API Route for generating a personalized password
@app.route("/generate-password", methods=["POST"])
def generate_password():
    data = request.get_json()
    password = generate_personalized_password(data)
    return jsonify({"password": password})

if __name__ == "__main__":
    app.run(debug=True)
