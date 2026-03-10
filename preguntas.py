import random

# Question Bank based on the provided Whizlabs sources
questions_db = [
    {"q": "What is the primary goal of Artificial Intelligence (AI)?", "o": ["A) To replace human workers", "B) To develop systems that exhibit intelligent behavior like reasoning and learning", "C) To only process numerical values", "D) To provide unlimited cloud storage"], "a": "B"},
    {"q": "Which layer of the AI architecture focuses on preparing and organizing data for ML and NLP?", "o": ["A) Application layer", "B) Model layer", "C) Data layer", "D) Infrastructure layer"], "a": "C"},
    {"q": "What AI technology transforms documents like PDFs into structured information using NLP and computer vision?", "o": ["A) Amazon Polly", "B) Intelligent Document Processing (IDP)", "C) AWS DeepRacer", "D) Amazon RDS"], "a": "B"},
    {"q": "What is an inherent limitation of AI mentioned in the sources regarding data?", "o": ["A) AI cannot process text", "B) Training on biased data can lead to unfair results", "C) AI is always free of cost", "D) AI does not require compute resources"], "a": "B"},
    {"q": "Which subset of AI uses artificial neural networks to learn from complex patterns?", "o": ["A) Rule-based systems", "B) Deep Learning", "C) Basic Machine Learning", "D) Linear Regression"], "a": "B"},
    {"q": "What architecture is used by Large Language Models (LLMs) to understand relationships between words?", "o": ["A) Decision Trees", "B) Transformer architecture (Encoder/Decoder)", "C) Simple Neural Networks", "D) K-Means Clustering"], "a": "B"},
    {"q": "Which component of Responsible AI focuses on understanding and assessing system outputs?", "o": ["A) Privacy", "B) Explainability", "C) Safety", "D) Governance"], "a": "B"},
    {"q": "What technology enables computers to interpret visual information from images and videos?", "o": ["A) Natural Language Processing", "B) Computer Vision", "C) Speech Recognition", "D) Reinforcement Learning"], "a": "B"},
    {"q": "What distinguishes Generative AI from traditional AI?", "o": ["A) It only analyzes existing data", "B) It produces original content like images and text based on instructions", "C) It does not use deep learning", "D) It requires no training data"], "a": "B"},
    {"q": "What is a key feature of Foundation Models (FMs)?", "o": ["A) They are designed for a single specific task", "B) They are highly adaptable for a broad range of general tasks", "C) They are small-scale networks", "D) They require no resource infrastructure"], "a": "B"},
    {"q": "Which model, released in 2018, was a bidirectional model that laid the groundwork for GPT?", "o": ["A) Llama 2", "B) BERT", "C) Claude", "D) Titan"], "a": "B"},
    {"q": "Which AWS service provides access to foundation models from top AI companies via a unified API?", "o": ["A) Amazon Bedrock", "B) Amazon SageMaker Studio", "C) AWS Lambda", "D) Amazon S3"], "a": "A"},
    {"q": "Which Amazon SageMaker feature is a 'no-code' visual interface for building ML models?", "o": ["A) SageMaker Studio", "B) SageMaker Canvas", "C) SageMaker Pipelines", "D) SageMaker Feature Store"], "a": "B"},
    {"q": "Which AWS service is used for analyzing text to perform sentiment analysis and entity recognition?", "o": ["A) Amazon Rekognition", "B) Amazon Comprehend", "C) Amazon Lex", "D) Amazon Polly"], "a": "B"},
    {"q": "What service converts written text into lifelike speech in multiple languages?", "o": ["A) Amazon Transcribe", "B) Amazon Polly", "C) Amazon Translate", "D) Amazon Textract"], "a": "B"},
    {"q": "Which service converts speech into text for transcriptions and subtitles?", "o": ["A) Amazon Polly", "B) Amazon Transcribe", "C) Amazon Translate", "D) Amazon Rekognition"], "a": "B"},
    {"q": "What tool extracts text, tables, and data from scanned documents?", "o": ["A) Amazon Comprehend", "B) Amazon Textract", "C) Amazon Personalize", "D) Amazon Forecast"], "a": "B"},
    {"q": "Which service uses machine learning to provide relevant search results across enterprise data sources?", "o": ["A) Amazon Athena", "B) Amazon Kendra", "C) AWS Glue", "D) Amazon S3"], "a": "B"},
    {"q": "In an ML pipeline, which service is primarily used to discover, prepare, and combine data across sources?", "o": ["A) Amazon RDS", "B) AWS Glue", "C) Amazon SageMaker Studio", "D) Amazon CloudWatch"], "a": "B"},
    {"q": "What feature of SageMaker helps identify issues like overfitting during training by monitoring training metrics?", "o": ["A) SageMaker Clarify", "B) SageMaker Debugger", "C) SageMaker Model Monitor", "D) SageMaker Canvas"], "a": "B"},
    {"q": "Which service continuously monitors deployed models for data drift post-deployment?", "o": ["A) Amazon CloudWatch", "B) Amazon SageMaker Model Monitor", "C) AWS PrivateLink", "D) Amazon Macie"], "a": "B"},
    {"q": "What is the core practice of combining Machine Learning and DevOps?", "o": ["A) DataOps", "B) MLOps", "C) FinOps", "D) AI-Ops"], "a": "B"},
    {"q": "Which prompting technique involves dividing complex questions into smaller, logical steps?", "o": ["A) Tree-of-thought", "B) Chain-of-thought", "C) Maieutic", "D) Self-refine"], "a": "B"},
    {"q": "What technique improves LLM accuracy by referencing an authoritative knowledge base outside its original training data?", "o": ["A) Fine-tuning", "B) Retrieval Augmented Generation (RAG)", "C) Prompt Engineering", "D) RLHF"], "a": "B"},
    {"q": "In the GenAI Security Scoping Matrix, which Scope represents using a public generative AI service like ChatGPT?", "o": ["A) Scope 5", "B) Scope 1", "C) Scope 3", "D) Scope 2"], "a": "B"},
    {"q": "Which Scope represents building and training a model from scratch on your own data?", "o": ["A) Scope 1", "B) Scope 5", "C) Scope 2", "D) Scope 4"], "a": "B"},
    {"q": "What is the purpose of Amazon Bedrock Agents?", "o": ["A) To monitor model bias", "B) To execute complex tasks across company systems and information", "C) To only generate images", "D) To store datasets"], "a": "B"},
    {"q": "Which Bedrock feature provides customizable protections to block harmful content in AI applications?", "o": ["A) Knowledge Bases", "B) Guardrails", "C) Playgrounds", "D) Titan"], "a": "B"},
    {"q": "What generative AI-powered assistant helps developers with coding and AWS resource optimization?", "o": ["A) Amazon Q Developer", "B) Amazon Lex", "C) Amazon Polly", "D) Amazon Transcribe"], "a": "A"},
    {"q": "What metric is used in NLP to evaluate the quality of machine-generated text compared to human-written text?", "o": ["A) RMSE", "B) ROUGE", "C) F1 Score", "D) Accuracy"], "a": "B"},
    {"q": "Which SageMaker tool helps detect bias in datasets before training?", "o": ["A) Model Monitor", "B) Clarify", "C) Canvas", "D) Feature Store"], "a": "B"},
    {"q": "What is an Amazon SageMaker Model Card?", "o": ["A) A payment method", "B) A standardized template to document model information", "C) A hardware component", "D) A data storage format"], "a": "B"},
    {"q": "Which managed AI service identifies and redacts Personally Identifiable Information (PII) in documents?", "o": ["A) Amazon Rekognition", "B) Amazon Comprehend", "C) Amazon Translate", "D) Amazon Lex"], "a": "B"},
    {"q": "What service provides human review of low-confidence ML predictions?", "o": ["A) Amazon Mechanical Turk", "B) Amazon Augmented AI (A2I)", "C) Amazon Bedrock", "D) SageMaker Studio Lab"], "a": "B"},
    {"q": "What is the scale of the AWS DeepRacer vehicle?", "o": ["A) 1/10th", "B) 1/18th", "C) 1/24th", "D) 1/5th"], "a": "B"},
    {"q": "Which DeepRacer device version includes an optional sensor kit with LIDAR?", "o": ["A) Original DeepRacer", "B) AWS DeepRacer Evo", "C) Virtual DeepRacer", "D) DeepRacer S3"], "a": "B"},
    {"q": "Which security service uses ML to identify and protect sensitive data in Amazon S3?", "o": ["A) AWS Shield", "B) Amazon Macie", "C) AWS PrivateLink", "D) Amazon WAF"], "a": "B"},
    {"q": "How does AWS PrivateLink improve security for AI solutions?", "o": ["A) It encrypts all S3 buckets", "B) It connects your VPC to SageMaker without using the public internet", "C) It automatically labels data", "D) It speeds up GPU training"], "a": "B"},
    {"q": "Which prompting technique has the model evaluate its own solution and improve it iteratively?", "o": ["A) Least-to-most", "B) Self-refine", "C) Generated knowledge", "D) Directional-stimulus"], "a": "B"},
    {"q": "What is the 'latent space' in a Variational Auto-encoder (VAE)?", "o": ["A) A large data bucket", "B) A compressed mathematical representation of data essence", "C) A storage server", "D) A user interface"], "a": "B"},
    {"q": "What component of a GAN attempts to differentiate between fake and real data?", "o": ["A) Generator", "B) Discriminator", "C) Encoder", "D) Decoder"], "a": "B"},
    {"q": "Which Bedrock state indicates a model version is outdated and inoperable?", "o": ["A) Active", "B) EOL", "C) Legacy", "D) Beta"], "a": "B"},
    {"q": "What service allows users to explore and experiment with FMs for creativity and entertainment?", "o": ["A) SageMaker JumpStart", "B) PartyRock (Amazon Bedrock Playground)", "C) Amazon Q Business", "D) Amazon RDS"], "a": "B"},
    {"q": "Which technique involves providing a set of examples (data) and a task for the machine to learn?", "o": ["A) Traditional programming", "B) Machine Learning", "C) Expert systems", "D) Database querying"], "a": "B"},
    {"q": "What algorithm is appropriate for Object Detection in SageMaker?", "o": ["A) XGBoost", "B) SSD (Single Shot Multibox Detector)", "C) K-Means", "D) LDA"], "a": "B"},
    {"q": "Which service is optimized for customer service calls and live broadcast subtitling?", "o": ["A) Amazon Polly", "B) Amazon Transcribe", "C) Amazon Lex", "D) Amazon Comprehend"], "a": "B"},
    {"q": "What does RAG help to avoid for organizations using LLMs?", "o": ["A) Using APIs", "B) Model retraining", "C) Cloud storage", "D) Human oversight"], "a": "B"},
    {"q": "Which managed AI service is HIPAA Eligible, making it suitable for healthcare applications?", "o": ["A) Amazon Rekognition", "B) Amazon Translate", "C) Amazon Lex", "D) Amazon Forecast"], "a": "A"},
    {"q": "What is the primary benefit of Amazon Bedrock's single API?", "o": ["A) It makes models free", "B) It allows users to easily switch between different foundation models", "C) It replaces all human developers", "D) It only works with Amazon Titan"], "a": "B"},
    {"q": "What is a major challenge of Foundation Models mentioned in the sources?", "o": ["A) Lack of data", "B) High resource and infrastructure demands", "C) They are too simple", "D) No security options"], "a": "B"},
    {"q": "Which SageMaker tool provides a free environment based on JupyterLab?", "o": ["A) SageMaker Canvas", "B) SageMaker Studio Lab", "C) SageMaker HyperPod", "D) SageMaker Feature Store"], "a": "B"},
    {"q": "What service connects businesses with a global workforce for human-in-the-loop tasks?", "o": ["A) Amazon Augmented AI", "B) Amazon Mechanical Turk (MTurk)", "C) Amazon Lex", "D) Amazon Q Business"], "a": "B"},
    {"q": "Which model type is used to generate realistic images by introducing and then removing noise?", "o": ["A) GANs", "B) Diffusion models", "C) VAEs", "D) RNNs"], "a": "B"},
    {"q": "What is 'Self-attention' in a transformer model?", "o": ["A) The model ignoring user input", "B) A mechanism to prioritize significant words during processing", "C) A human review process", "D) A type of GPU memory"], "a": "B"},
    {"q": "Which service automates the retraining process when model performance drops?", "o": ["A) SageMaker Pipelines", "B) Amazon S3", "C) AWS IAM", "D) Amazon Macie"], "a": "A"},
    {"q": "What does SageMaker Clarify help to measure post-training?", "o": ["A) Training speed", "B) Bias in model outputs", "C) GPU temperature", "D) S3 storage size"], "a": "B"},
    {"q": "Which AWS service helps secure Generative AI by screening for 'prompt injection' attacks?", "o": ["A) Amazon Macie", "B) Bedrock Guardrails", "C) Amazon RDS", "D) AWS Glue"], "a": "B"},
    {"q": "What is the purpose of the Amazon SageMaker Model Registry?", "o": ["A) To list all AWS employees", "B) To manage different versions of models and metadata", "C) To store raw image files", "D) To host public datasets"], "a": "B"},
    {"q": "Which prompting technique involves addressing subproblems sequentially?", "o": ["A) Maieutic", "B) Least-to-most", "C) Tree-of-thought", "D) Chain-of-thought"], "a": "B"},
    {"q": "What type of machine learning uses feedback in the form of rewards or penalties?", "o": ["A) Supervised", "B) Reinforcement", "C) Unsupervised", "D) Rule-based"], "a": "B"},
    {"q": "What service identifies printed and handwritten text in videos across frames?", "o": ["A) Amazon Textract", "B) Amazon Rekognition Video Analysis", "C) Amazon Transcribe", "D) Amazon Comprehend"], "a": "B"},
    {"q": "What is 'concept drift' in machine learning?", "o": ["A) A model getting faster", "B) Changes in input data distribution affecting accuracy over time", "C) A type of GPU failure", "D) Deleting the model by mistake"], "a": "B"},
    {"q": "Which Scope represents refining a third-party FM with your business-specific data?", "o": ["A) Scope 1", "B) Scope 4", "C) Scope 5", "D) Scope 2"], "a": "B"},
    {"q": "What service provides a serverless workflow orchestration for ML and LLMs?", "o": ["A) Amazon EC2", "B) SageMaker Pipelines", "C) AWS Lambda", "D) Amazon DynamoDB"], "a": "B"},
    {"q": "Which tool provides automated and human-based methods to assess FM performance during customization?", "o": ["A) Amazon Macie", "B) SageMaker Clarify", "C) Amazon Polly", "D) Amazon Lex"], "a": "B"},
    {"q": "What is 'Prompt Engineering'?", "o": ["A) Developing new GPUs", "B) Designing text prompts to obtain desired responses from an LLM", "C) Writing database SQL code", "D) Managing cloud data centers"], "a": "B"},
    {"q": "What does a Vector Database store in the context of RAG?", "o": ["A) Excel sheets", "B) Numerical representations (embeddings) of textual data", "C) Video files", "D) User passwords"], "a": "B"},
    {"q": "What service allows developers to build virtual agents with Alexa-like natural language understanding?", "o": ["A) Amazon Q", "B) Amazon Lex", "C) Amazon Polly", "D) Amazon Transcribe"], "a": "B"},
    {"q": "Which SageMaker feature optimizes infrastructure for training massive foundation models?", "o": ["A) SageMaker Canvas", "B) SageMaker HyperPod", "C) SageMaker Notebooks", "D) SageMaker Studio Lab"], "a": "B"},
    {"q": "Which AI service provides real-time translation between English and other languages?", "o": ["A) Amazon Comprehend", "B) Amazon Translate", "C) Amazon Lex", "D) Amazon Rekognition"], "a": "B"},
    {"q": "In the RLHF process, what is the reward model's function?", "o": ["A) To pay users money", "B) To automatically predict how a human would score a response", "C) To generate random text", "D) To delete bad models"], "a": "B"},
    {"q": "What is 'Explainability' in the context of Responsible AI?", "o": ["A) Making models larger", "B) Understanding and assessing system outputs", "C) Encrypting data", "D) Training models faster"], "a": "B"},
    {"q": "Which service provides insights into potential data security threats using ML?", "o": ["A) AWS CloudTrail", "B) Amazon Macie", "C) Amazon CloudWatch", "D) Amazon RDS"], "a": "B"},
    {"q": "What does Amazon Bedrock Knowledge Bases provide for LLMs?", "o": ["A) More GPUs", "B) Integration with RAG for relevant company data", "C) A way to play games", "D) A list of public models"], "a": "B"},
    {"q": "What is the function of an 'Interface VPC Endpoint' via AWS PrivateLink?", "o": ["A) To browse the internet", "B) To connect a VPC directly to the SageMaker API without public internet", "C) To manage user emails", "D) To host a website"], "a": "B"},
    {"q": "Which managed service converts medical speech into text for clinical documentation?", "o": ["A) Amazon Transcribe Medical", "B) Amazon Polly", "C) Amazon Lex", "D) Amazon Comprehend"], "a": "A"},
    {"q": "What prompting method generates multiple potential next steps and evaluates them using a tree search?", "o": ["A) Chain-of-thought", "B) Tree-of-thought", "C) Maieutic", "D) Self-refine"], "a": "B"},
    {"q": "Which algorithm type is K-Means?", "o": ["A) Classification", "B) Clustering", "C) Regression", "D) Topic Modeling"], "a": "B"},
    {"q": "What does Amazon Q Business use to provide answers to employees?", "o": ["A) Social media", "B) Internal company data", "C) Random guesses", "D) Public news"], "a": "B"},
    {"q": "Which Bedrock state indicates the model is actively receiving bug fixes and updates?", "o": ["A) EOL", "B) Active", "C) Legacy", "D) Alpha"], "a": "B"},
    {"q": "What does SageMaker Data Wrangler primarily help with?", "o": ["A) Hiring data scientists", "B) Reducing data preparation time for tabular, image, and text data", "C) Buying new servers", "D) Hosting webinars"], "a": "B"},
    {"q": "Which AI layer is the user-facing interface?", "o": ["A) Data layer", "B) Model layer", "C) Application layer", "D) Physical layer"], "a": "C"},
    {"q": "What is 'Fairness' in Responsible AI?", "o": ["A) Using the most expensive models", "B) Considering the potential effects on diverse groups", "C) Never using AI", "D) Using AI for everything"], "a": "B"},
    {"q": "What does a GAN's Generator network produce?", "o": ["A) Real data", "B) Fake data by introducing random noise", "C) Database reports", "D) Encrypted keys"], "a": "B"},
    {"q": "Which Managed AI service handles automated sentiment analysis of product reviews?", "o": ["A) Amazon Polly", "B) Amazon Comprehend", "C) Amazon Rekognition", "D) Amazon Transcribe"], "a": "B"},
    {"q": "What does ROUGE measure?", "o": ["A) Model latency", "B) Text similarity between generated and reference text", "C) Electricity consumption", "D) Storage cost"], "a": "B"},
    {"q": "Which service automates tasks by analyzing requests and executing relevant APIs?", "o": ["A) Amazon Bedrock Agents", "B) Amazon S3", "C) AWS Glue", "D) Amazon RDS"], "a": "A"},
    {"q": "What is 'Directional-stimulus prompting'?", "o": ["A) Using loud noises", "B) Using a hint or cue, like keywords, to guide the model", "C) Using arrows", "D) Changing the model code"], "a": "B"},
    {"q": "What is the purpose of 'Model Re-training' in MLOps?", "o": ["A) To waste resources", "B) To maintain accuracy when performance drops or data drifts", "C) To make the model smaller", "D) To change the model's name"], "a": "B"},
    {"q": "Which service is a crowdsourcing marketplace to gather large datasets for ML training?", "o": ["A) Amazon Augmented AI", "B) Amazon Mechanical Turk", "C) Amazon Bedrock", "D) Amazon Lex"], "a": "B"},
    {"q": "What feature of Bedrock allows for multi-step task memory across interactions?", "o": ["A) Titan", "B) Bedrock Agents", "C) Guardrails", "D) Playgrounds"], "a": "B"},
    {"q": "What is the 'discriminator' in a GAN training process?", "o": ["A) A human worker", "B) A neural network that attempts to identify fake data", "C) A storage bucket", "D) A type of prompt"], "a": "B"},
    {"q": "Which tool offers end-to-end solutions for common ML tasks like fraud detection?", "o": ["A) Amazon RDS", "B) SageMaker JumpStart", "C) AWS Lambda", "D) Amazon VPC"], "a": "B"},
    {"q": "What does 'Veracity' mean in Responsible AI?", "o": ["A) High cost", "B) Achieving accurate system outputs under normal and adverse conditions", "C) Using only public data", "D) Speed"], "a": "B"},
    {"q": "Which managed AI service extracts insights from document structure?", "o": ["A) Amazon Polly", "B) Amazon Comprehend", "C) Amazon Lex", "D) Amazon Rekognition"], "a": "B"},
    {"q": "What prompting technique generates multiple facts to support the prompt before completion?", "o": ["A) Tree-of-thought", "B) Generated knowledge", "C) Chain-of-thought", "D) Self-refine"], "a": "B"},
    {"q": "What tool helps administrators quickly establish permissions for ML governance?", "o": ["A) SageMaker Role Manager", "B) Amazon S3", "C) Amazon Rekognition", "D) AWS Glue"], "a": "A"},
    {"q": "Which technique is cost-effective and avoids model retraining while providing current info to LLMs?", "o": ["A) Fine-tuning", "B) Retrieval Augmented Generation (RAG)", "C) Prompting", "D) RLHF"], "a": "B"},
    {"q": "What does Bedrock Guardrails block to protect applications?", "o": ["A) All users", "B) Harmful content and prompt attacks", "C) All model updates", "D) Internet access"], "a": "B"},
    {"q": "Which AWS model is designed for text summarization, extraction, and personalization?", "o": ["A) Stable Diffusion", "B) Amazon Titan", "C) Llama 2", "D) Claude"], "a": "B"}
]

def run_exam_simulator():
    print("="*60)
    print("   AWS CERTIFIED AI PRACTITIONER - EXAM SIMULATOR")
    print("="*60)
    print("Loading 30 random questions from the source material bank...")
    
    # Select 30 random questions
    exam_questions = random.sample(questions_db, 30)
    
    score = 0
    total = len(exam_questions)
    
    for i, q_data in enumerate(exam_questions, 1):
        print(f"\nQuestion {i} of {total}:")
        print(q_data["q"])
        for opt in q_data["o"]:
            print(f"  {opt}")
        
        user_input = input("\nYour answer (A, B, C, D): ").strip().upper()
        
        if user_input == q_data["a"]:
            print(">> Correct! ✅")
            score += 1
        else:
            print(f">> Incorrect. ❌ The correct answer was: {q_data['a']}")
            
    # Final Result
    percentage = (score / total) * 100
    print("\n" + "="*40)
    print(f"FINAL SCORE: {score}/{total}")
    print(f"PERCENTAGE: {percentage:.2f}%")
    
    if percentage >= 70:
        print("RESULT: PASS - You are ready for the exam! 🎓")
    else:
        print("RESULT: FAIL - Keep reviewing the sources! 📚")
    print("="*40)

if __name__ == "__main__":
    run_exam_simulator()