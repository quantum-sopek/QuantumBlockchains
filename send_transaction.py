import requests

headers = {
  'Content-Type': 'application/json',
}

data = '{"transaction":"rebel"}'

response = requests.post('http://0.0.0.0:3015/send-transaction', headers=headers, data=data)
