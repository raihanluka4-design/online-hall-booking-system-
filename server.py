import http.server
import socketserver
import json
import sqlite3
import os
import urllib.parse
import functools
import ssl
from pathlib import Path

PORT = 8443
DB_FILE = Path(__file__).parent / "hall_booking.db"
DIST_DIR = Path(__file__).parent / "dist"

def init_db():
    conn = sqlite3.connect(DB_FILE)
    cursor = conn.cursor()

    cursor.execute('''
        CREATE TABLE IF NOT EXISTS users (
            userId INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            phone TEXT,
            department TEXT,
            role TEXT NOT NULL,
            password TEXT NOT NULL
        )
    ''')

    cursor.execute('''
        CREATE TABLE IF NOT EXISTS halls (
            hallId INTEGER PRIMARY KEY AUTOINCREMENT,
            hallName TEXT NOT NULL,
            capacity INTEGER NOT NULL,
            location TEXT NOT NULL,
            type TEXT NOT NULL,
            facilities TEXT NOT NULL,
            description TEXT,
            status TEXT DEFAULT 'AVAILABLE'
        )
    ''')

    cursor.execute('''
        CREATE TABLE IF NOT EXISTS bookings (
            bookingId INTEGER PRIMARY KEY AUTOINCREMENT,
            userId INTEGER NOT NULL,
            hallId INTEGER NOT NULL,
            date TEXT NOT NULL,
            timeSlot TEXT NOT NULL,
            purpose TEXT NOT NULL,
            status TEXT DEFAULT 'CONFIRMED',
            createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (userId) REFERENCES users (userId),
            FOREIGN KEY (hallId) REFERENCES halls (hallId)
        )
    ''')

    # Seed initial data if empty
    cursor.execute("SELECT COUNT(*) FROM users")
    if cursor.fetchone()[0] == 0:
        cursor.executemany('''
            INSERT INTO users (name, email, phone, department, role, password)
            VALUES (?, ?, ?, ?, ?, ?)
        ''', [
            ("Mrs. Shana Musthafa APV", "admin@example.com", "9876543210", "AI & ML", "ADMIN", "admin123"),
            ("Mishal Shahil", "student@example.com", "9876543211", "AI & ML", "STUDENT", "student123"),
            ("Muhammed Zaeem P.A", "zaeem@example.com", "9876543212", "AI & ML", "STUDENT", "pass123"),
            ("Najwa A", "najwa@example.com", "9876543213", "AI & ML", "STUDENT", "pass123"),
            ("Shahma Sheriff", "shahma@example.com", "9876543214", "AI & ML", "STUDENT", "pass123"),
            ("Pranab B Murali", "pranab@example.com", "9876543215", "AI & ML", "STUDENT", "pass123")
        ])

    cursor.execute("SELECT COUNT(*) FROM halls")
    if cursor.fetchone()[0] == 0:
        cursor.executemany('''
            INSERT INTO halls (hallName, capacity, location, type, facilities, description, status)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        ''', [
            ("Main Auditorium", 500, "Block A, 1st Floor", "Auditorium", "Air Conditioning, 4K Projector, Sound System, Stage, Wi-Fi", "Premier venue for major college functions, annual day, and tech fests.", "AVAILABLE"),
            ("Aryabhatta Seminar Hall", 150, "Block B, 2nd Floor", "Seminar Hall", "Air Conditioning, Projector, Sound System, Smart Board", "Modern seminar hall equipped with interactive display and acoustics.", "AVAILABLE"),
            ("Turing AI Lab Conference Hall", 80, "AI & ML Dept, 3rd Floor", "Mini Conference Hall", "Air Conditioning, High-Speed Wi-Fi, Smart Board", "High-tech conference space for AI department reviews and presentations.", "AVAILABLE"),
            ("APJ Abdul Kalam Hall", 250, "Block C, Ground Floor", "Seminar Hall", "Air Conditioning, Projector, Sound System, Stage", "Spacious multipurpose hall suitable for lectures, symposiums, and cultural events.", "AVAILABLE")
        ])

    cursor.execute("SELECT COUNT(*) FROM bookings")
    if cursor.fetchone()[0] == 0:
        cursor.executemany('''
            INSERT INTO bookings (userId, hallId, date, timeSlot, purpose, status)
            VALUES (?, ?, ?, ?, ?, ?)
        ''', [
            (2, 1, "2026-09-30", "09:00 AM - 11:00 AM", "PBCST304 Review 1 Presentation", "CONFIRMED"),
            (3, 2, "2026-09-30", "11:00 AM - 01:00 PM", "AI & ML Department Workshop", "CONFIRMED")
        ])

    conn.commit()
    conn.close()

class CustomHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):

    def do_GET(self):
        parsed_path = urllib.parse.urlparse(self.path)
        path = parsed_path.path

        if path == "/api/halls":
            self.handle_get_halls()
            return
        elif path == "/api/bookings":
            self.handle_get_bookings()
            return
        elif path == "/api/reports":
            self.handle_get_reports()
            return

        # Serve static files from DIST_DIR
        req_file = (DIST_DIR / path.lstrip('/')).resolve()
        if req_file.is_file() and os.path.commonpath([DIST_DIR, req_file]) == str(DIST_DIR):
            return super().do_GET()

        # SPA routing fallback to index.html
        self.path = '/index.html'
        return super().do_GET()

    def do_POST(self):
        content_length = int(self.headers.get('Content-Length', 0))
        post_data = self.rfile.read(content_length) if content_length > 0 else b'{}'
        try:
            data = json.loads(post_data.decode('utf-8'))
        except Exception:
            data = {}

        parsed_path = urllib.parse.urlparse(self.path)
        path = parsed_path.path

        if path == "/api/login":
            self.handle_login(data)
        elif path == "/api/register":
            self.handle_register(data)
        elif path == "/api/bookings":
            self.handle_create_booking(data)
        elif path == "/api/bookings/cancel":
            self.handle_cancel_booking(data)
        else:
            self.send_json_response({"error": "Endpoint not found"}, status=404)

    def send_json_response(self, data, status=200):
        response_bytes = json.dumps(data).encode('utf-8')
        self.send_response(status)
        self.send_header('Content-Type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Content-Length', str(len(response_bytes)))
        self.end_headers()
        self.wfile.write(response_bytes)

    def handle_login(self, data):
        email = data.get('email', '').strip().lower()
        password = data.get('password', '')

        conn = sqlite3.connect(DB_FILE)
        cursor = conn.cursor()
        cursor.execute("SELECT userId, name, email, phone, department, role FROM users WHERE LOWER(email)=? AND password=?", (email, password))
        row = cursor.fetchone()
        conn.close()

        if row:
            user = {
                "userId": str(row[0]),
                "name": row[1],
                "email": row[2],
                "phone": row[3],
                "department": row[4],
                "role": row[5]
            }
            self.send_json_response({"success": True, "user": user})
        else:
            self.send_json_response({"success": False, "error": "Invalid email address or password."}, status=401)

    def handle_register(self, data):
        name = data.get('name', '').strip()
        email = data.get('email', '').strip().lower()
        phone = data.get('phone', '').strip()
        department = data.get('department', 'AI & ML').strip()
        password = data.get('password', '')
        role = data.get('role', 'STUDENT')

        if not name or not email or not password:
            self.send_json_response({"success": False, "error": "Name, email, and password are required."}, status=400)
            return

        conn = sqlite3.connect(DB_FILE)
        cursor = conn.cursor()
        try:
            cursor.execute("INSERT INTO users (name, email, phone, department, role, password) VALUES (?, ?, ?, ?, ?, ?)",
                           (name, email, phone, department, role, password))
            user_id = cursor.lastrowid
            conn.commit()
            user = {
                "userId": str(user_id),
                "name": name,
                "email": email,
                "phone": phone,
                "department": department,
                "role": role
            }
            self.send_json_response({"success": True, "user": user})
        except sqlite3.IntegrityError:
            self.send_json_response({"success": False, "error": "Email is already registered."}, status=409)
        finally:
            conn.close()

    def handle_get_halls(self):
        conn = sqlite3.connect(DB_FILE)
        cursor = conn.cursor()
        cursor.execute("SELECT hallId, hallName, capacity, location, type, facilities, description, status FROM halls")
        rows = cursor.fetchall()
        conn.close()

        halls = []
        for r in rows:
            halls.append({
                "hallId": str(r[0]),
                "hallName": r[1],
                "capacity": r[2],
                "location": r[3],
                "type": r[4],
                "facilities": [f.strip() for f in r[5].split(',')],
                "description": r[6],
                "status": r[7]
            })
        self.send_json_response(halls)

    def handle_get_bookings(self):
        conn = sqlite3.connect(DB_FILE)
        cursor = conn.cursor()
        cursor.execute('''
            SELECT b.bookingId, b.userId, u.name, b.hallId, h.hallName, b.date, b.timeSlot, b.purpose, b.status
            FROM bookings b
            JOIN users u ON b.userId = u.userId
            JOIN halls h ON b.hallId = h.hallId
            ORDER BY b.bookingId DESC
        ''')
        rows = cursor.fetchall()
        conn.close()

        bookings = []
        for r in rows:
            bookings.append({
                "bookingId": str(r[0]),
                "userId": str(r[1]),
                "userName": r[2],
                "hallId": str(r[3]),
                "hallName": r[4],
                "date": r[5],
                "timeSlot": r[6],
                "purpose": r[7],
                "status": r[8]
            })
        self.send_json_response(bookings)

    def handle_create_booking(self, data):
        user_id = data.get('userId')
        hall_id = data.get('hallId')
        date = data.get('date')
        time_slot = data.get('timeSlot')
        purpose = data.get('purpose')

        conn = sqlite3.connect(DB_FILE)
        cursor = conn.cursor()

        # Conflict check
        cursor.execute('''
            SELECT bookingId FROM bookings
            WHERE hallId=? AND date=? AND timeSlot=? AND status='CONFIRMED'
        ''', (hall_id, date, time_slot))
        if cursor.fetchone():
            conn.close()
            self.send_json_response({"success": False, "error": f"Conflict detected! Hall #{hall_id} is already booked for slot '{time_slot}' on {date}."}, status=409)
            return

        cursor.execute('''
            INSERT INTO bookings (userId, hallId, date, timeSlot, purpose, status)
            VALUES (?, ?, ?, ?, ?, 'CONFIRMED')
        ''', (user_id, hall_id, date, time_slot, purpose))
        booking_id = cursor.lastrowid
        conn.commit()
        conn.close()

        self.send_json_response({"success": True, "bookingId": str(booking_id)})

    def handle_cancel_booking(self, data):
        booking_id = data.get('bookingId')
        conn = sqlite3.connect(DB_FILE)
        cursor = conn.cursor()
        cursor.execute("UPDATE bookings SET status='CANCELLED' WHERE bookingId=?", (booking_id,))
        conn.commit()
        conn.close()
        self.send_json_response({"success": True})

    def handle_get_reports(self):
        conn = sqlite3.connect(DB_FILE)
        cursor = conn.cursor()
        cursor.execute("SELECT COUNT(*) FROM halls")
        total_halls = cursor.fetchone()[0]
        cursor.execute("SELECT COUNT(*) FROM bookings WHERE status='CONFIRMED'")
        total_confirmed = cursor.fetchone()[0]
        cursor.execute("SELECT COUNT(*) FROM bookings WHERE status='CANCELLED'")
        total_cancelled = cursor.fetchone()[0]
        conn.close()

        self.send_json_response({
            "totalHalls": total_halls,
            "confirmedBookings": total_confirmed,
            "cancelledBookings": total_cancelled
        })

def run():
    init_db()
    
    # Import and ensure SSL certificate
    from generate_cert import generate_self_signed_cert
    cert_file, key_file = generate_self_signed_cert()
    
    ssl_context = ssl.SSLContext(ssl.PROTOCOL_TLS_SERVER)
    ssl_context.load_cert_chain(certfile=cert_file, keyfile=key_file)
    
    handler = functools.partial(CustomHTTPRequestHandler, directory=str(DIST_DIR))
    http.server.HTTPServer.allow_reuse_address = True
    httpd = http.server.HTTPServer(("", PORT), handler)
    httpd.socket = ssl_context.wrap_socket(httpd.socket, server_side=True)
    
    print(f"=========================================================")
    print(f"  Online Hall Booking System SECURE HTTPS Web App running on Port {PORT}")
    print(f"  Access URL: https://127.0.0.1:{PORT}")
    print(f"  LAN Access: https://172.30.11.217:{PORT}")
    print(f"  SQLite DB: {DB_FILE}")
    print(f"=========================================================")
    httpd.serve_forever()

if __name__ == "__main__":
    run()
