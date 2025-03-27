
#!/bin/bash

echo "Setting up Fuzzer Backend..."

# Create a virtual environment
echo "Creating virtual environment..."
python -m venv venv

# Activate the virtual environment
echo "Activating virtual environment..."
source venv/bin/activate

# Install dependencies
echo "Installing dependencies..."
pip install -r requirements.txt

# Check if webfuzzer.py exists or is empty
if [ ! -s "webfuzzer.py" ]; then
    echo "Warning: webfuzzer.py is empty or doesn't exist."
    echo "Please copy your WebFuzzer class implementation into webfuzzer.py."
fi

# Check if ML models exist
if [ ! -f "anomaly_model.pkl" ] || [ ! -f "classifier_model.pkl" ]; then
    echo "Warning: ML model files (anomaly_model.pkl or classifier_model.pkl) not found."
    echo "Please copy your trained models to this directory."
fi

echo "Setup complete! Run 'python app.py' to start the backend server."
