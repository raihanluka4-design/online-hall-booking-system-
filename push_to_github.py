import os
import sys
import json
import urllib.request
import urllib.error
import base64
from pathlib import Path

def upload_folder_to_github():
    print("=========================================================")
    print("  AUTOMATIC GITHUB UPLOADER FOR HALL BOOKING SYSTEM")
    print("=========================================================\n")
    
    token = input("Enter your GitHub Personal Access Token (PAT): ").strip()
    repo = input("Enter your GitHub Repository (e.g. username/online-hall-booking-system): ").strip()

    if not token or not repo:
        print("Error: Token and Repository are required!")
        return

    if '/' not in repo:
        print("Error: Repository must be in 'username/reponame' format!")
        return

    base_dir = Path(__file__).parent
    ignore_dirs = {'node_modules', '.git', '__pycache__', 'dist'}
    ignore_files = {'push_to_github.py', '.DS_Store', 'hall_booking.db-journal', 'hall_booking.db-wal'}

    files_to_upload = []
    for root, dirs, files in os.walk(base_dir):
        dirs[:] = [d for d in dirs if d not in ignore_dirs]
        for f in files:
            if f in ignore_files or f.endswith('.zip'):
                continue
            full_path = Path(root) / f
            rel_path = full_path.relative_to(base_dir).as_posix()
            files_to_upload.append((full_path, rel_path))

    print(f"\nFound {len(files_to_upload)} files to upload to GitHub repo '{repo}'...")

    headers = {
        "Authorization": f"token {token}",
        "Accept": "application/vnd.github.v3+json",
        "User-Agent": "Python-GitHub-Uploader"
    }

    success_count = 0
    for full_path, rel_path in files_to_upload:
        try:
            with open(full_path, "rb") as file_obj:
                content = base64.b64encode(file_obj.read()).decode('utf-8')

            url = f"https://api.github.com/repos/{repo}/contents/{rel_path}"
            
            # Check if file exists to get sha
            sha = None
            try:
                check_req = urllib.request.Request(url, headers=headers, method="GET")
                with urllib.request.urlopen(check_req) as resp:
                    data = json.loads(resp.read().decode('utf-8'))
                    sha = data.get('sha')
            except urllib.error.HTTPError:
                pass

            payload = {
                "message": f"Add {rel_path} - Online Hall Booking System",
                "content": content
            }
            if sha:
                payload["sha"] = sha

            json_data = json.dumps(payload).encode('utf-8')
            put_req = urllib.request.Request(url, data=json_data, headers=headers, method="PUT")
            
            with urllib.request.urlopen(put_req) as resp:
                if resp.status in (200, 201):
                    print(f" [OK] Uploaded: {rel_path}")
                    success_count += 1
        except Exception as e:
            print(f" [X] Failed to upload {rel_path}: {e}")

    print(f"\n=========================================================")
    print(f" SUCCESS: Uploaded {success_count} / {len(files_to_upload)} files to GitHub!")
    print(f" Repository URL: https://github.com/{repo}")
    print(f"=========================================================")

if __name__ == "__main__":
    upload_folder_to_github()
