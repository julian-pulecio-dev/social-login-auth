import json
import boto3
from urllib3 import PoolManager
from urllib.parse import urlencode

client = boto3.client('cognito-idp', region_name='us-east-1')

def lambda_handler(event, context):
    # Get authorization code from frontend
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
    return {
    "statusCode": 200,
    "headers": {
        "Access-Control-Allow-Origin": "http://localhost:5173",
        'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
        "Access-Control-Allow-Methods": "POST,OPTIONS",
        'Access-Control-Allow-Credentials': True
    },
    "body": "Hello from protected lambda!"
}
