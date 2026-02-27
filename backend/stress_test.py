import requests
import time
import json

BASE_URL = "http://127.0.0.1:8000/api"
NUM_REQUESTS = 20  # Reduced to 20 for quicker demonstration

def run_stress_test():
    print(f"🚀 Starting stress test: {NUM_REQUESTS} payment requests...")
    
    # 1. Fetch trip ID 1 (assuming it exists from migrations/seeds)
    try:
        trip_res = requests.get(f"{BASE_URL}/trips/1/")
        if trip_res.status_code != 200:
            print("❌ Error: Could not fetch trip ID 1. Make sure the server is running and database is seeded.")
            return
    except Exception as e:
        print(f"❌ Error connecting to server: {e}")
        return

    success_count = 0
    fail_count = 0
    
    payload = {
        "trip_id": 1,
        "student_name": "Test Student",
        "parent_name": "Test Parent",
        "card_number": "1111 2222 3333 4444",
        "expiry_date": "12/28",
        "cvv": "999"
    }

    for i in range(1, NUM_REQUESTS + 1):
        print(f"[{i}/{NUM_REQUESTS}] Processing payment...", end="\r")
        try:
            res = requests.post(f"{BASE_URL}/payments/", json=payload)
            if res.status_code == 201:
                success_count += 1
            elif res.status_code == 402:
                fail_count += 1
                print(f"\n   ⚠️ Attempt {i} declined: {res.json().get('error')}")
            else:
                print(f"\n   ❌ Attempt {i} unexpected error: {res.status_code}")
        except Exception as e:
            print(f"\n   ❌ Attempt {i} connection failed: {e}")
        
    print("\n\n" + "="*30)
    print("      STRESS TEST RESULTS")
    print("="*30)
    print(f"Total Requests: {NUM_REQUESTS}")
    print(f"Successes:      {success_count}")
    print(f"Declined:       {fail_count} (Expected ~10%)")
    print(f"Success Rate:   {(success_count/NUM_REQUESTS)*100:.1f}%")
    print("="*30)

if __name__ == "__main__":
    run_stress_test()
