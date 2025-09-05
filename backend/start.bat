@echo off
echo Starting Hotel Reservation Backend...
echo.

REM Check if virtual environment exists
if not exist "venv" (
    echo Creating virtual environment...
    python -m venv venv
    echo Virtual environment created.
    echo.
)

REM Activate virtual environment
echo Activating virtual environment...
call venv\Scripts\activate

REM Install requirements if not already installed
echo Installing requirements...
pip install -r requirements.txt

REM Create .env file if it doesn't exist
if not exist ".env" (
    echo Creating .env file from template...
    copy env.example .env
    echo Please edit .env file with your configuration before continuing.
    echo.
    pause
)

REM Start the Flask application
echo Starting Flask application...
echo API will be available at: http://localhost:5000
echo Press Ctrl+C to stop the server
echo.
python app.py

pause
