
@echo off
echo Setting up Fuzzer Backend...

rem Create a virtual environment
echo Creating virtual environment...
python -m venv venv

rem Activate the virtual environment
echo Activating virtual environment...
call venv\Scripts\activate.bat

rem Install dependencies
echo Installing dependencies...
pip install -r requirements.txt

rem Check if webfuzzer.py exists or is empty
if not exist webfuzzer.py (
    echo Warning: webfuzzer.py doesn't exist.
    echo Please copy your WebFuzzer class implementation into webfuzzer.py.
) else (
    for %%F in (webfuzzer.py) do if %%~zF==0 (
        echo Warning: webfuzzer.py is empty.
        echo Please copy your WebFuzzer class implementation into webfuzzer.py.
    )
)

rem Check if ML models exist
if not exist anomaly_model.pkl (
    echo Warning: anomaly_model.pkl not found.
    echo Please copy your trained models to this directory.
)

if not exist classifier_model.pkl (
    echo Warning: classifier_model.pkl not found.
    echo Please copy your trained models to this directory.
)

echo Setup complete! Run 'python app.py' to start the backend server.
pause
