import webbrowser
import sys
import os
import time
from pathlib import Path

# Add project dir to path
sys.path.insert(0, str(Path(__file__).parent))

from server import run

if __name__ == "__main__":
    print("Launching Online Hall Booking System...")
    webbrowser.open("https://127.0.0.1:8443")
    run()
