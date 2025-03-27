
# Fuzzer Backend Server

This backend server bridges your React frontend with the Python web fuzzing and machine learning system.

## Setup Instructions

1. Copy your WebFuzzer class into `webfuzzer.py` in this directory
2. Copy your machine learning models (anomaly_model.pkl and classifier_model.pkl) to this directory
3. Install the required Python dependencies:

```bash
pip install -r requirements.txt
```

4. Start the backend server:

```bash
python app.py
```

The server will run on http://localhost:5000 by default.

## API Endpoints

- `POST /api/start-fuzzing` - Start a new fuzzing scan
- `POST /api/stop-fuzzing` - Stop an ongoing fuzzing scan
- `GET /api/fuzzing-results` - Get current fuzzing results
- `GET /api/anomaly-analysis` - Get ML analysis of current results
- `POST /api/upload-wordlist` - Upload a custom wordlist file

## Configuration

You may need to modify the `app.py` file to adjust paths to your wordlist files and model files, depending on your system setup.

## Troubleshooting

If you encounter CORS issues, make sure your frontend is accessing the backend at the correct URL (http://localhost:5000 by default). The backend has CORS enabled for all origins for development purposes.

## Integration with WebFuzzer

The backend server acts as a wrapper around your WebFuzzer class, providing a RESTful API interface for the React frontend to interact with. The WebFuzzer class is instantiated when a fuzzing scan is started and runs in a separate thread to prevent blocking the API server.
