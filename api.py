import json
import logging
import time
import random
from functools import wraps
import firebase_admin
import functions_framework
from flask import Flask, request, jsonify, redirect, url_for, session, render_template
from datetime import datetime
from flask_cors import CORS
from flask_mail import Mail, Message
from firebase_admin import firestore, auth, credentials
# from auth import signup_user
from firebase_admin.firestore import GeoPoint
# from config import Config
import os
import requests
from google.cloud import firestore as gcf

# Firestore database instance
cred = credentials.Certificate("key.json")  # Load credentials
firebase_admin.initialize_app(cred)  # Initialize Firebase Admin SDK
db = firestore.client()  # Now create Firestore client

# Initialize Flask app
quicklyapp = Flask(__name__)

# Secret key for sessions
quicklyapp.secret_key = os.urandom(24)

CORS(quicklyapp)

# @quicklyapp.after_request
# def apply_cors_headers(response):
#     response.headers.add("Access-Control-Allow-Origin", "*")
#     response.headers.add("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
#     response.headers.add("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With")
#     return response

# @quicklyapp.before_request
# def handle_preflight():
#     if request.method == "OPTIONS":
#         response = jsonify({"message": "CORS preflight request successful"})
#         response.headers.add("Access-Control-Allow-Origin", "*")
#         response.headers.add("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
#         response.headers.add("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With")
#         response.headers.add("Access-Control-Max-Age", "3600")
#         return response, 204

# Paystack test secret key

quicklyapp.config['MAIL_SERVER'] = 'smtp.gmail.com'
quicklyapp.config['MAIL_PORT'] = 465
quicklyapp.config['MAIL_USERNAME'] = 'quicklyfoodapp@gmail.com'
quicklyapp.config['MAIL_PASSWORD'] = 'gtjumrsvwtivumof'
quicklyapp.config['MAIL_USE_SSL'] = True


def signup_user(email, password, name, profile_image):
    user = auth.create_user(
        email=email,
        password=password,
        display_name=name,
    )
    user_record = {
        'email': email,
        'name': name,
        'profile_image': '',
    }
    db.collection('users').document(email).set(user_record)
    
    return user

# Initialize Flask-Mail
mail = Mail(quicklyapp)

# Sending email verification link
def send_verification_email(user):
    link = auth.generate_email_verification_link(user.email)
    msg = Message('Verify your email',
                  sender='donorrec@gmail.com',
                  recipients=[user.email])
    msg.html = f"""
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <style>
            body {{
                font-family: Arial, sans-serif;
            }}
            .email-content {{
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
                border: 1px solid #ddd;
                border-radius: 10px;
            }}
            .email-content p {{
                line-height: 1.5;
            }}
            .email-content a {{
                color: #1a73e8;
                text-decoration: none;
            }}
            .email-content a:hover {{
                text-decoration: underline;
            }}
            .email-signature {{
                margin-top: 20px;
            }}
        </style>
    </head>
    <body>
        <div class="email-content">
            <p>Hi {user.display_name},</p>
            <br>
            <p>Thanks for signing up to Donorec! Please verify your email by clicking on the link below:</p>
            <p><a href="{link}">Verify Email</a></p>
            <p>Welcome aboard!</p>
            <br>
            <div class="email-signature">
                <b>Regards,</b>
                <p>Donorec Team</p>
            </div>
        </div>
    </body>
    </html>
    """
    mail.send(msg)

# Sending welcome email
def send_welcome_email(user):
    msg = Message('Welcome to Quickly Food Ordering App',
                  sender='quicklyfoodapp@gmail.com',
                  recipients=[user.email])
    msg.html = f"""
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <style>
            body {{
                font-family: Arial, sans-serif;
            }}
            .email-content {{
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
                border: 1px solid #ddd;
                border-radius: 10px;
            }}
            .email-content p {{
                line-height: 1.5;
            }}
            .email-signature {{
                margin-top: 20px;
            }}
            .logo {{
                display: block;
                margin: 0 auto 20px;
                max-width: 100%;
            }}
        </style>
    </head>
    <body>
        <div class="email-content">
            <img src="./images/quickly-logo.png" alt="Quickly Logo" class="logo"/>
            <p>Hi {user.display_name},</p>
            <p>Thanks for signing up to Quickly! Your journey to gaining weight and staying healthy has just commenced!</p>
            <p>Welcome aboard!</p>
            <br>
            <div class="email-signature">
                <b>Regards,</b>
                <p>Quickly Team</p>
            </div>
        </div>
    </body>
    </html>
    """
    mail.send(msg)

# Delaying the welcome email after sending the verification email
def delayed_welcome_email(user):
    time.sleep(20)
    send_welcome_email(user)

logging.basicConfig(level=logging.INFO)  # Set the desired log level

@functions_framework.http
def server(request):
    path = request.path

    # Log the request path
    logging.info(f"Received request path: {path}")

    if request.method == 'OPTIONS':
        return handle_preflight()

    if request.method == 'POST':
        if path == '/signup':
            return signup()
        elif path == '/login':
            return login()

def handle_preflight():
    """Handles CORS preflight requests."""
    response = jsonify({'message': 'CORS preflight request successful'})
    response.headers.add("Access-Control-Allow-Origin", "*")
    response.headers.add("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
    response.headers.add("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With")
    return response, 200


@quicklyapp.route('/signup', methods=['POST', 'OPTIONS'])
def signup():
    if request.method == "OPTIONS":  
        return handle_preflight()

    try:
        data = request.get_json()

        # Check if any required field is missing or empty
        required_fields = ['email', 'password', 'name']
        for field in required_fields:
            if field not in data or not data.get(field):
                return jsonify({'error': f'Missing or empty required field: {field}'}), 400

        # Extract specific fields
        email = data['email']
        password = data['password']
        name = data['name']
        profile_image = ''

        # Validate email format
        if not (email.endswith('@ashesi.edu.gh') or email.endswith('@gmail.com')):
            return jsonify({'error': 'Email must end with @ashesi.edu.gh or @gmail.com'}), 400

        # Validate password complexity
        if len(password) < 8 or not any(char in '!@#$%^&*()_+-={}[]|\\:;"\'<>,.?/~`' for char in password):
            return jsonify({'error': 'Password must be at least 8 characters long and contain at least one special character'}), 400

        # Check if profile already exists in the database
        query = db.collection('users').where('email', '==', email)
        existing_records = query.stream()

        if len(list(existing_records)) > 0:
            return jsonify({'error': 'User with this email already exists.'}), 400

        # Sign up user
        user = signup_user(email, password, name, profile_image)

        # Verify if email is verified immediately after signup (it will be False)
        user_record = auth.get_user(user.uid)
        email_verified = user_record.email_verified
        send_verification_email(user)
        return jsonify({
            'message': f'User created successfully. Please check your email {email} to verify your account.',
            'email_verified': email_verified
        }), 201
    except Exception as e:
        logging.error(f"Error during signup: {str(e)}")
        return jsonify({'error': str(e)}), 400

@quicklyapp.route('/login', methods=['POST'])
def login():
    data = json.loads(request.data)
    email = data.get('email')
    password = data.get('password')

    if not email or not password:
        return jsonify({'error': 'Email and password are required'}), 400

    try:
        # Firebase Auth REST API endpoint for signing in with email and password
        firebase_auth_url = "https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword"
        api_key = "AIzaSyDn9yhKnKVYdtzrEAAUZTlYzJowmxUJUos"  

        payload = {
            "email": email,
            "password": password,
            "returnSecureToken": True
        }

        # Make a request to Firebase Auth REST API
        response = requests.post(firebase_auth_url, params={"key": api_key}, json=payload)
        response_data = response.json()

        if response.status_code != 200:
            return jsonify({'error': response_data.get('error', {}).get('message', 'An error occurred')}), 400

        id_token = response_data['idToken']

        # Verify the ID token using Firebase Admin SDK
        decoded_token = auth.verify_id_token(id_token)
        
        user_record = db.collection('users').document(email).get()
        if user_record.exists:
            user_data = user_record.to_dict()
            session['user'] = {
                'email': email,
                'name': user_data.get('name')
            }
            session.modified = True  # Ensure session is saved
            return jsonify({
                'message': 'Login successful',
                'redirect': '/Landing/index.html',
                'name': user_data.get('name')
            }), 200
        else:
            return jsonify({'error': 'User record not found'}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 400
    
    
if __name__ == '__main__':
    quicklyapp.run(debug=True, port=5000)


