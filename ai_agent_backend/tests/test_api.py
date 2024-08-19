import requests
import json

def test_create_task():
    url = 'https://backengine-hgd2mg58.fly.dev/tasks'
    headers = {'Content-Type': 'application/json'}
    data = {
        'modelId': 'model_1',
        'taskType': 'text-generation',
        'inputData': 'Generate a poem about AI.'
    }

    response = requests.post(url, headers=headers, json=data)
    print(f"Status Code: {response.status_code}")
    print(f"Response: {response.json()}")

if __name__ == "__main__":
    test_create_task()