import requests

def verify_token(token: str):
    response = requests.post("http://verification-service:8000/validate_token", json={"token": token})
    if response.status_code == 200:
        return response.json()["user"]
    else:
        raise Exception("Invalid token")