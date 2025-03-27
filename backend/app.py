
from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import time
import logging
import threading
import json
import numpy as np
import pandas as pd
import joblib
from werkzeug.utils import secure_filename

# Import your WebFuzzer class
# This assumes your WebFuzzer class is in a file called webfuzzer.py
try:
    from webfuzzer import WebFuzzer
except ImportError:
    print("Warning: WebFuzzer module not found. Make sure to copy your WebFuzzer class into webfuzzer.py")
    
    # Dummy class for demonstration
    class WebFuzzer:
        def __init__(self, target_url, wordlist_file):
            self.target_url = target_url
            self.wordlist_file = wordlist_file
            self.running = False
            
        def start_fuzzing(self):
            self.running = True
            print(f"Started fuzzing {self.target_url} with {self.wordlist_file}")
            time.sleep(5)  # Simulate work
            self.running = False
            return {"status": "completed"}
            
        def stop_fuzzing(self):
            self.running = False
            return {"status": "stopped"}

app = Flask(__name__)
CORS(app)  # Enable Cross-Origin Resource Sharing for React frontend

# Global variables to track fuzzing state
fuzzer_instance = None
fuzzing_thread = None
is_fuzzing = False

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Ensure uploads directory exists
UPLOAD_FOLDER = os.path.join(os.path.dirname(__file__), 'uploads')
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

# Path to the CSV dataset
DATASET_FILE = "fuzzer_dataset.csv"

# ML models paths (adjust if needed)
ANOMALY_MODEL_PATH = "anomaly_model.pkl"
CLASSIFIER_MODEL_PATH = "classifier_model.pkl"

@app.route('/api/start-fuzzing', methods=['POST'])
def start_fuzzing():
    global fuzzer_instance, fuzzing_thread, is_fuzzing
    
    if is_fuzzing:
        return jsonify({"success": False, "message": "A fuzzing scan is already running"}), 400
        
    try:
        data = request.json
        
        # Get parameters from request
        target_url = f"{data.get('protocol', 'https')}://{data.get('targetUrl', '')}"
        
        # For payload handling, either use uploaded file or create temp file with provided payloads
        if data.get('payloads'):
            # Create a temporary wordlist file from provided payloads
            wordlist_file = os.path.join(UPLOAD_FOLDER, f"wordlist_{int(time.time())}.txt")
            with open(wordlist_file, 'w') as f:
                f.write(data.get('payloads', ''))
        else:
            # Default wordlist if none provided
            wordlist_file = os.path.join(os.path.dirname(__file__), 'xss.txt')
            if not os.path.exists(wordlist_file):
                with open(wordlist_file, 'w') as f:
                    f.write("<script>alert(1)</script>\n'\"><script>alert(1)</script>")
                    
        # Create WebFuzzer instance
        fuzzer_instance = WebFuzzer(target_url, wordlist_file)
        
        # Start fuzzing in a separate thread to not block the API
        def run_fuzzing():
            global is_fuzzing
            is_fuzzing = True
            try:
                fuzzer_instance.start_fuzzing()
            finally:
                is_fuzzing = False
                
        fuzzing_thread = threading.Thread(target=run_fuzzing)
        fuzzing_thread.daemon = True
        fuzzing_thread.start()
        
        return jsonify({
            "success": True,
            "message": f"Fuzzing started against {target_url}"
        })
        
    except Exception as e:
        logger.error(f"Error starting fuzzing: {str(e)}")
        return jsonify({"success": False, "message": f"Error: {str(e)}"}), 500

@app.route('/api/stop-fuzzing', methods=['POST'])
def stop_fuzzing():
    global fuzzer_instance, is_fuzzing
    
    if not is_fuzzing or not fuzzer_instance:
        return jsonify({"success": False, "message": "No active fuzzing scan to stop"}), 400
        
    try:
        # Call stop method if available, otherwise set flag
        if hasattr(fuzzer_instance, 'stop_fuzzing'):
            result = fuzzer_instance.stop_fuzzing()
        else:
            is_fuzzing = False
            result = {"status": "stopped"}
            
        return jsonify({
            "success": True,
            "message": "Fuzzing scan stopped successfully",
            "result": result
        })
        
    except Exception as e:
        logger.error(f"Error stopping fuzzing: {str(e)}")
        return jsonify({"success": False, "message": f"Error: {str(e)}"}), 500

@app.route('/api/fuzzing-results', methods=['GET'])
def get_fuzzing_results():
    try:
        # Read results from the dataset file
        if os.path.exists(DATASET_FILE):
            df = pd.read_csv(DATASET_FILE)
            
            # Convert to the format expected by the frontend
            results = []
            for i, row in df.iterrows():
                # Map severity based on label
                severity = "low"
                if row.get('label') == "malicious":
                    severity = "high"
                elif row.get('label') == "suspicious":
                    severity = "medium"
                
                results.append({
                    "id": i + 1,
                    "url": row.get('payload', ''),  # Using payload as URL for demonstration
                    "method": "GET",  # Default method
                    "payload": row.get('payload', ''),
                    "status": int(row.get('response_code', 200)),
                    "responseTime": 100,  # Example response time
                    "severity": severity,
                    "finding": f"{row.get('label', 'unknown')} payload detected",
                    "alertDetected": bool(row.get('alert_detected', False)),
                    "errorDetected": bool(row.get('error_detected', False)),
                    "bodyWordCountChanged": bool(row.get('body_word_count_changed', False))
                })
                
            return jsonify({"success": True, "results": results})
        else:
            return jsonify({"success": True, "results": []})
            
    except Exception as e:
        logger.error(f"Error getting fuzzing results: {str(e)}")
        return jsonify({"success": False, "message": f"Error: {str(e)}"}), 500

@app.route('/api/anomaly-analysis', methods=['GET'])
def get_anomaly_analysis():
    try:
        # Check if we have ML models and dataset
        if not os.path.exists(DATASET_FILE):
            return jsonify({
                "success": False, 
                "message": "No dataset available for analysis"
            }), 400
            
        # Example of running ML analysis on the dataset
        df = pd.read_csv(DATASET_FILE)
        
        # If models exist, use them for prediction
        results = {
            "anomalyData": [],
            "vulnerabilityData": []
        }
        
        # Get counts for vulnerability types (example)
        vuln_counts = df['label'].value_counts().to_dict()
        for label, count in vuln_counts.items():
            results["vulnerabilityData"].append({
                "name": label,
                "value": int(count)
            })
            
        # Try to use ML models if available
        try:
            if os.path.exists(ANOMALY_MODEL_PATH) and os.path.exists(CLASSIFIER_MODEL_PATH):
                anomaly_detector = joblib.load(ANOMALY_MODEL_PATH)
                classifier = joblib.load(CLASSIFIER_MODEL_PATH)
                
                # Example of preparing features and making predictions
                features = df[['response_code', 'body_word_count_changed']].values
                
                # Convert boolean to int
                features[:, 1] = features[:, 1].astype(int)
                
                # Make predictions
                anomaly_scores = anomaly_detector.decision_function(features)
                predictions = classifier.predict(features)
                
                # Process results for frontend visualization
                unique_payloads = df['payload'].unique()
                for i, payload in enumerate(unique_payloads[:5]):  # Limit to 5 for demonstration
                    payload_data = df[df['payload'] == payload]
                    avg_score = 70 + (i * 5)  # Example score calculation
                    
                    results["anomalyData"].append({
                        "name": payload[:15] + "..." if len(payload) > 15 else payload,
                        "score": avg_score
                    })
        except Exception as e:
            logger.error(f"Error using ML models: {str(e)}")
            # Fall back to example data if ML fails
            results["anomalyData"] = [
                {"name": "SQL Injection", "score": 85},
                {"name": "XSS", "score": 72},
                {"name": "Path Traversal", "score": 45},
                {"name": "Command Injection", "score": 92},
                {"name": "Info Disclosure", "score": 63}
            ]
                
        return jsonify({"success": True, **results})
        
    except Exception as e:
        logger.error(f"Error in anomaly analysis: {str(e)}")
        return jsonify({"success": False, "message": f"Error: {str(e)}"}), 500

@app.route('/api/upload-wordlist', methods=['POST'])
def upload_wordlist():
    if 'file' not in request.files:
        return jsonify({"success": False, "message": "No file part"}), 400
        
    file = request.files['file']
    if file.filename == '':
        return jsonify({"success": False, "message": "No selected file"}), 400
        
    if file:
        filename = secure_filename(file.filename)
        file_path = os.path.join(UPLOAD_FOLDER, filename)
        file.save(file_path)
        return jsonify({
            "success": True,
            "message": "File uploaded successfully",
            "filePath": file_path
        })

if __name__ == '__main__':
    app.run(debug=True, port=5000)
