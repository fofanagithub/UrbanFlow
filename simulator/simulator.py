"""
Simulateur simple qui envoie des POST /ingest au backend.

Usage:
python simulator.py --target http://localhost:8000/ingest --rate 1 --scenario normal
python simulator.py --target http://localhost:8000/ingest --rate 5 --scenario spike

Scénarios:
- normal : envoie valeurs aléatoires basses
- spike  : envoie pendant une courte période des valeurs élevées
"""
import requests
import time
import argparse
import random
from datetime import datetime

parser = argparse.ArgumentParser()
parser.add_argument('--target', default='http://localhost:8000/ingest')
parser.add_argument('--rate', type=float, default=1.0, help='messages per second')
parser.add_argument('--scenario', choices=['normal', 'spike'], default='normal')
parser.add_argument('--sensor-prefix', default='junction-', help='sensor id prefix')
parser.add_argument('--junctions', type=int, default=5)
args = parser.parse_args()

interval = 1.0 / max(0.1, args.rate)
print('Simulator target:', args.target, '| rate:', args.rate, '| scenario:', args.scenario)

def generate_reading(junction_id: str, scenario: str):
    if scenario == "normal":
        qlen = random.randint(10, 50)   # trafic faible/modéré
    elif scenario == "spike":
        qlen = random.randint(100, 300) if random.random() < 0.8 else random.randint(20, 60)
    else:
        qlen = random.randint(0, 100)

    return {
        "sensor_id": junction_id,
        "timestamp": datetime.utcnow().isoformat(),
        "queue_len": qlen
    }


try:
    while True:
        for i in range(args.junctions):
            sensor_id = f"{args.sensor_prefix}{i}"
            payload = generate_reading(sensor_id, args.scenario)
            try:
                r = requests.post(args.target, json=payload, timeout=2)
                print(f"[{sensor_id}] -> {r.status_code} {r.text.strip()}")
            except Exception as e:
                print(f"Error sending to {args.target}: {e}")
            time.sleep(interval)
except KeyboardInterrupt:
    print("Simulation stopped.")
