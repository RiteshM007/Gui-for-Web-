
import os
import time
import logging
import requests
import uuid
import csv
from urllib.parse import urlparse, parse_qs
import threading
import numpy as np
import joblib
from datetime import datetime

# Set up logging
log_file = "fuzz.log"
report_file = "report.log"
dataset_file = "fuzzer_dataset.csv"

class WebFuzzer:
    def __init__(self, target_url, wordlist_file):
        self.target_url = target_url
        self.wordlist_file = wordlist_file
        self.wordlist = []
        self.previous_body = ""
        self.params = {}
        self.selected_params = []
        self.running = False
        self.results = []
        self.thread = None
        self.setup_logging()
        
        # Try to load ML models if they exist
        try:
            self.anomaly_detector = joblib.load("anomaly_model.pkl")
            self.classifier = joblib.load("classifier_model.pkl")
            self.ml_models_loaded = True
            logging.info("ML models loaded successfully")
        except:
            self.ml_models_loaded = False
            logging.info("ML models not found or could not be loaded")
            
        try:
            self.load_wordlist()
            self.initialize_dataset()
        except Exception as e:
            logging.error(f"Initialization error: {e}")

    def setup_logging(self):
        """Set up logging configuration"""
        # Clear previous logs
        if os.path.exists(log_file):
            open(log_file, 'w').close()
        if os.path.exists(report_file):
            open(report_file, 'w').close()
            
        # Configure logging
        logging.basicConfig(
            filename=log_file, 
            level=logging.INFO, 
            format='%(asctime)s - %(levelname)s - %(message)s',
            datefmt='%Y-%m-%d %H:%M:%S'
        )

    def log_activity(self, message):
        """Log activities to the log file and print to console"""
        logging.info(message)
        print(message)

    def log_report(self, report_data):
        """Log detailed reports to a separate file"""
        with open(report_file, 'a') as report:
            report.write(report_data + "\n")

    def load_wordlist(self):
        """Load the wordlist from a file"""
        if not os.path.exists(self.wordlist_file):
            self.log_activity(f"Wordlist file not found: {self.wordlist_file}")
            # Use a default set of test payloads
            self.wordlist = ["<script>alert(1)</script>", "1' OR '1'='1", "admin' --", "' OR 1=1;--"]
            self.log_activity(f"Using {len(self.wordlist)} default test payloads")
            return
            
        with open(self.wordlist_file, 'r') as file:
            self.wordlist = [line.strip() for line in file if line.strip()]

        if not self.wordlist:
            self.log_activity("Wordlist is empty or could not be loaded. Using defaults.")
            self.wordlist = ["<script>alert(1)</script>", "1' OR '1'='1", "admin' --", "' OR 1=1;--"]
        
        self.log_activity(f"Loaded {len(self.wordlist)} payloads from wordlist.")

    def initialize_dataset(self):
        """Ensure dataset file has headers"""
        if not os.path.exists(dataset_file):
            with open(dataset_file, mode='w', newline='', encoding='utf-8') as file:
                writer = csv.writer(file)
                writer.writerow([
                    'label', 'payload', 'response_code', 'alert_detected', 
                    'error_detected', 'body_word_count_changed', 'timestamp'
                ])
            self.log_activity(f"Dataset file initialized: {dataset_file}")

    def save_to_dataset(self, payload, response_code, alert_detected, error_detected, body_word_count_changed):
        """Save labeled data to CSV file"""
        # Assign label based on conditions
        if response_code >= 500 or error_detected:
            label = "malicious"
        elif alert_detected:
            label = "suspicious"
        else:
            label = "safe"

        with open(dataset_file, mode='a', newline='', encoding='utf-8') as file:
            writer = csv.writer(file)
            writer.writerow([
                label, payload, response_code, alert_detected,
                error_detected, body_word_count_changed, time.time()
            ])

    def analyze_with_ml(self, response_code, body_changed):
        """Analyze response using ML models if available"""
        if not self.ml_models_loaded:
            return None, None
            
        try:
            features = np.array([[response_code, int(body_changed)]])
            
            # Predict anomaly
            anomaly = self.anomaly_detector.predict(features)[0]
            anomaly_result = anomaly == -1  # True if anomalous
            
            # Predict classification
            classification = self.classifier.predict(features)[0]
            classification_result = classification == 1  # True if effective payload
            
            return anomaly_result, classification_result
        except Exception as e:
            self.log_activity(f"Error in ML analysis: {e}")
            return None, None

    def fuzz_endpoint(self, payload, endpoint=None):
        """Fuzz a specific endpoint with a payload"""
        target = endpoint if endpoint else self.target_url
        unique_id = str(uuid.uuid4())[:8]
        
        try:
            # Try both GET and POST requests
            methods = ['GET', 'POST']
            for method in methods:
                if not self.running:
                    return  # Stop if fuzzing was halted
                    
                self.log_activity(f"[{unique_id}] Testing {method} {target} with payload: {payload}")
                
                if method == 'GET':
                    # Add payload to URL parameters
                    if '?' in target:
                        url = f"{target}&fuzz={payload}"
                    else:
                        url = f"{target}?fuzz={payload}"
                    response = requests.get(url, timeout=10)
                else:
                    # Send payload in POST data
                    data = {'fuzz': payload}
                    response = requests.post(target, data=data, timeout=10)
                
                # Record response information
                response_code = response.status_code
                response_body = response.text
                
                # Analyze response
                alert_detected = "alert" in response_body.lower()
                error_detected = "error" in response_body.lower() or response_code >= 500
                
                # Check for changes in response body
                body_changed = False
                if self.previous_body and self.previous_body != response_body:
                    prev_words = len(self.previous_body.split())
                    curr_words = len(response_body.split())
                    body_changed = prev_words != curr_words
                
                self.previous_body = response_body
                
                # Use ML models for additional analysis
                anomaly, effective = self.analyze_with_ml(response_code, body_changed)
                
                # Determine severity based on findings
                severity = 'low'
                if response_code >= 500 or error_detected:
                    severity = 'critical'
                elif alert_detected:
                    severity = 'high'
                elif anomaly or effective:
                    severity = 'medium'
                
                # Generate finding description
                finding = ""
                if error_detected:
                    finding = "Server error detected"
                elif alert_detected:
                    finding = "Possible XSS vulnerability"
                elif anomaly:
                    finding = "Anomalous response detected"
                elif effective:
                    finding = "Potentially effective payload"
                else:
                    finding = "No issues detected"
                
                # Create result entry
                result = {
                    "id": len(self.results) + 1,
                    "url": target,
                    "method": method,
                    "payload": payload,
                    "status": response_code,
                    "responseTime": response.elapsed.total_seconds() * 1000,  # Convert to ms
                    "severity": severity,
                    "finding": finding,
                    "alertDetected": alert_detected,
                    "errorDetected": error_detected,
                    "bodyWordCountChanged": body_changed,
                    "timestamp": datetime.now().isoformat()
                }
                
                # Add to results and save to dataset
                self.results.append(result)
                self.save_to_dataset(payload, response_code, alert_detected, error_detected, body_changed)
                
                # Log detailed report
                report_data = (
                    f"ID: {unique_id}\n"
                    f"Target: {target}\n"
                    f"Method: {method}\n"
                    f"Payload: {payload}\n"
                    f"Response Code: {response_code}\n"
                    f"Response Time: {result['responseTime']}ms\n"
                    f"Alert Detected: {alert_detected}\n"
                    f"Error Detected: {error_detected}\n"
                    f"Body Changed: {body_changed}\n"
                    f"Severity: {severity}\n"
                    f"Finding: {finding}\n"
                    f"{'-' * 50}"
                )
                self.log_report(report_data)
                
        except Exception as e:
            self.log_activity(f"Error testing {target} with {payload}: {e}")
            # Add error result
            result = {
                "id": len(self.results) + 1,
                "url": target,
                "method": "ERROR",
                "payload": payload,
                "status": 0,
                "responseTime": 0,
                "severity": "low",
                "finding": f"Error during test: {str(e)}",
                "timestamp": datetime.now().isoformat()
            }
            self.results.append(result)

    def fuzzing_thread(self):
        """Main fuzzing process that runs in a separate thread"""
        try:
            self.log_activity(f"Starting fuzzing on {self.target_url} with {len(self.wordlist)} payloads")
            
            # Clear previous results
            self.results = []
            
            # Process each payload in the wordlist
            for i, payload in enumerate(self.wordlist):
                if not self.running:
                    self.log_activity("Fuzzing stopped by user")
                    break
                    
                self.fuzz_endpoint(payload)
                
                # Log progress
                progress = ((i + 1) / len(self.wordlist)) * 100
                if (i + 1) % 10 == 0 or (i + 1) == len(self.wordlist):
                    self.log_activity(f"Progress: {progress:.1f}% ({i + 1}/{len(self.wordlist)})")
                    
            self.log_activity("Fuzzing process completed")
        except Exception as e:
            self.log_activity(f"Error in fuzzing thread: {e}")
        finally:
            self.running = False

    def start_fuzzing(self):
        """Start the fuzzing process in a separate thread"""
        if self.running:
            return {"status": "already_running", "message": "Fuzzing is already in progress"}
            
        self.running = True
        self.thread = threading.Thread(target=self.fuzzing_thread)
        self.thread.daemon = True
        self.thread.start()
        
        return {
            "status": "started", 
            "message": f"Fuzzing started on {self.target_url} with {len(self.wordlist)} payloads"
        }

    def stop_fuzzing(self):
        """Stop the fuzzing process"""
        if not self.running:
            return {"status": "not_running", "message": "No fuzzing in progress"}
            
        self.running = False
        if self.thread and self.thread.is_alive():
            self.thread.join(timeout=2.0)
            
        return {"status": "stopped", "message": "Fuzzing process stopped"}
        
    def get_results(self):
        """Return current fuzzing results"""
        return self.results
