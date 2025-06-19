import json
import boto3
import os
from urllib3 import PoolManager
from urllib.parse import urlencode

client = boto3.client('cognito-idp', region_name='us-east-1')

SOCIAL_AUTH_USER_POOL_DOMAIN = os.environ.get("SOCIAL_AUTH_USER_POOL_DOMAIN")
SOCIAL_AUTH_USER_POOL_CLIENT_ID = os.environ.get("SOCIAL_AUTH_USER_POOL_CLIENT_ID")
CALLBACK_URL = os.environ.get("CALLBACK_URL")

def lambda_handler(event, context):
    if event["httpMethod"] == "OPTIONS":
        return {
            "statusCode": 204,
            "headers": {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Headers": "Content-Type,Authorization",
                "Access-Control-Allow-Methods": "OPTIONS,POST"
            },
            "body": ""
        }
    # Get authorization code from frontend
    print(event)
    body = json.loads(event['body'])
    print(body)
    code = body['code']

    # COGNITO_DOMAIN = "social-auth-domain.auth.us-east-1.amazoncognito.com"
    # CLIENT_ID = "107orefmav9hv22tcpi90bganv"
    # REDIRECT_URI = "http://localhost:5173/social-login-confirm-code"

    print('SOCIAL_AUTH_USER_POOL_DOMAIN:', SOCIAL_AUTH_USER_POOL_DOMAIN)
    print('SOCIAL_AUTH_USER_POOL_CLIENT_ID:', SOCIAL_AUTH_USER_POOL_CLIENT_ID)
    print('CALLBACK_URL:', CALLBACK_URL)


    # Token endpoint
    token_url = f"https://{SOCIAL_AUTH_USER_POOL_DOMAIN}/oauth2/token"

    # Prepare payload
    
    payload = {
        "grant_type": "authorization_code",
        "client_id": SOCIAL_AUTH_USER_POOL_CLIENT_ID,
        "code": code,
        "redirect_uri": CALLBACK_URL
    }

    print("Payload sent to Cognito:", payload)

    # Make the request
    headers = {
        "Content-Type": "application/x-www-form-urlencoded"
    }

    http = PoolManager()

    body = urlencode(payload).encode('utf-8')

    response = http.request(
        'POST',
        token_url,
        body=body,
        headers=headers
    )

    response = json.loads(response.data.decode('utf-8'))
    print('response:', response)

    return {
    "statusCode": 200,
    "headers": {
        "Access-Control-Allow-Origin": "http://localhost:5173",
        'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
        "Access-Control-Allow-Methods": "POST,OPTIONS",
        'Access-Control-Allow-Credentials': True
    },
    "body": json.dumps({
        'idToken': response.get('id_token'),
        'accessToken': response.get('access_token'),
        'refreshToken': response.get('refresh_token'),
        'expiresIn': response.get('expires_in'),
        'tokenType': response.get('token_type')
    })
}
