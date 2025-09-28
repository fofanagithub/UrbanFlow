# Orchestrator
- Publie les décisions (DB) vers Hedera HCS (Topic).
- Placeholder pour interactions smart contracts (Jour 3+).


## Créer un Topic
```bash
HEDERA_OPERATOR_ID=0.0.x HEDERA_OPERATOR_KEY=302e... npm run create-topic



---


## 7) Simulateur


**simulator/simulator.py** (complété)
```python
"""
Usage:
python simulator.py --target http://localhost:8000/ingest --rate 2 --scenario spike --sensor sensor_a
"""
import requests, time, argparse, random
from datetime import datetime


def gen_value(scenario: str, t: int) -> float:
    if scenario == "spike":
        return random.uniform(15, 30) if (t // 10) % 2 else random.uniform(2, 6)
    return random.uniform(1, 8)


def main():
    p = argparse.ArgumentParser()
    p.add_argument('--target', default='http://localhost:8000/ingest')
    p.add_argument('--rate', type=float, default=1.0)
    p.add_argument('--scenario', choices=['normal','spike'], default='normal')
    p.add_argument('--sensor', default='sensor_a')
    args = p.parse_args()


    period = 1.0 / max(args.rate, 0.0001)
    t0 = time.time()
    print(f"Start simulateur → {args.target} | {args.scenario} | sensor={args.sensor}")
    while True:
        t = int(time.time() - t0)
        val = gen_value(args.scenario, t)
        payload = {"sensor_id": args.sensor, "queue_len": val, "payload": {"emitted_at": datetime.utcnow().isoformat()+'Z'}}
        try:
            r = requests.post(args.target, json=payload, timeout=3)
            r.raise_for_status()
            print(f"[{datetime.utcnow().isoformat()}Z] {val:.2f} → {r.status_code}")
        except Exception as e:
            print(f"send error: {e}")
        time.sleep(period)


if __name__ == '__main__':
    main()
