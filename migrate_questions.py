import json

# Load the current questions_db.json
with open('/home/jonzg/Proyectos/aws app/backend/questions_db.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

questions = []

for topic_key, topic_data in data['topics'].items():
    for q in topic_data['questions']:
        # Convert correct_answer from text to index
        correct_index = q['options'].index(q['correct_answer'])
        
        question = {
            "id": f"{topic_key}_{q['id']}",
            "exam_id": "ai_practitioner",
            "topic": topic_key,
            "difficulty": q['difficulty'],
            "question": q['question'],
            "options": q['options'],
            "correct_answer": correct_index,
            "explanation": q['explanation']
        }
        questions.append(question)

# Save to new file
with open('/home/jonzg/Proyectos/aws app/backend/question_banks/ai_practitioner.json', 'w', encoding='utf-8') as f:
    json.dump(questions, f, ensure_ascii=False, indent=2)

print(f"Created ai_practitioner.json with {len(questions)} questions")